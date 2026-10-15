import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const appSource = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

function element(initial = '') {
  let html = initial;
  const listeners = new Map();
  return {
    writes: 0, dataset: {}, textContent: '', value: '', listeners, hidden: false, removed: false,
    get innerHTML() { return html; },
    set innerHTML(value) { html = value; this.writes++; },
    classList: {add() {}, remove() {}, toggle() {}},
    addEventListener(type, callback) { listeners.set(type, callback); },
    remove() { this.removed = true; }
  };
}

function product(id, overrides = {}) {
  return {
    id, name: id, status: 'active', storeUrl: 'https://smartstore.naver.com/girlsrami/products/123',
    category: '니트', colors: ['크림'], sizes: ['FREE'], price: 20000, listPrice: 0,
    image: 'product.webp', rating: 0, reviewCount: 0, reviews: [], ...overrides
  };
}

function load(page = 'story', products = [], options = {}) {
  const selectors = new Map(Object.entries({
    '#site-header': element(), '#site-footer': element(), '#menu-btn': element(), '#mobile-nav': element(),
    '#best-grid': element(), '#home-reviews': element(), '#cat-chips': element(), '#shop-grid': element(),
    '#shop-count': element(), '#shop-title': element(), '#shop-sub': element(),
    '#size-select': Object.assign(element(), {value: 'all', options: ['all', 'FREE', 'L'].map(value => ({value}))}),
    '#sort-select': Object.assign(element(), {value: 'popular', options: ['popular', 'new', 'low', 'high', 'sale'].map(value => ({value}))})
  }));
  const GR = {
    PRODUCTS: products, CONTENT: options.content, COLORS: {}, TALK_URL: 'https://talk.naver.com/example',
    STORE_URL: 'https://smartstore.naver.com/girlsrami', fmt: n => `${n}원`,
    discount: p => p.listPrice ? Math.round((1 - p.price / p.listPrice) * 100) : 0,
    bootPromise: options.bootPromise || Promise.resolve()
  };
  GR.byId = id => GR.PRODUCTS.find(p => p.id === id);
  let ready;
  const revealed = options.revealed || [];
  const document = {
    body: {dataset: {page, productId: options.productId}},
    querySelector: selector => selectors.get(selector) || null,
    querySelectorAll: selector => selector === '.reveal:not(.in)' ? revealed : [],
    addEventListener: (type, callback) => { if (type === 'DOMContentLoaded') ready = callback; }
  };
  const location = new URL(`https://girlslami.com/shop.html${options.search || ''}`);
  const history = {state: {existing: true}, replaceState(state, unused, href) {
    assert.equal(state, this.state);
    const next = new URL(href, location);
    location.href = next.href;
  }};
  const window = {GR, GR_DETAIL: options.details || {}, GR_SMARTSTORE_REVIEWS: options.reviewSnapshots || {}, IntersectionObserver: class {}, history};
  vm.runInNewContext(appSource, {
    GR, window, document, URL, URLSearchParams, location,
    IntersectionObserver: class { constructor() { options.onObserver?.(); } observe() {} }
  });
  return {GR, selectors, location, ready: () => ready()};
}

test('common navigation is available while remote catalog boot is still pending', async () => {
  let complete;
  const bootPromise = new Promise(resolve => { complete = resolve; });
  const app = load('story', [], {bootPromise});
  const settled = app.ready();
  assert.match(app.selectors.get('#site-header').innerHTML, /브랜드 이야기/);
  assert.match(app.selectors.get('#site-footer').innerHTML, /배송 · 교환 · 반품/);
  complete();
  await settled;
});

test('existing prerendered navigation keeps its nodes when runtime initializes', async () => {
  const app = load();
  assert.equal(typeof app.GR.pageMarkup?.chrome, 'function');
  const chrome = app.GR.pageMarkup.chrome('story', new Date().getFullYear());
  app.selectors.set('#site-header', element(chrome.header));
  app.selectors.set('#site-footer', element(chrome.footer));
  await app.ready();
  assert.equal(app.selectors.get('#site-header').writes, 0);
  assert.equal(app.selectors.get('#site-footer').writes, 0);
  assert.equal(typeof app.selectors.get('#menu-btn').listeners.get('click'), 'function');
});

