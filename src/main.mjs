import { connect, catalog, getProfile, addCart, user } from "./backend.mjs";
import { accountPage, resetPage } from "./account.mjs";
import { fittingPage } from "./fitting.mjs";
import { cartPage } from "./cart.mjs";
import { adminPage } from "./admin.mjs";
import { syntheticFittingPage } from "./synthetic-fitting.mjs";
import { recommendSize, escapeHtml as e } from "./domain.mjs";
import { $, notice } from "./ui.mjs";
let products = [];
GR.bootPromise = (async () => {
  await connect();
  products = await catalog();
  GR.PRODUCTS = products.map((p) => ({ ...p, catalogImage: p.image, catalogSizes: p.sizes, sizes: p.sizes.map((s) => s.label), smartstore: p.storeUrl, reviews: [], rating: 0, reviewCount: 0, badges: p.badges ?? [], measure: p.measure ?? {}, sub: p.sub ?? "", colors: p.colors }));
  GR.byId = (id) => GR.PRODUCTS.find((p) => p.id === id);
})().catch((error) => {
  GR.bootError = error;
});
document.addEventListener("DOMContentLoaded", async () => {
  await GR.bootPromise;
  const root = $("#member-root");
  const page = document.body.dataset.page;
  if (GR.bootError) {
    if (root) root.innerHTML = notice("데이터를 불러오지 못했어요. 새로고침하거나 잠시 후 다시 방문해 주세요.");
    return;
  }
  try {
    if (root) {
      switch (page) {
        case "synthetic-fitting":
          await syntheticFittingPage(root);
          break;
        case "account":
          await accountPage(root);
          break;
        case "reset":
          resetPage(root);
          break;
        case "fitting":
          await fittingPage(root, products);
          break;
        case "cart":
          await cartPage(root, products);
          break;
        case "admin":
          await adminPage(root, products);
          break;
      }
    }
    if (page === "product") await productTools();
    document.querySelectorAll("[data-account-label]").forEach((a) => a.textContent = user ? "내 정보" : "로그인 · 내 사이즈");
  } catch (error) {
    if (root) root.insertAdjacentHTML("beforeend", notice(error.message));
    else GR.toast?.(error.message);
  }
});
async function productTools() {
  const p = products.find((p2) => p2.id === new URLSearchParams(location.search).get("id"));
  if (!p) return;
  const panel = document.createElement("section");
  panel.className = "fit-shortcut panel";
  const r = recommendSize(await getProfile(), p.sizes);
  panel.innerHTML = `<h2>내 사이즈 · 피팅룸</h2><p>${e(r.message)}</p>${!p.colors.length ? notice("색상 옵션 확인 중이에요. 구매 옵션은 스마트스토어에서 확인해 주세요.") : ""}<div class="action-row"><a class="btn btn-ghost" id="open-fitting" href="fitting.html?id=${p.id}">이 니트 입혀보기</a><button class="btn btn-accent" id="add-cart" ${p.status === "active" && p.stock > 0 && p.colors.length ? "" : "disabled"}>장바구니에 담기</button><a class="text-btn" href="account.html">내 치수 저장</a></div><p id="product-cart-status" role="status"></p>`;
  $(".pd-info").append(panel);
  $("#add-cart").onclick = async () => {
    const el = $("#product-cart-status");
    try {
      await addCart(p, $("#color-opts .active")?.dataset.c ?? p.colors[0], $("#size-opts .active")?.dataset.s ?? p.sizes[0].label);
      el.textContent = "장바구니에 담았어요.";
    } catch (error) {
      el.textContent = error.message;
    }
  };
}
