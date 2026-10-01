import { createClient } from "npm:@supabase/supabase-js@2.99.2";
import { createHandler } from "./handler.mjs";
const projectUrl = Deno.env.get("SUPABASE_URL");
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const tokenHash = Deno.env.get("FITTING_WORKER_TOKEN_SHA256") ?? "";
if (!projectUrl || !key) throw new Error("Worker configuration required");
const db = createClient(projectUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
async function result(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}
const repository = {
  async status() {
    return result(db.from("worker_state").select("enabled").eq("id", true).single());
  },
  async claim() {
    return (await result(db.rpc("worker_claim")))[0] ?? null;
  },
  async signedInput(path) {
    return (await result(db.storage.from("fitting-private").createSignedUrl(path, 60))).signedUrl;
  },
  async currentLease(id, lease) {
    return result(db.from("fitting_jobs").select("id,owner_id").eq("id", id).eq("lease", lease).eq("status", "running").gt("expires_at", new Date().toISOString()).maybeSingle());
  },
  async uploadResult(path, image) {
    await result(db.storage.from("fitting-private").upload(path, image, { contentType: "image/jpeg", upsert: true }));
  },
  async finish(id, lease, path, failure = null) {
    return result(db.rpc("worker_finish", { job_id: id, lease_key: lease, result_path: path, failure }));
  },
  async removeImages(paths) {
    await result(db.storage.from("fitting-private").remove(paths));
  },
  async cleanup() {
    const expired = await result(db.rpc("expired_image_paths"));
    if (expired.length) await this.removeImages(expired);
    await result(db.from("fitting_jobs").delete().lt("expires_at", new Date().toISOString()));
    return expired.length;
  }
};
Deno.serve(createHandler({ repository, tokenHash, projectUrl, log: (event) => console.error(JSON.stringify(event)) }));