test('visible content does not wait for an intersection callback on navigation', () => {
  let classesAdded = 0, observers = 0;
  const app = load('story', [], {
    revealed: [{classList: {add: name => { if (name === 'in') classesAdded++; }}}],
    onObserver: () => observers++
  });
  app.GR.reveal();
  assert.equal(classesAdded, 1);
  assert.equal(observers, 0);
  assert.match(app.GR.card(product('니트')), /class="card reveal in"/);
});

test('home hydration preserves existing product cards and uses the shared NEW-first selection', async () => {
  const products = [product('old-one'), product('new-one'), product('old-two'), product('old-three'), product('old-four')];
  const app = load('home', products, {
    content: {home: {featuredIds: ['old-four', 'old-two', 'old-one']}},
    details: {'new-one': {isNewDesign: true}}
  });
  assert.equal(typeof app.GR.pageMarkup?.homeProducts, 'function');
  const selected = app.GR.pageMarkup.homeProducts(products, app.GR.CONTENT);
  assert.deepEqual(Array.from(selected, p => p.id), ['new-one', 'old-four', 'old-two', 'old-one']);
  app.selectors.set('#best-grid', element(selected.map(app.GR.card).join('')));
  await app.ready();
  assert.equal(app.selectors.get('#best-grid').writes, 0);
});

test('home keeps its existing cards when the live catalog returns NEW products in a different order', async () => {
  const honey = product('honey', {name: '허니루프 라운드 니트'});
  const offDuty = product('off-duty', {name: '오프듀티 V넥 니트 베스트'});
  const existing = [product('cardigan'), product('knit')];
  const app = load('home', [honey, offDuty, ...existing], {
    content: {}, details: {honey: {isNewDesign: true}, 'off-duty': {isNewDesign: true}}
  });
  const initial = app.GR.pageMarkup.homeProducts();
  assert.deepEqual(Array.from(initial, p => p.id), ['off-duty', 'honey', 'cardigan', 'knit']);
  app.selectors.set('#best-grid', element(initial.map(app.GR.card).join('')));
  app.GR.PRODUCTS = [offDuty, honey, ...existing];
  await app.ready();
  assert.equal(app.selectors.get('#best-grid').writes, 0);
});

test('shop hydration preserves cards while an intentional filter updates them', async () => {
  const products = [product('저가', {price: 10000}), product('후기상품', {reviewCount: 4}), product('가디건', {category: '가디건'})];
  const app = load('shop', products, {reviewSnapshots: {'후기상품': {source: 'naver-smartstore', productId: '123', rating: 4.75, totalCount: 4}}});
  assert.equal(typeof app.GR.pageMarkup?.shopProducts, 'function');
  const selected = app.GR.pageMarkup.shopProducts(products, {cat: '전체', size: 'all', sort: 'popular'});
  assert.equal(selected[0].id, '후기상품');
  app.selectors.set('#shop-grid', element(selected.map(app.GR.card).join('')));
  await app.ready();
  assert.equal(app.selectors.get('#shop-grid').writes, 0);
  app.selectors.get('#cat-chips').listeners.get('click')({target: {closest: () => ({dataset: {cat: '가디건'}})}});
  assert.equal(app.selectors.get('#shop-grid').writes, 1);
  assert.match(app.selectors.get('#shop-grid').innerHTML, /product-.*\.html/);
  assert.equal(app.selectors.get('#shop-count').textContent, '1개 상품');
});

test('shared shop ordering filters non-selling products and matches supported sizes', () => {
  const products = [product('큰니트', {price: 25000, sizes: ['L']}), product('작은니트', {price: 10000, sizes: ['S']}), product('초안', {status: 'draft', price: 1})];
  const app = load('shop', products);
  assert.equal(typeof app.GR.pageMarkup?.shopProducts, 'function');
  assert.deepEqual(Array.from(app.GR.pageMarkup.shopProducts(products, {sort: 'low'}), p => p.id), ['작은니트', '큰니트']);
  assert.deepEqual(Array.from(app.GR.pageMarkup.shopProducts(products, {size: 'L'}), p => p.id), ['큰니트']);
});

