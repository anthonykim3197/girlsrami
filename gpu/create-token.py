import argparse
import hashlib
import json
import os
import secrets
from pathlib import Path

parser = argparse.ArgumentParser(description="Create a private GPU-only token without displaying its plaintext.")
parser.add_argument("--path", type=Path, required=True)
args = parser.parse_args()
token = secrets.token_urlsafe(48)
descriptor = os.open(args.path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(descriptor, "w") as output:
    output.write(token + "\n")
print(json.dumps({"sha256": hashlib.sha256(token.encode()).hexdigest(), "plaintext_displayed": False}))
