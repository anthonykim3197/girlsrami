import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const settleImages = () => new Promise(resolve => setImmediate(resolve));

// A small DOM test double, not a browser layout test. It retains SSR node identity,
// records replacements, and dispatches the actual renderer's event handlers.
function node(initial = '') {
  let html = initial;
  const attributes = new Map(), classes = new Set(), listeners = new Map();
  return {
    dataset: {}, hidden: false, disabled: false, textContent: '', writes: 0,
    get innerHTML() { return html; },
    set innerHTML(value) { html = value; this.writes++; this.afterHTML?.(value); },
    get src() { return attributes.get('src') || ''; },
    set src(value) { attributes.set('src', value); },
    setAttribute(key, value) { attributes.set(key, String(value)); },
    getAttribute(key) { return attributes.get(key) ?? null; },
    removeAttribute(key) { attributes.delete(key); },
    classList: {
      add(value) { classes.add(value); },
      remove(value) { classes.delete(value); },
      contains(value) { return classes.has(value); },
      toggle(value, force) {
        const enabled = force ?? !classes.has(value);
        enabled ? classes.add(value) : classes.delete(value);
        return enabled;
      }
    },
    style: {setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; }},
    addEventListener(type, callback) {
      listeners.set(type, [...(listeners.get(type) || []), callback]);
    },
    dispatch(type, event) { for (const callback of listeners.get(type) || []) callback(event); },
    querySelectorAll() { return []; },
    cloneNode() { return node(); },
    isEqualNode(other) { return html === other.innerHTML; },
    setPointerCapture() {}, focus() {}
  };
}

const dataKey = attribute => attribute.replace(/^data-/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function buttons(html) {
  return [...html.matchAll(/<button\b([^>]*)>/g)].map(([, raw]) => {
    const element = node();
    for (const [, key, value] of raw.matchAll(/([\w-]+)="([^"]*)"/g)) {
      element.setAttribute(key, value);
      if (key.startsWith('data-')) element.dataset[dataKey(key)] = value;
    }
    element.disabled = /\sdisabled(?:\s|$)/.test(raw);
    element.matches = selector => selector.split(',').some(part => {
      const attribute = part.trim().match(/^\[([^\]]+)\]$/)?.[1];
      return attribute && element.getAttribute(attribute) !== null;
    });
    element.closest = selector => selector === 'button' ? element : null;
    return element;
  });
}

