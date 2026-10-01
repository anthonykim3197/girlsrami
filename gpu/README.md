# Dedicated GPU queue

This is the bounded replacement for the Colab queue. It uses the already-tested FLUX.2 klein 4B revision with BF16 and the entire pipeline on one GPU. It fetches only short-lived private image URLs returned by the protected Edge Function. Images are processed in memory and output is returned as metadata-free JPEG. It does not receive a Supabase service-role key, account password or body measurements.

The current server copy is `/home/anthony/girlsrami-gpu-trial-20261001/queue-worker/gpu` on `anthony@llm-host`. The model cache and Python environment are in the parent trial folder. The Qwen service remains running. No queue process or persistent fitting service has been started.

## Authentication setup

`create-token.py --path PATH` creates a new token in an exclusive owner-only file and prints its SHA-256 verifier, never the token. Existing files are not replaced. The prepared token is `/home/anthony/girlsrami-gpu-trial-20261001/queue-worker/worker-token`, owned by anthony with mode 0600.

The original token authenticated successfully, then was revoked on 2026-10-01. The deployed function explicitly rejects its verifier; the actual server check now returns HTTP 401 for that credential. A replacement token occupies the same owner-only server path. Registration of the replacement verifier in `FITTING_WORKER_TOKEN_SHA256` and plaintext in Supabase Vault remains an owner handoff. Never paste the token into chat, GitHub, public config or logs.

After registration, an authentication-only check is:

```sh
CUDA_VISIBLE_DEVICES=0 /home/anthony/girlsrami-gpu-trial-20261001/.venv/bin/python \
  /home/anthony/girlsrami-gpu-trial-20261001/queue-worker/gpu/run.py \
  --endpoint https://rlbffhmdonbzifiivbfl.supabase.co/functions/v1/fitting-worker \
  --token-file /home/anthony/girlsrami-gpu-trial-20261001/queue-worker/worker-token \
  --cache /home/anthony/girlsrami-gpu-trial-20261001/model-cache --check
```

This reports authentication and the photo-intake switch without claiming a job, updating the engine heartbeat or loading the GPU model. `--check --require-enabled` fails if photo intake is disabled. Without `--check`, the runner also exits without loading the GPU model when intake is disabled.

## Processing limits

An enabled session stops after at most 30 minutes or 10 attempted jobs. Smaller limits can be supplied with `--max-seconds` and `--max-jobs`. The trusted job lease is required before processing. Success, cancellation and safe failure codes are returned through the existing protected function; arbitrary exception text, image URLs and tokens are not logged. A completion rejected by the server is not retried or displayed as success.

The image fetcher restricts HTTPS hosts to the exact configured Supabase project and girlslami.com (including its www hostname). Every redirect is checked. Requests bearing the worker credential cannot redirect. Image responses are bounded to 7 MiB and 20 million decoded pixels. Only JPEG, PNG and WebP are decoded.

## Before customer intake

1. The owner confirmed Korea. Migration 005 is applied on Supabase and the matching v2 photo-consent config and dedicated-server notice are public. Legacy Colab consent cannot authorize this processor.
2. Repeat the authentication-only check after replacement-key registration. Keep photo intake disabled during the remaining checks.
3. The endpoint is registered in Supabase Vault and migrations 003 and 006 are installed. Migration 006 trims pasted whitespace when sending the credential without modifying Vault. Its regression failed against 003 and passed after 006. A real one-minute scheduled request returned HTTP 200 and `removed:0`; the schedule was then paused for credential rotation. Register the replacement token, run `public.install_fitting_cleanup()` and verify an expired fixture is automatically removed. Manual Storage deletion was previously verified with a disposable public illustration (`removed:0` while fresh, `removed:1` after simulated expiry). Scheduled deletion of an actual file remains unverified and must work even while the GPU server is offline.
4. Exercise the real member request, signed image fetch, generation, result upload, cancellation, consent withdrawal, deletion and another-member access denial.
5. Verify actual merchandise photographs for each color and inspect product/identity preservation on consented test inputs.
6. Choose GPU capacity for sustained fitting. The running Qwen model occupies both current GPUs; do not start this full-resident model alongside it. A bounded test may temporarily stop and restore Qwen as previously authorized. Sustained replacement of Qwen or a new persistent service requires a separate operational decision.

The intake switch remains false. Preparing or authenticating this runner does not enable it.