test('shop restores query filters and writes changes into the current history entry', async () => {
  const products = [product('큰니트', {price: 25000, sizes: ['L']}), product('작은니트', {price: 10000, sizes: ['FREE']})];
  const app = load('shop', products, {search: '?cat=니트&size=L&sort=low&utm_source=naver#products'});
  await app.ready();
  assert.equal(app.selectors.get('#size-select').value, 'L');
  assert.equal(app.selectors.get('#sort-select').value, 'low');
  assert.equal(app.selectors.get('#shop-count').textContent, '1개 상품');
  app.selectors.get('#size-select').listeners.get('change')({target: {value: 'all'}});
  app.selectors.get('#sort-select').listeners.get('change')({target: {value: 'high'}});
  assert.equal(app.location.searchParams.get('cat'), '니트');
  assert.equal(app.location.searchParams.has('size'), false);
  assert.equal(app.location.searchParams.get('sort'), 'high');
  assert.equal(app.location.searchParams.get('utm_source'), 'naver');
  assert.equal(app.location.hash, '#products');
});

test('catalog failure preserves the prerendered product while disabling only the local cart', async () => {
  const app = load('product');
  const productView = element('<div class="grsd-hero"><img src="approved.webp"></div>');
  const cart = element();
  app.selectors.set('#pd', productView);
  app.selectors.set('#add-cart', cart);
  app.selectors.set('#product-cart-status', element());
  app.GR.bootError = new Error('network unavailable');
  await app.ready();
  assert.equal(productView.textContent, '');
  assert.equal(productView.writes, 0);
  assert.match(productView.innerHTML, /approved.webp/);
  assert.equal(cart.disabled, true);
  assert.match(app.selectors.get('#product-cart-status').textContent, /스마트스토어/);
});

test('verified marketplace review summaries survive member catalog hydration without changing card order', () => {
  const products = [product('후기상품', {rating: 1, reviewCount: 1}), product('아직후기없음', {rating: 5, reviewCount: 999})];
  const app = load('shop', products, {reviewSnapshots: {'후기상품': {source: 'naver-smartstore', productId: '123', rating: 4.75, totalCount: 4}}});
  const before = app.GR.card(products[0]);
  assert.match(before, /4\.75.*\(4\)/);
  assert.deepEqual(Array.from(app.GR.pageMarkup.shopProducts(products), p => p.id), ['후기상품', '아직후기없음']);
  const hydrated = products.map(p => ({...p, rating: 0, reviewCount: 0, reviews: []}));
  assert.equal(app.GR.card(hydrated[0]), before);
  assert.deepEqual(Array.from(app.GR.pageMarkup.shopProducts(hydrated), p => p.id), ['후기상품', '아직후기없음']);
});

test('stale catalog ratings and snapshots belonging to another product never appear on cards', () => {
  const products = [product('원본', {rating: 5, reviewCount: 999}), product('다른상품', {rating: 4, reviewCount: 888})];
  const app = load('shop', products, {reviewSnapshots: {'다른상품': {source: 'naver-smartstore', productId: '999', rating: 4.8, totalCount: 30}}});
  for (const p of products) assert.doesNotMatch(app.GR.card(p), /class="star"|\(999\)|\(888\)|\(30\)/);
});

for (const condition of ['inactive', 'missing']) {
  test(`${condition} catalog products clear prerendered lower detail and purchasing links`, async () => {
    const products = condition === 'inactive' ? [product('판매종료', {status: 'inactive'})] : [];
    const app = load('product', products, {productId: '판매종료'});
    app.selectors.set('#pd', element('<div class="grsd-hero">기존 상품</div>'));
    const lower = ['#pd-desc', '#pd-reviews', '#pd-notice'];
    const navigation = ['.pd-tabs', '.grsd-section-nav', '.related'];
    for (const selector of [...lower, ...navigation]) {
      app.selectors.set(selector, element('<a href="https://smartstore.naver.com/girlsrami/products/123">이전 상품 구매</a>'));
    }
    await app.ready();
    assert.match(app.selectors.get('#pd').innerHTML, /현재 판매 중인 상품이 아닙니다/);
    for (const selector of lower) {
      assert.equal(app.selectors.get(selector).innerHTML, '', selector);
      assert.equal(app.selectors.get(selector).hidden, true, selector);
    }
    for (const selector of navigation) assert.equal(app.selectors.get(selector).removed, true, selector);
  });
}