function harness(productId = 'stripe-cable-half', lookPreviews = {}, productOverrides = {}) {
  const nodes = new Map();
  const imageRequests = [];
  const get = selector => {
    if (!nodes.has(selector)) nodes.set(selector, node());
    return nodes.get(selector);
  };
  const document = {
    body: {dataset: {}, classList: node().classList},
    querySelector: get, querySelectorAll() { return []; }, addEventListener() {}
  };
  class ImageDouble {
    naturalWidth = 1024;
    naturalHeight = 1536;
    set src(value) {
      this.url = value;
      const image = this;
      imageRequests.push({src: value, get priority() { return image.fetchPriority; }});
      queueMicrotask(() => this.onload?.());
    }
  }
  const context = {window: {GR: {}, GR_LOOK_PREVIEWS: lookPreviews}, document, Image: ImageDouble, setTimeout, clearTimeout, URL};
  context.GR = context.window.GR;
  for (const file of ['data.js', 'detail-catalog.js', 'upcoming-catalog.js', 'smartstore-reviews.js', 'standard-detail.js', 'app.js']) {
    vm.runInNewContext(readFileSync(new URL(file, root), 'utf8'), context);
  }
  const catalogProduct = context.GR.byId(productId) || context.GR.UPCOMING_PRODUCTS.find(p => p.id === productId);
  assert.ok(catalogProduct, `missing product ${productId}`);
  const product = {...catalogProduct, ...productOverrides};
  const helpers = {...context.GR.storefront, card: context.GR.card};
  const presentation = context.window.GRStandardDetail;
  const view = presentation.markup(product, helpers);
  const pd = get('#pd');
  pd.innerHTML = view.hero;
  pd.dataset.renderKey = view.key;
  get('#pd-desc').innerHTML = view.detail;
  get('#pd-reviews').innerHTML = view.reviews;
  get('#pd-notice').innerHTML = view.notice;
  get('.grsd-section-nav').innerHTML = view.nav;
  get('#related-grid').innerHTML = view.related;
  get('#pd-img').src = view.d.looks[0].images[view.state.color];
  get('#add-cart').disabled = true; // Build-time cart is disabled until catalog boot.

  let controls = buttons(view.hero);
  const looks = get('.grsd-looks');
  looks.afterHTML = html => {
    controls = controls.filter(control => !('look' in control.dataset)).concat(buttons(html));
  };
  const angles = get('.grsd-angles');
  let angleButtons = [];
  angles.afterHTML = html => { angleButtons = buttons(html); };
  angles.querySelectorAll = selector => angleButtons.filter(button => button.matches(selector));
  pd.querySelector = get;
  pd.querySelectorAll = selector => controls.filter(button => button.matches(selector));
  get('#pd-desc').querySelector = get;
  get('.grsd-lightbox').querySelector = selector => get(`lightbox:${selector}`);
  for (const element of nodes.values()) element.writes = 0;

  return {
    get, pd, view, imageRequests,
    render: () => presentation.render(product, helpers),
    control(key, value) {
      const control = controls.find(button => button.dataset[key] === value);
      assert.ok(control, `missing ${key}=${value} control`);
      return control;
    },
    click(key, value) {
      const target = this.control(key, value);
      assert.equal(target.disabled, false, `${key}=${value} should be available`);
      pd.dispatch('click', {target});
    },
    drag(from, to) {
      const stage = get('.grsd-stage'), pointerId = 1;
      stage.dispatch('pointerdown', {button: 0, target: {closest: () => null}, pointerId, clientX: from});
      stage.dispatch('pointermove', {pointerId, clientX: to});
      stage.dispatch('pointerup', {pointerId});
    }
  };
}

test('a scheduled product can be browsed with photos but has no checkout', async () => {
  const app = harness('jo27-round-puff-cardigan', {}, {status:'coming', storeUrl:'', smartstore:''});
  assert.match(app.view.hero, /예정가 24,900/);
  assert.match(app.view.hero, /aria-disabled="true">판매 예정/);
  assert.doesNotMatch(app.view.hero, /스마트스토어에서 구매하기/);
  assert.match(app.view.detail, /후면 참고 · AI 추정 연출/);
  assert.match(app.view.detail, /제조연월<\/dt><dd>2026\.10/);
  assert.equal(app.view.cartReady, false);
  app.render();
  await settleImages();
  assert.equal(app.get('#add-cart').disabled, true);
  assert.equal(app.get('#product-cart-status').textContent, '판매 시작 전입니다.');
});

test('Styling pairs each look with its pictured color and loads a lightweight preview', () => {
  const id = 'boucle-round-half-cardigan';
  const {view: original} = harness(id);
  const previews = Object.fromEntries(original.d.looks.flatMap(look =>
    Object.values(look.images).map((src, i) => [src, {
      display: `preview/${look.id}-${i}.webp`,
      thumb: `preview/${look.id}-${i}-thumb.webp`
    }])
  ));
  const {view} = harness(id, previews);
  const styling = view.detail.match(/<div class="grsd-style-notes">([\s\S]*?)<\/div><\/section>/)?.[1];
  const images = [...(styling || '').matchAll(/data-full-image="([^"]+)"[^>]*><img src="([^"]+)"[^>]*alt="([^"]+)"/g)];
  assert.equal(images.length, view.d.looks.length);
  const colors = images.map(([, src, thumb, alt], i) => {
    const look = view.d.looks[i];
    const color = Object.keys(look.images).find(color => look.images[color] === src);
    assert.ok(color, 'the enlarged photo belongs to this look');
    assert.equal(thumb, previews[src].thumb);
    assert.ok(alt.includes(color));
    return color;
  });
  assert.equal(new Set(colors).size, 4);
  assert.match(view.hero, /src="preview\/[^"]+-thumb\.webp"/);
});

