import base64
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "gpu"))
from worker import WorkerClient, WorkerError, read_token, process_job
from PIL import Image

ENDPOINT = "https://example.supabase.co/functions/v1/fitting-worker"
TOKEN = "test-only-private-worker-token-32-chars"
JOB = {
    "id": "00000000-0000-4000-8000-000000000001",
    "lease": "00000000-0000-4000-8000-000000000002",
    "color": "Ivory",
    "personUrl": "https://example.supabase.co/storage/v1/object/sign/fitting-private/input.jpg?token=test",
    "productUrl": "https://girlslami.com/p-vneck-cable.jpg",
}


class Response(io.BytesIO):
    def __init__(self, content, content_type="application/json"):
        super().__init__(content)
        self.headers = {"Content-Type": content_type}


def jpeg():
    output = io.BytesIO()
    with Image.new("RGB", (16, 24), "ivory") as image:
        image.save(output, format="JPEG", exif=Image.Exif())
    return output.getvalue()


class GPUWorkerTests(unittest.TestCase):
    def test_unapproved_image_hosts_and_redirects_are_rejected_before_fetch(self):
        touched = []
        client = WorkerClient(ENDPOINT, TOKEN, opener=lambda *a, **kw: touched.append(a))
        for url in ["http://127.0.0.1/a", "https://attacker.example/a", "https://other.supabase.co/a", "https://girlslami.com:444/a", "https://secret@girlslami.com/a"]:
            with self.subTest(url=url), self.assertRaises(WorkerError):
                client.image(url)
        self.assertEqual(touched, [])
        request = Request("https://girlslami.com/a")
        with self.assertRaises(WorkerError):
            client.redirect_handler.redirect_request(request, None, 302, "", {}, "https://attacker.example/a")
        credential_request = Request(ENDPOINT, data=b"{}", headers={"Authorization": "Bearer " + TOKEN})
        with self.assertRaises(WorkerError):
            client.redirect_handler.redirect_request(credential_request, None, 302, "", {}, "https://example.supabase.co/other")

    def test_worker_token_requires_a_private_regular_file(self):
        with tempfile.TemporaryDirectory() as folder:
            token = Path(folder) / "token"
            token.write_text(TOKEN)
            token.chmod(0o644)
            with self.assertRaises(WorkerError):
                read_token(token)
            token.chmod(0o600)
            self.assertEqual(read_token(token), TOKEN)
            link = Path(folder) / "link"
            link.symlink_to(token)
            with self.assertRaises(WorkerError):
                read_token(link)

    def test_image_body_size_and_invalid_image_are_rejected(self):
        client = WorkerClient(ENDPOINT, TOKEN, opener=lambda *a, **kw: Response(b"x" * (7 * 1024 * 1024 + 1)))
        with self.assertRaisesRegex(WorkerError, "IMAGE_FETCH_FAILED"):
            client.image(JOB["personUrl"])
        client = WorkerClient(ENDPOINT, TOKEN, opener=lambda *a, **kw: Response(b"not-an-image"))
        with self.assertRaisesRegex(WorkerError, "IMAGE_DECODE_FAILED"):
            client.image(JOB["personUrl"])

    def test_preflight_authenticates_without_claiming_or_contacting_model_provider(self):
        sent = []
        def opener(request, **kwargs):
            sent.append((request.full_url, json.loads(request.data)))
            return Response(b'{"enabled":false}')
        client = WorkerClient(ENDPOINT, TOKEN, opener=opener)
        self.assertEqual(client.call({"action": "status"}), {"enabled": False})
        self.assertEqual(sent, [(ENDPOINT, {"action": "status"})])

    def test_generation_failure_reports_a_safe_code_and_releases_lease(self):
        sent = []
        def opener(request, **kwargs):
            if request.data is None:
                return Response(jpeg(), "image/jpeg")
            payload = json.loads(request.data)
            sent.append(payload)
            return Response(b'{"accepted":true}')
        def generate(person, garment):
            raise RuntimeError("private-photo-url?token=secret")
        self.assertFalse(process_job(WorkerClient(ENDPOINT, TOKEN, opener=opener), JOB, generate))
        self.assertEqual(sent, [{"action": "fail", "id": JOB["id"], "lease": JOB["lease"], "code": "INFERENCE_FAILED"}])

    def test_cancelled_completion_is_not_retried_or_treated_as_success(self):
        sent = []
        def opener(request, **kwargs):
            if request.data is None:
                self.assertIsNone(request.get_header("Authorization"))
                return Response(jpeg(), "image/jpeg")
            payload = json.loads(request.data)
            sent.append(payload)
            return Response(b'{"accepted":false}')
        def generate(person, garment):
            output = Image.new("RGB", (16, 24), "ivory")
            output.info["exif"] = b"private metadata"
            return output
        self.assertFalse(process_job(WorkerClient(ENDPOINT, TOKEN, opener=opener), JOB, generate))
        self.assertEqual(len(sent), 1)
        self.assertEqual(sent[0]["action"], "complete")
        with Image.open(io.BytesIO(base64.b64decode(sent[0]["image"]))) as output:
            self.assertEqual(output.format, "JPEG")
            self.assertFalse(output.getexif())

    def test_unauthorized_api_error_does_not_echo_credentials_or_private_response(self):
        def opener(request, **kwargs):
            raise HTTPError(request.full_url, 401, "token=" + TOKEN, {}, io.BytesIO(b"private response"))
        with self.assertRaises(WorkerError) as error:
            WorkerClient(ENDPOINT, TOKEN, opener=opener).call({"action": "status"})
        self.assertEqual(str(error.exception), "WORKER_HTTP_401")

    def test_incomplete_job_cannot_fetch_images(self):
        touched = []
        client = WorkerClient(ENDPOINT, TOKEN, opener=lambda *a, **kw: touched.append(a))
        with self.assertRaisesRegex(WorkerError, "INVALID_JOB"):
            process_job(client, {**JOB, "lease": "not-a-lease"}, lambda *a: None)
        self.assertEqual(touched, [])

    def test_disallowed_job_photo_releases_lease_without_fetching_person_photo(self):
        sent = []
        def opener(request, **kwargs):
            self.assertIsNotNone(request.data)
            sent.append(json.loads(request.data))
            return Response(b'{"accepted":true}')
        client = WorkerClient(ENDPOINT, TOKEN, opener=opener)
        try:
            accepted = process_job(client, {**JOB, "productUrl": "https://attacker.example/photo"}, lambda *a: None)
        except WorkerError:
            self.fail("An invalid photo must release its valid lease through a safe failure report.")
        self.assertFalse(accepted)
        self.assertEqual(sent, [{"action": "fail", "id": JOB["id"], "lease": JOB["lease"], "code": "IMAGE_FETCH_FAILED"}])


if __name__ == "__main__":
    unittest.main()
