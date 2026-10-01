class WorkerError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.status = status;
  }
}
const uuid = (value) => typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
export async function tokenDigest(value) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function same(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
export function productUrl(value, projectUrl) {
  const url = new URL(value, "https://girlslami.com/");
  if (url.protocol !== "https:" || !["girlslami.com", new URL(projectUrl).hostname].includes(url.hostname) || url.username || url.password) throw new WorkerError("PRODUCT_IMAGE_HOST_NOT_ALLOWED");
  return url.href;
}
export function createHandler({ repository, tokenHash, projectUrl, log }) {
  return async (request) => {
    const requestId = crypto.randomUUID();
    const json = (payload, code = 200) => new Response(JSON.stringify(payload), { status: code, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Request-Id": requestId } });
    try {
      if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
      const credential = request.headers.get("Authorization") ?? "";
      if (!/^[a-f0-9]{64}$/.test(tokenHash) || !credential.startsWith("Bearer ") || !same(await tokenDigest(credential.slice(7)), tokenHash)) return json({ error: "UNAUTHORIZED" }, 401);
      if (Number(request.headers.get("Content-Length") ?? 0) > 1e7) return json({ error: "REQUEST_TOO_LARGE" }, 413);
      const text = await request.text();
      if (text.length > 1e7) throw new WorkerError("REQUEST_TOO_LARGE", 413);
      let body;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (error instanceof SyntaxError) throw new WorkerError("INVALID_JSON");
        throw error;
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new WorkerError("INVALID_BODY");
      switch (body.action) {
        case "status":
          return json(await repository.status());
        case "claim": {
          const job = await repository.claim();
          if (!job) return json({});
          const url = productUrl(job.product_image, projectUrl);
          const personUrl = await repository.signedInput(job.input_path);
          return json({ id: job.id, lease: job.lease, color: job.color, personUrl, productUrl: url });
        }
        case "complete": {
          if (!uuid(body.id) || !uuid(body.lease) || typeof body.image !== "string" || body.image.length > 98e5 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.image)) throw new WorkerError("INVALID_RESULT");
          const job = await repository.currentLease(body.id, body.lease);
          if (!job) return json({ accepted: false });
          let binary;
          try {
            binary = Uint8Array.from(atob(body.image), (c) => c.charCodeAt(0));
          } catch (error) {
            if (error instanceof DOMException) throw new WorkerError("INVALID_BASE64");
            throw error;
          }
          if (binary.length > 7340032 || binary[0] !== 255 || binary[1] !== 216 || binary[2] !== 255) throw new WorkerError("JPEG_REQUIRED");
          const path = job.owner_id + "/" + job.id + "/output.jpg";
          await repository.uploadResult(path, binary);
          const accepted = await repository.finish(job.id, body.lease, path);
          if (!accepted) await repository.removeImages([path]);
          return json({ accepted });
        }
        case "fail": {
          if (!uuid(body.id) || !uuid(body.lease) || !["IMAGE_FETCH_FAILED", "IMAGE_DECODE_FAILED", "INFERENCE_FAILED", "RESULT_UPLOAD_FAILED"].includes(body.code)) throw new WorkerError("INVALID_FAILURE");
          return json({ accepted: await repository.finish(body.id, body.lease, null, body.code) });
        }
        case "cleanup":
          return json({ removed: await repository.cleanup() });
        default:
          throw new WorkerError("UNKNOWN_ACTION");
      }
    } catch (error) {
      if (error instanceof WorkerError) return json({ error: error.message }, error.status);
      log({ event: "fitting.worker.error", requestId, errorType: error instanceof Error ? error.name : "UnknownError" });
      return json({ error: "WORKER_REQUEST_FAILED" }, 500);
    }
  };
}