test('the next color preview loads on intent and is reused on selection', async () => {
  const {view} = harness();
  const color = view.d.colors.find(color => color !== view.state.color);
  const original = view.d.looks[0].images[color];
  const display = 'preview/next-color.webp';
  const app = harness('stripe-cable-half', {[original]: {display}});
  app.render();
  await settleImages();
  assert.equal(app.imageRequests.some(request => request.src === display), false);
  app.pd.dispatch('focusin', {target: app.control('galleryColor', color)});
  assert.equal(app.imageRequests.find(request => request.src === display)?.priority, 'low');
  app.click('galleryColor', color);
  await settleImages();
  assert.deepEqual(app.imageRequests.filter(request => request.src === display), [{src: display, priority: 'high'}]);
  assert.equal(app.get('#pd-img').src, display);
  assert.match(app.get('.grsd-caption').textContent, new RegExp(color));
});

test('render binds the finished SSR product without replacing its visible nodes', async () => {
  const app = harness();
  const preservedSelectors = ['#pd', '#pd-img', '#pd-desc', '#pd-reviews', '#pd-notice', '.grsd-section-nav', '.grsd-looks'];
  const before = preservedSelectors.map(selector => [selector, app.get(selector)]);
  const originalImage = app.get('#pd-img').src;
  assert.equal(app.render(), true);
  await settleImages();
  for (const [selector, element] of before) {
    assert.strictEqual(app.get(selector), element, `${selector} keeps its node`);
    assert.equal(element.writes, 0, `${selector} must not receive replacement HTML`);
  }
  assert.equal(app.get('#pd-img').src, originalImage);
  assert.equal(app.get('#add-cart').disabled, false);
  assert.equal(app.control('mode', 'model').getAttribute('aria-pressed'), 'true');
  assert.equal(app.control('look', 'signature').getAttribute('aria-pressed'), 'true');
});

test('dragging right decreases the 360 angle and dragging left increases it', async () => {
  const app = harness();
  app.render();
  app.click('view', 'spin');
  await settleImages();
  assert.equal(app.get('.grsd-angle').textContent, '0° / 360°');
  app.drag(100, 150);
  await settleImages();
  assert.equal(app.get('.grsd-angle').textContent, '315° / 360°');
  assert.equal(app.get('.grsd-sprite').style.backgroundPosition, '100% 100%');
  app.drag(150, 100);
  await settleImages();
  assert.equal(app.get('.grsd-angle').textContent, '0° / 360°');
  app.drag(150, 100);
  await settleImages();
  assert.equal(app.get('.grsd-angle').textContent, '45° / 360°');
  assert.equal(app.get('.grsd-sprite').style.backgroundPosition, '100% 0%');
});

test('changing sale color keeps the chosen city outfit and displays its matching photo', async () => {
  const app = harness();
  app.render();
  app.click('look', 'city-v3');
  await settleImages();
  assert.equal(app.get('#pd-img').src, 'assets/detail/stripe-cable-half/v3/looks/city-sky.webp');
  for (const [color, key] of [['연핑', 'pink'], ['곤색', 'navy']]) {
    app.click('c', color);
    await settleImages();
    assert.equal(app.get('#pd-img').src, `assets/detail/stripe-cable-half/v3/looks/city-${key}.webp`);
    assert.equal(app.control('look', 'city-v3').getAttribute('aria-pressed'), 'true');
    assert.equal(app.control('look', 'signature').getAttribute('aria-pressed'), 'false');
    assert.equal(app.control('c', color).getAttribute('aria-pressed'), 'true');
    assert.equal(app.get('#color-name').textContent, color);
    assert.equal(app.get('.grsd-caption').textContent, `${color} · 셔츠 · 슬랙스`);
  }
});
