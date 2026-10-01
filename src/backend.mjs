import { createClient } from "@supabase/supabase-js";
import { seedProduct, validateProduct, validateProfile, fittingPhoto } from "./domain.mjs";
export let config;
export let db;
export let user;
export async function connect() {
  config = await (await fetch("./config.json")).json();
  if (!config.supabaseUrl || !config.publishableKey) return;
  db = createClient(config.supabaseUrl, config.publishableKey, { auth: { flowType: "pkce", detectSessionInUrl: true } });
  const result2 = await db.auth.getUser();
  user = result2.data.user;
  db.auth.onAuthStateChange((_event, session) => {
    user = session?.user ?? null;
    document.dispatchEvent(new Event("gr-auth"));
  });
}
export function requireCloud() {
  if (!db) throw new Error("회원 서비스 연결 준비 중이에요. 사진과 신체 정보는 아직 서버로 전송되지 않아요.");
  return db;
}
export function requireUser() {
  requireCloud();
  if (!user) throw new Error("로그인 후 이용해 주세요.");
  return user;
}
export async function result(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}
export async function catalog() {
  const fallback = GR.PRODUCTS.map(seedProduct);
  if (!db) return fallback;
  return (await result(db.from("products").select("payload").neq("payload->>status", "hidden"))).map((r) => validateProduct(r.payload));
}
export async function getProfile() {
  if (!user) return null;
  const row = await result(db.from("profiles").select("measurements").eq("id", user.id).maybeSingle());
  return row?.measurements ?? null;
}
export async function saveProfile(p) {
  const u = requireUser();
  const measurements = validateProfile(p);
  await result(db.from("profiles").upsert({ id: u.id, measurements, updated_at: new Date().toISOString() }));
  return measurements;
}
export async function cart() {
  requireUser();
  return result(db.from("cart_items").select("*").order("created_at"));
}
export async function addCart(product, color, size, quantity = 1) {
  const u = requireUser();
  if (product.status !== "active" || product.stock < quantity || !product.colors.includes(color) || !product.sizes.some((s) => s.label === size)) throw new Error("선택한 상품 옵션을 구매할 수 없어요.");
  await result(db.rpc("add_to_cart", { product_id: product.id, selected_color: color, selected_size: size, qty: quantity }));
  return u;
}
export async function deletePrivateData() {
  requireUser();
  await result(db.rpc("begin_fitting_withdrawal"));
  const paths = await result(db.rpc("private_image_paths"));
  if (paths.length) await result(db.storage.from("fitting-private").remove(paths));
  await result(db.rpc("erase_fitting_data"));
}
export async function photoConsent() {
  requireUser();
  return result(db.from("photo_consents").upsert({ owner_id: user.id, version: config.consentVersion, accepted_at: new Date().toISOString() }));
}
export async function jobs() {
  requireUser();
  return result(db.from("fitting_jobs").select("id,product_id,color,status,error_code,output_path,created_at,expires_at").eq("is_synthetic_test", false).order("created_at", { ascending: false }).limit(10));
}
export async function privateUrl(path) {
  return (await result(db.storage.from("fitting-private").createSignedUrl(path, 60))).signedUrl;
}
export async function requestFit(blob, product, color, requestId) {
  const u = requireUser();
  if (!fittingPhoto(product, color)) throw new Error("선택한 색상의 실제 상품 사진을 확인한 후 사진 피팅을 이용할 수 있어요.");
  const state = await result(db.rpc("fitting_status"));
  if (!state.available) throw new Error("사진 피팅 엔진이 현재 쉬고 있어요. 아바타 코디를 이용해 주세요.");
  const prior = await result(db.rpc("find_fit_job", { request_key: requestId }));
  if (prior) return prior;
  const path = `${u.id}/${requestId}/input.jpg`;
  await result(db.storage.from("fitting-private").upload(path, blob, { contentType: "image/jpeg", upsert: false }));
  try {
    return await result(db.rpc("create_fit_job", { request_key: requestId, product_id: product.id, selected_color: color, input_path: path, consent_version: config.consentVersion }));
  } catch (error) {
    const accepted = await result(db.rpc("find_fit_job", { request_key: requestId }));
    if (accepted) return accepted;
    const cleanup = await db.storage.from("fitting-private").remove([path]);
    if (cleanup.error) throw new Error("생성을 요청하지 못했고 사진 삭제도 실패했어요. 내 정보에서 사진 삭제를 눌러 주세요.");
    throw error;
  }
}
