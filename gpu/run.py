import argparse
import json
import os
import time
from pathlib import Path

from worker import WorkerClient, WorkerError, process_job, read_token

MODEL = "black-forest-labs/FLUX.2-klein-4B"
REVISION = "e7b7dc27f91deacad38e78976d1f2b499d76a294"


def main():
    parser = argparse.ArgumentParser(description="Process a bounded Girlsrami fitting queue with all model components in GPU memory.")
    parser.add_argument("--endpoint", required=True)
    parser.add_argument("--token-file", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--require-enabled", action="store_true")
    parser.add_argument("--max-seconds", type=int, default=1800)
    parser.add_argument("--max-jobs", type=int, default=10)
    args = parser.parse_args()
    if not 1 <= args.max_jobs <= 10 or not 30 <= args.max_seconds <= 1800:
        raise WorkerError("INVALID_SESSION_LIMIT")
    client = WorkerClient(args.endpoint, read_token(args.token_file))
    state = client.call({"action": "status"})
    if not isinstance(state.get("enabled"), bool):
        raise WorkerError("INVALID_WORKER_RESPONSE")
    print(json.dumps({"authenticated": True, "photo_intake_enabled": state["enabled"]}), flush=True)
    if args.require_enabled and not state["enabled"]:
        raise WorkerError("ENGINE_DISABLED")
    if args.check or not state["enabled"]:
        return

    os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"
    import torch
    from diffusers import Flux2KleinPipeline

    if not torch.cuda.is_available() or not torch.cuda.is_bf16_supported():
        raise WorkerError("CUDA_BF16_REQUIRED")
    if torch.cuda.get_device_properties(0).total_memory < 20 * 2**30:
        raise WorkerError("GPU_VRAM_TOO_SMALL")
    pipe = Flux2KleinPipeline.from_pretrained(MODEL, revision=REVISION, torch_dtype=torch.bfloat16, cache_dir=str(args.cache), local_files_only=True, token=False)
    pipe.to("cuda:0")
    for component in pipe.components.values():
        if isinstance(component, torch.nn.Module):
            if any(tensor.device != torch.device("cuda:0") for tensors in (component.parameters(), component.buffers()) for tensor in tensors):
                raise WorkerError("MODEL_NOT_FULLY_ON_GPU")
    print(json.dumps({"model_ready": True, "cpu_offload": False, "revision": REVISION}), flush=True)

    def generate(person, garment):
        return pipe(image=[person, garment], prompt=(
            "The adult person in image 1 is wearing the exact knitted garment from image 2. "
            "Preserve the person identity, face, hair, body shape, hands, pose, other clothes and background. "
            "Preserve the garment color, knit texture, neckline, silhouette, cuffs and hem. Natural catalog photograph."
        ), guidance_scale=1.0, num_inference_steps=4, height=1024, width=768, generator=torch.Generator(device="cuda").manual_seed(42)).images[0]

    deadline = time.monotonic() + args.max_seconds
    processed = 0
    try:
        while time.monotonic() < deadline and processed < args.max_jobs:
            job = client.call({"action": "claim"})
            if not job:
                time.sleep(min(10, max(0, deadline - time.monotonic())))
                continue
            accepted = process_job(client, job, generate)
            processed += 1
            print(json.dumps({"processed": processed, "accepted": accepted}), flush=True)
            torch.cuda.empty_cache()
    finally:
        del pipe
        torch.cuda.empty_cache()
        client.token = ""


if __name__ == "__main__":
    try:
        main()
    except WorkerError as error:
        print(json.dumps({"error": str(error)}), flush=True)
        raise SystemExit(1) from None
