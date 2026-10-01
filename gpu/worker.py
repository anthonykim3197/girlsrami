import base64
import io
import json
import os
import re
import stat
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from uuid import UUID

from PIL import Image, ImageOps

MAX_IMAGE_BYTES = 7 * 1024 * 1024
FAILURE_CODES = {"IMAGE_FETCH_FAILED", "IMAGE_DECODE_FAILED", "INFERENCE_FAILED", "RESULT_UPLOAD_FAILED"}


class WorkerError(Exception):
    pass


def read_token(path: Path) -> str:
    try:
        descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
        with os.fdopen(descriptor) as source:
            metadata = os.fstat(source.fileno())
            if not stat.S_ISREG(metadata.st_mode) or metadata.st_uid != os.getuid() or metadata.st_mode & 0o077:
                raise WorkerError("TOKEN_FILE_MUST_BE_PRIVATE")
            value = source.read(257).strip()
    except OSError:
        raise WorkerError("TOKEN_FILE_UNAVAILABLE") from None
    if not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", value):
        raise WorkerError("INVALID_WORKER_TOKEN")
    return value


class SafeRedirect(HTTPRedirectHandler):
    def __init__(self, validate_image_url):
        self.validate_image_url = validate_image_url

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if req.get_header("Authorization"):
            raise WorkerError("WORKER_REDIRECT_REFUSED")
        self.validate_image_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class WorkerClient:
    def __init__(self, endpoint: str, token: str, *, opener=None):
        parsed = urlsplit(endpoint)
        if not re.fullmatch(r"https://[a-z0-9]+\.supabase\.co/functions/v1/fitting-worker", endpoint):
            raise WorkerError("INVALID_WORKER_ENDPOINT")
        if not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", token):
            raise WorkerError("INVALID_WORKER_TOKEN")
        self.endpoint = endpoint
        self.token = token
        self.image_hosts = {parsed.hostname, "girlslami.com", "www.girlslami.com"}
        self.redirect_handler = SafeRedirect(self.validate_image_url)
        self.open = opener or build_opener(self.redirect_handler).open

    def validate_image_url(self, value: str) -> None:
        try:
            parsed = urlsplit(value)
            valid = parsed.scheme == "https" and parsed.hostname in self.image_hosts and not parsed.username and not parsed.password and parsed.port in (None, 443) and not parsed.fragment and len(value) <= 8192
        except (TypeError, ValueError):
            valid = False
        if not valid:
            raise WorkerError("IMAGE_FETCH_FAILED")

    def call(self, payload: dict) -> dict:
        request = Request(self.endpoint, data=json.dumps(payload).encode(), headers={
            "Content-Type": "application/json", "Authorization": "Bearer " + self.token,
        })
        try:
            with self.open(request, timeout=60) as response:
                body = response.read(65537)
            if len(body) > 65536:
                raise WorkerError("INVALID_WORKER_RESPONSE")
            data = json.loads(body)
        except HTTPError as error:
            code = error.code
            error.close()
            raise WorkerError(f"WORKER_HTTP_{code}") from None
        except (URLError, OSError, TimeoutError):
            raise WorkerError("WORKER_UNREACHABLE") from None
        except (ValueError, UnicodeError):
            raise WorkerError("INVALID_WORKER_RESPONSE") from None
        if not isinstance(data, dict):
            raise WorkerError("INVALID_WORKER_RESPONSE")
        return data

    def image(self, url: str) -> Image.Image:
        self.validate_image_url(url)
        try:
            with self.open(Request(url), timeout=30) as response:
                data = response.read(MAX_IMAGE_BYTES + 1)
        except (URLError, OSError, TimeoutError):
            raise WorkerError("IMAGE_FETCH_FAILED") from None
        if len(data) > MAX_IMAGE_BYTES:
            raise WorkerError("IMAGE_FETCH_FAILED")
        try:
            with Image.open(io.BytesIO(data)) as source:
                if source.format not in {"JPEG", "PNG", "WEBP"} or source.width * source.height > 20_000_000:
                    raise WorkerError("IMAGE_DECODE_FAILED")
                image = ImageOps.exif_transpose(source).convert("RGB")
            image.thumbnail((1536, 1536))
            image.info.clear()
            return image
        except (OSError, ValueError, Image.DecompressionBombError):
            raise WorkerError("IMAGE_DECODE_FAILED") from None


def process_job(client: WorkerClient, job: dict, generate) -> bool:
    try:
        for name in ("id", "lease"):
            value = job[name]
            parsed = UUID(value)
            if parsed.version not in range(1, 6) or str(parsed) != value.lower():
                raise ValueError("Invalid lease")
        if not all(isinstance(job.get(name), str) for name in ("personUrl", "productUrl")):
            raise ValueError("Missing photo URL")
    except (KeyError, TypeError, ValueError, AttributeError):
        raise WorkerError("INVALID_JOB") from None

    person = garment = output = None
    try:
        client.validate_image_url(job["personUrl"])
        client.validate_image_url(job["productUrl"])
        person = client.image(job["personUrl"])
        garment = client.image(job["productUrl"])
        try:
            output = generate(person, garment)
            with output.convert("RGB") as cleaned, io.BytesIO() as encoded:
                cleaned.info.clear()
                cleaned.save(encoded, format="JPEG", quality=92)
                image_bytes = encoded.getvalue()
            if len(image_bytes) > MAX_IMAGE_BYTES:
                raise WorkerError("INFERENCE_FAILED")
        except Exception:
            raise WorkerError("INFERENCE_FAILED") from None
        try:
            response = client.call({"action": "complete", "id": job["id"], "lease": job["lease"], "image": base64.b64encode(image_bytes).decode()})
            if not isinstance(response.get("accepted"), bool):
                raise WorkerError("INVALID_WORKER_RESPONSE")
        except WorkerError:
            raise WorkerError("RESULT_UPLOAD_FAILED") from None
        return response["accepted"]
    except WorkerError as error:
        if str(error) not in FAILURE_CODES:
            raise
        client.call({"action": "fail", "id": job["id"], "lease": job["lease"], "code": str(error)})
        return False
    finally:
        for image in (person, garment, output):
            if image is not None:
                image.close()
