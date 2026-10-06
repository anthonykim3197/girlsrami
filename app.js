/* 걸스라미 자사몰 공통 스크립트 */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.page || '';

  /* ---------- Catalog presentation contract ---------- */
  function nameFor(p) {
    return String(p?.name || '').trim().replace(/\s*\(\s*RM\d+\s*\)\s*$/i, '');
  }
  function styleCodeFor(p) {
    const explicit = String(p?.styleCode || '').trim();
    const legacy = String(p?.sku || '').trim();
    const code = explicit || (/^RM\d+$/i.test(legacy) ? legacy : '');
    return /^RM\d+$/i.test(code) ? code.toUpperCase() : code;
  }
  function moneyValue(value) {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  }
  function channelPriceFor(p) {
    const value = p?.channelPrice;
    if (value && typeof value === 'object') return moneyValue(value.naver ?? value.smartstore ?? value.price);
    return moneyValue(value);
  }
  function hasComparisonPrice(p) {
    const price = moneyValue(p?.price), listPrice = moneyValue(p?.listPrice);
    return Boolean(price && listPrice && listPrice > price);
  }
  function priceFor(p, detail = false) {
    const price = moneyValue(p?.price);
    if (!price) return '';
    const channelPrice = channelPriceFor(p);
    const showChannel = Boolean(channelPrice && channelPrice !== price);
    const comparison = hasComparisonPrice(p);
    const discount = comparison ? Math.round((1 - price / Number(p.listPrice)) * 100) : 0;
    if (detail) return `<div class="pd-price${showChannel ? ' has-channel-price' : ''}"><div class="pd-price-primary">${showChannel ? '<small>자사몰 판매가</small>' : ''}<span class="now">${GR.fmt(price)}</span>${comparison ? `<span class="was">${GR.fmt(p.listPrice)}</span><span class="off">${discount}% 즉시할인</span>` : ''}</div>${showChannel ? `<div class="channel-price"><small>네이버 결제가</small><strong>${GR.fmt(channelPrice)}</strong><span>스마트스토어 결제 기준</span></div>` : ''}</div>`;
    return `<div class="price${showChannel ? ' price-channels' : ''}">${showChannel ? '<span class="price-label">자사몰 판매가</span>' : ''}<span class="now">${GR.fmt(price)}</span>${comparison ? `<span class="was">${GR.fmt(p.listPrice)}</span><span class="off">${discount}%</span>` : ''}${showChannel ? `<span class="channel-price"><span>네이버 결제가</span><b>${GR.fmt(channelPrice)}</b></span>` : ''}</div>`;
  }
  function factsFor(p) {
    const rows = [
      ['핏 · 기장', [p.fit, p.length].filter(Boolean).join(' · ')],
      ['소재', p.material],
      ['품번', styleCodeFor(p)],
      ['두께 · 신축 · 비침', [p.thickness, p.stretch, p.sheer].filter(Boolean).join(' · ')],
      ['세탁', p.care],
      ['제조국', p.origin],
      ['제조자', p.manufacturer]
    ].filter(([, value]) => String(value || '').trim());
    return `<div class="spec">${rows.map(([label, value]) => `<dl${label === '품번' ? ' class="spec-code"' : ''}><dt>${label}</dt><dd>${esc(value)}</dd></dl>`).join('')}</div>`;
  }
  function factsDisclosureFor(p) {
    return `<details class="editorial-facts"><summary>소재 · 상품 정보</summary>${factsFor(p)}</details>`;
  }
  function usesStandardEditorial(p) {
    return Boolean(p?.editorialStyle === 'standard' || p?.smartstore || p?.storeUrl || p?.newRelease || (Array.isArray(p?.detailImages) && p.detailImages.length));
  }
  function sourceEditorialFor(p) {
    const images = Array.isArray(p.detailImages) ? p.detailImages : [];
    const measurements = Object.entries(p.measure || {}).filter(([,value]) => value !== null && value !== undefined && value !== '');
    const measureTable = measurements.length ? `<details class="editorial-facts" open><summary>실측 사이즈 · cm</summary><dl>${measurements.map(([label,value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p>단면 기준이며 측정 방법에 따라 1~3cm 차이가 있을 수 있습니다.</p></details>` : '';
    const gallery = images.length ? `<div class="source-editorial-gallery">${images.map((image, i) => {
      const source = typeof image === 'string' ? image : image.url;
      const alt = typeof image === 'string' ? `${nameFor(p)} 상세 이미지 ${i + 1}` : image.alt || `${nameFor(p)} 상세 이미지 ${i + 1}`;
      const dimensions = typeof image === 'object' && Number.isFinite(image.width) && Number.isFinite(image.height) && image.width > 0 && image.height > 0 ? ` width="${image.width}" height="${image.height}"` : '';
      return `<figure><img src="${esc(source)}" alt="${esc(alt)}"${dimensions} loading="lazy" decoding="async">${typeof image === 'object' && image.alt ? `<figcaption>${esc(image.alt)}</figcaption>` : ''}</figure>`;
    }).join('')}</div>` : '';
    return `<section class="source-editorial" aria-labelledby="source-editorial-title"><header class="editorial-heading"><span class="editorial-index">01 / THE PRODUCT EDIT</span><h2 id="source-editorial-title">${esc(p.sub || nameFor(p))}</h2>${p.desc ? `<p>${esc(p.desc)}</p>` : ''}</header>${gallery}${measureTable}${factsDisclosureFor(p)}</section>`;
  }
  window.GR.catalogPresentation = Object.freeze({ nameFor, styleCodeFor, channelPriceFor, usesStandardEditorial, sourceEditorialFor, factsFor });

  /* ---------- Header / Footer ---------- */
  function renderChrome() {
    const nav = [['index.html', '홈'], ['shop.html', '전체 상품'], ['shop.html?line=premium', 'F/W 프리미엄'], ['story.html', '브랜드 이야기'], ['guide.html', '구매 안내']];
    const activeKey = { home: 'index.html', shop: 'shop.html', story: 'story.html', guide: 'guide.html' }[page];
    const header = $('#site-header');
    if (header) header.innerHTML = `
      <div class="announce">주문·배송·혜택은 스마트스토어에서 확인해 주세요.</div>
      <div class="member-links wrap"><a href="cart.html">장바구니</a><a data-account-label href="account.html">로그인</a></div>
      <div class="header">
        <div class="wrap">
          <a class="logo" href="index.html"><span class="mark">GR</span>걸스라미<small>GIRLSRAMI</small></a>
          <nav class="nav">${nav.map(([h, t]) => `<a href="${h}" class="${h === activeKey ? 'active' : ''}">${t}</a>`).join('')}</nav>
          <div class="header-right">
            <a class="btn btn-light" href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 상담</a>
            <a class="btn btn-primary" href="${GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어</a>
            <button class="menu-btn" aria-label="메뉴 열기" id="menu-btn"><span></span></button>
          </div>
        </div>
        <div class="mobile-nav" id="mobile-nav">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="${GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어에서 구매</a></div>
      </div>`;
    const mb = $('#menu-btn'); if (mb) mb.addEventListener('click', () => $('#mobile-nav').classList.toggle('open'));

    const footer = $('#site-footer');
    if (footer) footer.innerHTML = `
      <div class="footer"><div class="wrap">
        <div class="cols">
          <div>
            <a class="logo" href="index.html"><span class="mark">GR</span>걸스라미</a>
            <p class="small muted" style="margin-top:14px;max-width:320px">기획부터 생산까지 직접 관리하는 국내 생산 여성 니트. 직접 생산하여 불필요한 유통 거품을 줄였습니다.</p>
          </div>
          <div><h5>SHOP</h5><ul><li><a href="shop.html">전체 상품</a></li><li><a href="shop.html?line=basic">베이직 라인</a></li><li><a href="shop.html?line=premium">F/W 프리미엄 라인</a></li><li><a href="${GR.STORE_URL}" target="_blank" rel="noopener">네이버 스마트스토어</a></li></ul></div>
          <div><h5>BRAND</h5><ul><li><a href="story.html">브랜드 이야기</a></li><li><a href="story.html#principles">만드는 원칙</a></li><li><a href="guide.html#size">사이즈 가이드</a></li></ul></div>
          <div><h5>HELP</h5><ul><li><a href="guide.html#shipping">배송 · 교환 · 반품</a></li><li><a href="guide.html#faq">자주 묻는 질문</a></li><li><a href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 상담</a></li></ul></div>
        </div>
        <div class="legal">상호 대박이할머니 (브랜드 걸스라미) · 대표 신명숙 · 원산지 국산 · 결제와 주문 관리는 네이버 스마트스토어에서 진행됩니다.<br><a href="privacy.html">개인정보 처리 안내</a> · <a href="terms.html">회원 이용약관</a> · <a href="admin.html">걸스라미 관리</a><br>© ${new Date().getFullYear()} GIRLSRAMI. All rights reserved.</div>
        <div class="disclaimer">이 사이트는 걸스라미 자사몰 <b>청사진(시연) 버전</b>입니다. "입고 예정" 또는 "판매 예정" 상품은 아직 판매하지 않습니다(구매 가능 수량 0). 촬영 콘셉트 시안으로 안내된 이미지는 실제 상품과 다를 수 있습니다. 판매 중인 베이직 라인은 스마트스토어의 실제 상품 정보를 기준으로 합니다.</div>
      </div></div>
      <div class="toast" id="toast"></div>`;
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) { const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
  window.GR.toast = toast;

  /* ---------- Card ---------- */
  function stars(r) { const full = Math.round(r); return '★'.repeat(full) + '☆'.repeat(5 - full); }
  function badgeClass(b) { if (['NEW', '베스트', '주간 1위'].includes(b)) return 'accent'; if (['프리미엄', 'L사이즈', '자사몰 단독'].includes(b)) return 'navy'; if (b === '오늘출발') return 'sage'; return 'outline'; }
  function swatchColor(color, p) { return p?.colorHex?.[color] || GR.COLORS[color] || GR.COLORS[{ '스카이': '스카이블루', '회색': '그레이' }[color]] || '#ccc'; }
  function card(p) {
    p = { ...p, name: nameFor(p) };
    const soon = p.stock === 0 || p.status === 'coming';
    const ai = window.GR_AI?.presentation(p), aiColor = ai && GR_AI.colorFor(p), aiMedia = ai && GR_AI.mediaFor(p, aiColor);
    const sw = p.colors.slice(0, 6).map(c => `<span class="swatch" title="${esc(c)}" style="background:${swatchColor(c,p)}"></span>`).join('') + (p.colors.length > 6 ? `<span class="more">+${p.colors.length - 6}</span>` : '');
    return `<a class="card reveal" href="product.html?id=${p.id}">
      <div class="thumb ${soon ? 'soon' : ''}${aiMedia ? ' ai-thumb' : ''}">
        <div class="badges">${p.badges.slice(0, 2).map(b => `<span class="badge ${badgeClass(b)}">${esc(p.newRelease && b === 'NEW' ? '신상' : b)}</span>`).join('')}</div>
        <img src="${esc(aiMedia?.image || p.catalogImage || p.image+'.jpg')}" alt="${esc(p.name)}${aiMedia ? ' '+esc(aiColor)+' AI 코디' : ''}" loading="lazy">
        ${aiMedia ? (ai.cropHasAiLabel ? '' : GR_AI.marker) + GR_AI.swatches(p, aiColor) : ''}
        ${soon ? `<div class="soon-tag">${p.newRelease ? '판매 예정' : '입고 예정'} <span>${esc(p.eta || '판매 일정 확인 중')}</span></div>` : ''}
      </div>
      <div class="card-body">
        <div class="cat">${esc(p.category)} · ${p.line === 'premium' ? '프리미엄 라인' : '베이직 라인'}</div>
        <div class="name">걸스라미 ${esc(p.name)}<small>${esc(p.sub)}</small></div>
        ${p.pricePending ? '' : priceFor(p)}
        ${p.colors.length ? `<div class="swatches">${sw}</div>` : ''}
        ${p.rating ? `<div class="rating"><span class="star">${stars(p.rating)}</span> ${p.rating} <span class="muted">(${p.reviewCount})</span></div>` : `<div class="rating muted">${soon ? '스마트스토어 입고 후 판매' : ''}</div>`}
      </div></a>`;
  }
  window.GR.card = card;

  /* ---------- Reveal ---------- */
  function reveal() {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }
  window.GR.reveal = reveal;

  /* ---------- Notify form ---------- */
  function bindNotify() {
    $$('form[data-notify]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const inp = f.querySelector('input'); const msg = f.querySelector('.form-msg');
      if (!inp.value.trim()) { inp.focus(); return; }
      if (msg) msg.textContent = '이 사이트의 입고 알림은 아직 연결되지 않았어요. 스마트스토어 알림받기를 이용해 주세요. 연락처는 저장하지 않았어요.';
      toast('스마트스토어 알림받기를 이용해 주세요.');
      f.reset();
    }));
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    const featured = GR.CONTENT?.home ? GR.CONTENT.home.featuredIds.map(id=>GR.byId(id)).filter(Boolean) : GR.PRODUCTS.filter(p => p.line === 'basic').slice(0, 4);
    const newProducts = GR.PRODUCTS.filter(p => p.newRelease);
    const best = newProducts.length ? [...newProducts, ...featured.filter(p => !p.newRelease)].slice(0, Math.max(4, featured.length)) : featured;
    const fw = GR.PRODUCTS.filter(p => p.line === 'premium').slice(0, 8);
    $('#best-grid').innerHTML = best.map(card).join('');
    $('#fw-grid').innerHTML = fw.map(card).join('');
    const rv = GR.PRODUCTS.flatMap(p => p.reviews.filter(r => r.stars >= 4).map(r => ({ ...r, product: nameFor(p) }))).slice(0, 3);
    $('#home-reviews').innerHTML = rv.map(r => `<div class="review reveal"><div class="star">${'★'.repeat(r.stars)}</div><p>"${esc(r.text)}"</p><div class="who">${esc(r.who)} · ${esc(r.product)}${r.body ? ' · ' + esc(r.body) : ''}</div>${r.reply ? `<div class="reply"><b>걸스라미 답글</b>${esc(r.reply)}</div>` : ''}</div>`).join('');
  }

  /* ---------- SHOP ---------- */
  function renderShop() {
    const params = new URLSearchParams(location.search);
    const state = { line: params.get('line') || 'all', cat: params.get('cat') || '전체', size: 'all', sort: 'popular' };
    const lineTabs = $('#line-tabs'), cats = $('#cat-chips'), grid = $('#shop-grid'), count = $('#shop-count'), title = $('#shop-title'), sub = $('#shop-sub');
    lineTabs.innerHTML = [['all', '전체'], ['basic', '베이직 (1만 원대)'], ['premium', 'F/W 프리미엄']].map(([k, t]) => `<button data-line="${k}" class="${state.line === k ? 'active' : ''}">${t}</button>`).join('');
    cats.innerHTML = GR.CATEGORIES.map(c => `<button class="chip ${state.cat === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
    function draw() {
      let list = GR.PRODUCTS.filter(p => (state.line === 'all' || p.line === state.line) && (state.cat === '전체' || p.category === state.cat) && (state.size === 'all' || p.sizes.some(s => s.startsWith(state.size))));
      const sorters = { popular: (a, b) => Number(!!b.newRelease) - Number(!!a.newRelease) || (b.reviewCount - a.reviewCount) || (b.price - a.price), new: (a, b) => Number(!!b.newRelease) - Number(!!a.newRelease) || (b.releasedAt || '').localeCompare(a.releasedAt || '') || (a.line === 'premium' ? -1 : 1) - (b.line === 'premium' ? -1 : 1), low: (a, b) => Number(!!a.pricePending) - Number(!!b.pricePending) || a.price - b.price, high: (a, b) => Number(!!a.pricePending) - Number(!!b.pricePending) || b.price - a.price, sale: (a, b) => GR.discount(b) - GR.discount(a) };
      list = [...list].sort(sorters[state.sort]);
      grid.innerHTML = list.length ? list.map(card).join('') : `<p class="muted" style="grid-column:1/-1;padding:40px 0">조건에 맞는 상품이 없습니다.</p>`;
      count.textContent = `${list.length}개 상품`;
      const titles = { all: '전체 상품', basic: '베이직 라인', premium: 'F/W 프리미엄 라인' };
      const subs = { all: '판매 중인 베이직 라인과 입고 예정인 프리미엄 라인을 한곳에서.', basic: '스마트스토어에서 지금 구매할 수 있는 1만 원대 데일리 니트.', premium: '4050 고객의 목소리로 다시 설계한 F/W 라인. 레귤러 기장과 L(66~77) 사이즈까지. 입고 후 판매를 시작합니다.' };
      title.textContent = titles[state.line]; sub.textContent = subs[state.line];
      $$('#line-tabs button').forEach(b => b.classList.toggle('active', b.dataset.line === state.line));
      $$('#cat-chips .chip').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));
      reveal();
    }
    lineTabs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; state.line = b.dataset.line; history.replaceState(null, '', `shop.html?line=${state.line}`); draw(); });
    cats.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; state.cat = b.dataset.cat; draw(); });
    $('#size-select').addEventListener('change', e => { state.size = e.target.value; draw(); });
    $('#sort-select').addEventListener('change', e => { state.sort = e.target.value; draw(); });
    draw();
  }

  /* ---------- PRODUCT ---------- */
  function renderProduct() {
    const id = new URLSearchParams(location.search).get('id');
    const sourceProduct = GR.byId(id);
    if (!sourceProduct) { $('#pd').innerHTML='<div class="notice-box">상품을 찾을 수 없어요. <a href="shop.html">전체 상품 보기</a></div>'; return; }
    const p = { ...sourceProduct, name: nameFor(sourceProduct) };
    document.title = `걸스라미 ${p.name} | GIRLSRAMI`;
    const soon = p.stock === 0 || p.status === 'coming';
    const detailImages = Array.isArray(p.detailImages) ? p.detailImages : [];
    const ai = window.GR_AI?.presentation(p);
    const editorial = ai && GR_AI.editorialFor(p);
    const standardEditorial = !editorial && usesStandardEditorial(p);
    let color = ai ? GR_AI.colorFor(p) : p.newRelease && p.colors.includes(p.photoColor) ? p.photoColor : p.colors[0] || null, size = p.sizePending ? null : p.sizes[0];
    const root = $('#pd');
    root.classList.toggle('pd-editorial', Boolean(editorial || standardEditorial));
    root.classList.toggle('pd-source-editorial', Boolean(standardEditorial));
    root.innerHTML = `
      <div class="pd-media${ai ? ' pd-media-ai' : p.newRelease ? ' pd-media-catalog' : ''}">
        ${ai ? GR_AI.gallery(p, color) : `
        <img src="${esc(p.catalogImage || p.image+'.jpg')}" alt="걸스라미 ${esc(p.name)}" id="pd-img">
        ${detailImages.length ? '' : `<div class="thumbs"><div>정면 착용</div><div>원단 클로즈업<br><small>(촬영 예정)</small></div><div>키 155 / 160 / 167<br>착용 비교<small> (촬영 예정)</small></div><div>15초 숏클립<br><small>(촬영 예정)</small></div></div>`}
        `}
      </div>
      <div class="pd-info">
        <div class="crumb"><a href="index.html">홈</a> › <a href="shop.html">전체 상품</a> › <a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a></div>
        <div class="badges" style="position:static;flex-direction:row;margin-bottom:12px">${p.badges.map(b => `<span class="badge ${badgeClass(b)}">${esc(p.newRelease && b === 'NEW' ? '신상' : b)}</span>`).join('')}</div>
        <h1 class="name">걸스라미 ${esc(p.name)}</h1>
        <div class="sub">${esc(p.sub)}</div>
        ${p.rating ? `<div class="rating" style="margin-top:10px"><span class="star">${stars(p.rating)}</span> <b>${p.rating}</b> <a class="muted" href="#reviews">리뷰 ${p.reviewCount}건</a></div>` : ''}
        ${p.pricePending ? '' : priceFor(p, true)}
        <div class="pd-ship"><span>배송 일정·배송비·교환 조건은 스마트스토어의 현재 상품 안내를 확인해 주세요.</span><span>${ai ? 'AI 코디 연출 · 실제 상품의 색상과 형태는 상세 실물 사진을 참고해 주세요.' : p.photoVerified ? '실제 상품 사진' : '촬영 콘셉트 시안 이미지 · 실제 상품과 다를 수 있어요.'}</span></div>
        ${soon ? `<div class="stock-note">${p.newRelease ? '판매 예정' : '입고 예정'} · ${esc(p.eta || '판매 일정 확인 중')} · 현재 구매 가능 수량 0 · 판매 일정은 스마트스토어에서 확인해 주세요.</div>` : `<div class="stock-note ok">✓ 스마트스토어에서 바로 구매할 수 있습니다. 옵션 선택과 결제는 네이버페이로 진행됩니다.</div>`}
        ${p.colors.length ? `<div class="opt"><div class="opt-label">색상 <span id="color-name">${esc(color)}</span></div><div class="color-opts" id="color-opts">${p.colors.map(c => `<button class="color-opt ${c === color ? 'active' : ''}" data-c="${esc(c)}"><span class="swatch" style="background:${swatchColor(c,p)}"></span>${esc(c)}</button>`).join('')}</div></div>` : `<div class="opt"><div class="opt-label">색상 <span>스마트스토어 옵션에서 선택</span></div></div>`}
        <div class="opt"><div class="opt-label">사이즈 <a href="guide.html#size" class="muted">사이즈 가이드</a></div><div class="size-opts" id="size-opts">${(p.sizePending ? [] : p.sizes).map(s => `<button class="size-opt ${s === size ? 'active' : ''}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>
        <div class="pd-cta">
          ${soon
            ? `<a class="btn btn-light btn-block" href="${GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어에서 판매 일정 확인</a><button class="btn btn-lg btn-block is-disabled" disabled>${p.newRelease ? '판매 예정' : '품절 · 입고 예정'} (구매 가능 수량 0)</button>`
            : `<a class="btn btn-accent btn-lg btn-block" href="${p.smartstore}" target="_blank" rel="noopener">스마트스토어에서 구매하기 →</a><div class="row"><button class="btn btn-ghost" id="add-cart"${!p.colors.length || p.sizePending || !p.sizes.length ? ' disabled' : ''}>장바구니에 담기</button><a class="btn btn-ghost" href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 문의</a><button class="btn btn-ghost" id="share-btn">링크 공유</button></div><p id="product-cart-status" role="status"></p>`}
        </div>
        <div class="gift"><b>혜택 확인</b>현재 쿠폰·사은품 조건은 스마트스토어의 상품 안내와 결제 화면에서 확인해 주세요.</div>
        ${editorial || standardEditorial ? '' : factsFor(p)}
      </div>`;
    let editorialControl;
    function selectColor(next) { color=next; $$('#color-opts .color-opt').forEach(x=>{x.classList.toggle('active',x.dataset.c===color);x.setAttribute('aria-pressed',String(x.dataset.c===color));}); $('#color-name').textContent=color; if(ai && GR_AI.mediaFor(p,color)) $('.pd-media').innerHTML=GR_AI.gallery(p,color); editorialControl?.setColor(color); }
    $('#color-opts')?.addEventListener('click', e => { const b=e.target.closest('.color-opt');if(b)selectColor(b.dataset.c); });
    $('#size-opts').addEventListener('click', e => { const b = e.target.closest('.size-opt'); if (!b) return; size = b.dataset.s; $$('#size-opts .size-opt').forEach(x => x.classList.toggle('active', x === b)); });
    $('#share-btn')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); toast('링크를 복사했습니다'); } catch { toast(location.href); } });

    if(editorial) { root.insertAdjacentHTML('afterend',GR_AI.editorial(p,color)); editorialControl=GR_AI.bindEditorial(p,selectColor); }
    else if(ai) { root.insertAdjacentHTML('afterend', GR_AI.room(p)); GR_AI.bindRoom(p); }

    /* lower tabs */
    $('#pd-desc').classList.toggle('pd-detail-gallery', !editorial && !standardEditorial && detailImages.length > 0);
    $('#pd-desc').classList.toggle('pd-editorial-detail', Boolean(editorial || standardEditorial));
    $('#pd-desc').innerHTML = editorial ? GR_AI.proof(p) + factsDisclosureFor(p) : standardEditorial ? sourceEditorialFor(p) : detailImages.length
      ? detailImages.map((image, i) => `<img src="${esc(typeof image === 'string' ? image : image.url)}" alt="${esc(image.alt || `${p.name} 상세 안내 ${i + 1}`)}"${Number.isFinite(image.width) && Number.isFinite(image.height) && image.width > 0 && image.height > 0 ? ` width="${image.width}" height="${image.height}"` : ''} loading="lazy" decoding="async">`).join('')
      : `
      <h4>이 옷을 만든 이유</h4><p>${esc(p.desc)}</p>
      <h4>실측 사이즈 (cm, 단면 기준)</h4>
      <div class="table-scroll"><table class="size-table"><thead><tr><th>사이즈</th><th>가슴 단면</th><th>총장</th><th>확인 상태</th></tr></thead><tbody>${(p.catalogSizes||[]).map(s => `<tr><td>${esc(s.label)}</td><td>${s.verified?s.chestHalf:'확인 중'}</td><td>${s.verified?s.length:'확인 중'}</td><td>${s.verified?'실측 확인':'미확인 · 추천 제외'}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">확인된 실측만 표시합니다. 측정 방법에 따라 1~3cm 차이가 있을 수 있어요. 색상은 화면과 조명에 따라 달라질 수 있어요.</p>
      <h4>착용 참고</h4><p>사진과 아바타는 코디 참고용이에요. 확인된 실제 상품 사진과 실측이 등록되면 상세페이지에 표시합니다.</p>`;
    if(editorial || standardEditorial) $('.pd-info .gift')?.remove();
    if(ai && !editorial && !detailImages.length) $('#pd-desc').insertAdjacentHTML('beforeend', GR_AI.care(p));
    $('#pd-reviews').innerHTML = p.reviews.length
      ? `<div class="reviews">${p.reviews.map(r => `<div class="review"><div class="star">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div><p>"${esc(r.text)}"</p><div class="who">${esc(r.who)}${r.body ? ' · ' + esc(r.body) : ''} · 스마트스토어 구매 리뷰</div>${r.reply ? `<div class="reply"><b>걸스라미 답글</b>${esc(r.reply)}</div>` : ''}</div>`).join('')}</div><p class="small muted" style="margin-top:16px">전체 리뷰 ${p.reviewCount}건은 <a href="${p.smartstore || GR.STORE_URL}" target="_blank" rel="noopener" style="text-decoration:underline">스마트스토어 상품 페이지</a>에서 볼 수 있습니다. 저평점 리뷰에는 원인과 조치를 답글로 남깁니다.</p>`
      : ai ? `<div class="notice-box">${soon ? '출시 후 스마트스토어에서 실제 구매 후기를 확인해 주세요.' : '아직 등록된 리뷰 인용이 없습니다.'} <a href="${esc(p.smartstore || GR.STORE_URL)}" target="_blank" rel="noopener">스마트스토어 리뷰 확인</a></div>`
      : `<div class="notice-box">${soon ? '입고 전 상품입니다. 판매 시작 후 스마트스토어에서 실제 구매 후기를 확인해 주세요.' : '아직 등록된 리뷰 인용이 없습니다. 스마트스토어 리뷰를 확인해 주세요.'}</div>`;
    $('#pd-notice').innerHTML = `<div class="notice-box"><b>배송 · 교환 · 반품</b><p style="margin-top:10px">배송비, 출고 예정일과 교환·반품 조건은 주문하는 스마트스토어 상품 페이지의 현재 안내를 확인해 주세요. 주문 후 문의는 네이버 주문 내역과 톡톡으로 접수할 수 있어요.</p><a href="${p.smartstore || GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어 상품 안내 확인</a></div>`;
    $$('.pd-tabs button').forEach(b => b.addEventListener('click', () => { $$('.pd-tabs button').forEach(x => x.classList.toggle('active', x === b)); $$('.pd-panel').forEach(pn => pn.hidden = pn.id !== b.dataset.tab); }));
    const rel = GR.PRODUCTS.filter(x => x.id !== p.id && (x.category === p.category || x.line !== p.line)).slice(0, 4);
    $('#related-grid').innerHTML = rel.map(card).join('');
    bindNotify();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await window.GR.bootPromise;
    renderChrome();
    if (GR.bootError) { const target=$('#pd')||$('#shop-grid')||$('#best-grid');if(target)target.textContent='상품 데이터를 불러오지 못했어요. 잠시 후 다시 방문해 주세요.';return; }
    if (page === 'home') renderHome();
    if (page === 'shop') renderShop();
    if (page === 'product') renderProduct();
    bindNotify();
    reveal();
  });
})();
