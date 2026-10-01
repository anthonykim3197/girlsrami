import contextlib
import io
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "gpu"))
import run


class RunnerTests(unittest.TestCase):
    def args(self, cache, synthetic=False):
        return ["run.py", "--endpoint", "https://example.supabase.co/functions/v1/fitting-worker",
                "--token-file", str(cache / "token"), "--cache", str(cache), "--max-jobs", "1"] + (["--synthetic-test"] if synthetic else [])

    def test_synthetic_preflight_never_marks_production_enabled(self):
        client = Mock()
        client.call.return_value = {"enabled": True, "photo_intake_enabled": False}
        output = io.StringIO()
        with tempfile.TemporaryDirectory() as directory, patch.object(run, "WorkerClient", return_value=client), patch.object(run, "read_token", return_value="test-only-token-value-at-least-32-chars"):
            with patch.object(sys, "argv", self.args(Path(directory), True) + ["--check"]), contextlib.redirect_stdout(output):
                run.main()
        client.call.assert_called_once_with({"action": "test-status"})
        self.assertFalse(json.loads(output.getvalue())["photo_intake_enabled"])

    def test_disabled_production_never_imports_or_claims_gpu_work(self):
        client = Mock()
        client.call.return_value = {"enabled": False}
        with tempfile.TemporaryDirectory() as directory, patch.object(run, "WorkerClient", return_value=client), patch.object(run, "read_token", return_value="test-only-token-value-at-least-32-chars"):
            with patch.object(sys, "argv", self.args(Path(directory))), contextlib.redirect_stdout(io.StringIO()):
                run.main()
        client.call.assert_called_once_with({"action": "status"})

    def test_bounded_synthetic_runner_loads_local_pinned_directory_and_claims_only_test_queue(self):
        client = Mock()
        client.call.side_effect = [{"enabled": True, "photo_intake_enabled": False}, {"id": "test"}]
        pipe = Mock()
        pipe.components = {}
        pipe.to.return_value = pipe
        loader = Mock(return_value=pipe)
        torch = types.SimpleNamespace(cuda=Mock(), nn=types.SimpleNamespace(Module=type("Module", (), {})), bfloat16="bf16")
        torch.cuda.get_device_properties.return_value = types.SimpleNamespace(total_memory=24 * 2**30)
        diffusers = types.SimpleNamespace(Flux2KleinPipeline=types.SimpleNamespace(from_pretrained=loader))
        with tempfile.TemporaryDirectory() as directory:
            cache = Path(directory)
            snapshot = cache / "models--black-forest-labs--FLUX.2-klein-4B" / "snapshots" / run.REVISION
            snapshot.mkdir(parents=True)
            (snapshot / "model_index.json").write_text("{}")
            with patch.object(run, "WorkerClient", return_value=client), patch.object(run, "read_token", return_value="test-only-token-value-at-least-32-chars"), patch.object(run, "process_job", return_value=True):
                with patch.dict(sys.modules, {"torch": torch, "diffusers": diffusers}), patch.object(sys, "argv", self.args(cache, True)), contextlib.redirect_stdout(io.StringIO()):
                    run.main()
            loader.assert_called_once_with(str(snapshot), torch_dtype="bf16", local_files_only=True, token=False)
        self.assertEqual(client.call.call_args_list[1].args[0], {"action": "test-claim"})
        self.assertEqual(client.call.call_count, 2)


if __name__ == "__main__":
    unittest.main()
