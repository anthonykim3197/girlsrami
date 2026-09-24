/* 걸스라미 자사몰 공통 스크립트 */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.page || '';

  /* ---------- Header / Footer ---------- */
  function renderChrome() {
    const nav = [['index.html', '홈'], ['shop.html', '전체 상품'], ['shop.html?line=premium', 'F/W 프리미엄'], ['story.html', '공장 이야기'], ['guide.html', '구매 안내']];
    const activeKey = { home: 'index.html', shop: 'shop.html', story: 'story.html', guide: 'guide.html' }[page];
    const header = $('#site-header');
    if (header) header.innerHTML = `
      <div class="announce">알림받기 고객 <b>2,000원 쿠폰</b> · 포토 리뷰 추가 적립 · 5만 원 이상 무료배송 <a href="guide.html#benefit">자세히</a></div>
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
            <p class="small muted" style="margin-top:14px;max-width:320px">경기도 광주 니트 공장에서 직접 설계하고 짜서 보내는 여성 니트. 도매로 검증한 원사와 편직을 이제 소매로 직접 전합니다.</p>
          </div>
          <div><h5>SHOP</h5><ul><li><a href="shop.html">전체 상품</a></li><li><a href="shop.html?line=basic">베이직 라인</a></li><li><a href="shop.html?line=premium">F/W 프리미엄 라인</a></li><li><a href="${GR.STORE_URL}" target="_blank" rel="noopener">네이버 스마트스토어</a></li></ul></div>
          <div><h5>BRAND</h5><ul><li><a href="story.html">공장 이야기</a></li><li><a href="story.html#principles">만드는 원칙</a></li><li><a href="guide.html#size">사이즈 가이드</a></li></ul></div>
          <div><h5>HELP</h5><ul><li><a href="guide.html#shipping">배송 · 교환 · 반품</a></li><li><a href="guide.html#faq">자주 묻는 질문</a></li><li><a href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 상담 (평일 10:00~18:00)</a></li></ul></div>
        </div>
        <div class="legal">상호 대박이할머니 (브랜드 걸스라미) · 대표 신명숙 · 원산지 국산(경기도 광주시) · 결제와 주문 관리는 네이버 스마트스토어에서 진행됩니다.<br>© ${new Date().getFullYear()} GIRLSRAMI. All rights reserved.</div>
        <div class="disclaimer">이 사이트는 걸스라미 자사몰 <b>청사진(시연) 버전</b>입니다. "입고 예정"으로 표시된 프리미엄 라인 상품은 아직 판매하지 않으며(구매 가능 수량 0), 상품 사진은 촬영 톤 시안을 위해 제작한 이미지로 실제 상품과 다를 수 있습니다. 판매 중인 베이직 라인은 스마트스토어의 실제 상품 정보를 기준으로 합니다.</div>
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
  function card(p) {
    const soon = p.stock === 0;
    const sw = p.colors.slice(0, 6).map(c => `<span class="swatch" title="${esc(c)}" style="background:${GR.COLORS[c] || '#ccc'}"></span>`).join('') + (p.colors.length > 6 ? `<span class="more">+${p.colors.length - 6}</span>` : '');
    return `<a class="card reveal" href="product.html?id=${p.id}">
      <div class="thumb ${soon ? 'soon' : ''}">
        <div class="badges">${p.badges.slice(0, 2).map(b => `<span class="badge ${badgeClass(b)}">${esc(b)}</span>`).join('')}</div>
        <img src="${p.image}.jpg" alt="${esc(p.name)}" loading="lazy">
        ${soon ? `<div class="soon-tag">입고 알림 신청 <span>${esc(p.eta || '입고 예정')}</span></div>` : ''}
      </div>
      <div class="card-body">
        <div class="cat">${esc(p.category)} · ${p.line === 'premium' ? '프리미엄 라인' : '베이직 라인'}</div>
        <div class="name">걸스라미 ${esc(p.name)}<small>${esc(p.sub)}</small></div>
        <div class="price"><span class="now">${GR.fmt(p.price)}</span>${p.listPrice ? `<span class="was">${GR.fmt(p.listPrice)}</span><span class="off">${GR.discount(p)}%</span>` : ''}</div>
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
      if (msg) msg.textContent = '접수됐습니다. 입고되면 가장 먼저 알려드릴게요. (시연 버전: 실제 발송은 되지 않습니다)';
      toast('입고 알림 신청 완료');
      f.reset();
    }));
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    const best = GR.PRODUCTS.filter(p => p.line === 'basic').sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
    const fw = GR.PRODUCTS.filter(p => p.line === 'premium').slice(0, 8);
    $('#best-grid').innerHTML = best.map(card).join('');
    $('#fw-grid').innerHTML = fw.map(card).join('');
    const rv = GR.PRODUCTS.flatMap(p => p.reviews.filter(r => r.stars >= 4).map(r => ({ ...r, product: p.name }))).slice(0, 3);
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
      const sorters = { popular: (a, b) => (b.reviewCount - a.reviewCount) || (b.price - a.price), new: (a, b) => (a.line === 'premium' ? -1 : 1) - (b.line === 'premium' ? -1 : 1), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, sale: (a, b) => GR.discount(b) - GR.discount(a) };
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
    const p = GR.byId(id) || GR.PRODUCTS[0];
    document.title = `걸스라미 ${p.name} | GIRLSRAMI`;
    const soon = p.stock === 0;
    let color = p.colors[0] || null, size = p.sizes[0];
    const root = $('#pd');
    root.innerHTML = `
      <div class="pd-media">
        <img src="${p.image}.jpg" alt="걸스라미 ${esc(p.name)}" id="pd-img">
        <div class="thumbs"><div>정면 착용</div><div>원단 클로즈업<br><small>(촬영 예정)</small></div><div>키 155 / 160 / 167<br>착용 비교<small> (촬영 예정)</small></div><div>15초 숏클립<br><small>(촬영 예정)</small></div></div>
      </div>
      <div class="pd-info">
        <div class="crumb"><a href="index.html">홈</a> › <a href="shop.html">전체 상품</a> › <a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a></div>
        <div class="badges" style="position:static;flex-direction:row;margin-bottom:12px">${p.badges.map(b => `<span class="badge ${badgeClass(b)}">${esc(b)}</span>`).join('')}</div>
        <h1 class="name">걸스라미 ${esc(p.name)}</h1>
        <div class="sub">${esc(p.sub)} · 품번 ${esc(p.sku)}</div>
        ${p.rating ? `<div class="rating" style="margin-top:10px"><span class="star">${stars(p.rating)}</span> <b>${p.rating}</b> <a class="muted" href="#reviews">리뷰 ${p.reviewCount}건</a></div>` : ''}
        <div class="pd-price"><span class="now">${GR.fmt(p.price)}</span>${p.listPrice ? `<span class="was">${GR.fmt(p.listPrice)}</span><span class="off">${GR.discount(p)}% 즉시할인</span>` : ''}</div>
        <div class="pd-ship"><span><b>${soon ? '입고 후 오늘출발' : '오늘출발'}</b> 평일 14시 이전 주문 당일 출고</span><span>무료배송 (제주 +3,000원)</span><span>교환 3,000원 · 반품 5,000원</span></div>
        ${soon ? `<div class="stock-note">⏳ ${esc(p.eta)} · 현재 구매 가능 수량 0 · 입고 알림을 신청하시면 스마트스토어 판매 시작과 함께 알려드립니다.</div>` : `<div class="stock-note ok">✓ 스마트스토어에서 바로 구매할 수 있습니다. 옵션 선택과 결제는 네이버페이로 진행됩니다.</div>`}
        ${p.colors.length ? `<div class="opt"><div class="opt-label">색상 <span id="color-name">${esc(color)}</span></div><div class="color-opts" id="color-opts">${p.colors.map(c => `<button class="color-opt ${c === color ? 'active' : ''}" data-c="${esc(c)}"><span class="swatch" style="background:${GR.COLORS[c] || '#ccc'}"></span>${esc(c)}</button>`).join('')}</div></div>` : `<div class="opt"><div class="opt-label">색상 <span>스마트스토어 옵션에서 선택</span></div></div>`}
        <div class="opt"><div class="opt-label">사이즈 <a href="guide.html#size" class="muted">사이즈 가이드</a></div><div class="size-opts" id="size-opts">${p.sizes.map(s => `<button class="size-opt ${s === size ? 'active' : ''}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>
        <div class="pd-cta">
          ${soon
            ? `<form data-notify class="notify-row"><input class="select" type="text" placeholder="휴대폰 번호 또는 이메일" aria-label="연락처"><button class="btn btn-accent" type="submit">입고 알림 신청</button><div class="form-msg"></div></form><button class="btn btn-lg btn-block is-disabled" disabled>품절 · 입고 예정 (구매 가능 수량 0)</button>`
            : `<a class="btn btn-accent btn-lg btn-block" href="${p.smartstore}" target="_blank" rel="noopener">스마트스토어에서 구매하기 →</a><div class="row"><a class="btn btn-ghost" href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 문의</a><button class="btn btn-ghost" id="share-btn">링크 공유</button></div>`}
        </div>
        <div class="gift"><b>사은품 안내 (조건 명시)</b>같은 주문에서 니트 2장 이상 구매 시, 주문서 요청사항에 적어주신 <b>고르는 사은품</b>(슬리브리스 이너 · 컬러 선택) 1개를 함께 보내드립니다. 랜덤 발송은 하지 않습니다.</div>
        <div class="spec">
          <dl><dt>핏 · 기장</dt><dd>${esc(p.fit)} · ${esc(p.length)}</dd></dl>
          <dl><dt>소재</dt><dd>${esc(p.material)}</dd></dl>
          <dl><dt>두께 · 신축 · 비침</dt><dd>${esc(p.thickness)} · ${esc(p.stretch)} · ${esc(p.sheer)}</dd></dl>
          <dl><dt>세탁</dt><dd>${esc(p.care)}</dd></dl>
          <dl><dt>제조</dt><dd>걸스라미 · 국산(경기도 광주시) · 주문일 기준 2개월 이내 생산분 출고</dd></dl>
        </div>
      </div>`;
    $('#color-opts')?.addEventListener('click', e => { const b = e.target.closest('.color-opt'); if (!b) return; color = b.dataset.c; $$('#color-opts .color-opt').forEach(x => x.classList.toggle('active', x === b)); $('#color-name').textContent = color; });
    $('#size-opts').addEventListener('click', e => { const b = e.target.closest('.size-opt'); if (!b) return; size = b.dataset.s; $$('#size-opts .size-opt').forEach(x => x.classList.toggle('active', x === b)); });
    $('#share-btn')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); toast('링크를 복사했습니다'); } catch { toast(location.href); } });

    /* lower tabs */
    const measRows = Object.entries(p.measure);
    $('#pd-desc').innerHTML = `
      <h4>이 옷을 만든 이유</h4><p>${esc(p.desc)}</p>
      <h4>실측 사이즈 (cm, 단면 기준)</h4>
      <div class="table-scroll"><table class="size-table"><thead><tr><th>사이즈</th>${measRows.map(([k]) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${p.sizes.map((s, i) => `<tr><td>${esc(s)}</td>${measRows.map(([, v]) => `<td>${i === 0 ? v : Math.round((v * 1.06) * 2) / 2}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">측정 방법에 따라 1~3cm 차이가 있을 수 있습니다. ${p.sizes.length > 1 ? 'L 사이즈 수치는 설계 기준값이며 입고 시 실측으로 교체됩니다.' : ''} 색상은 모니터 환경에 따라 다르게 보일 수 있어 자연광 컬러컷을 기준으로 촬영합니다.</p>
      <h4>모델 정보</h4><p>모델 163cm · 상의 55 · 하의 26(M). 프리미엄 라인은 155cm / 160cm / 167cm 세 명의 착용 비교 사진을 입고 시 함께 올립니다.</p>`;
    $('#pd-reviews').innerHTML = p.reviews.length
      ? `<div class="reviews">${p.reviews.map(r => `<div class="review"><div class="star">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div><p>"${esc(r.text)}"</p><div class="who">${esc(r.who)}${r.body ? ' · ' + esc(r.body) : ''} · 스마트스토어 구매 리뷰</div>${r.reply ? `<div class="reply"><b>걸스라미 답글</b>${esc(r.reply)}</div>` : ''}</div>`).join('')}</div><p class="small muted" style="margin-top:16px">전체 리뷰 ${p.reviewCount}건은 <a href="${p.smartstore || GR.STORE_URL}" target="_blank" rel="noopener" style="text-decoration:underline">스마트스토어 상품 페이지</a>에서 볼 수 있습니다. 저평점 리뷰에는 원인과 조치를 답글로 남깁니다.</p>`
      : `<div class="notice-box">${soon ? '입고 전 상품입니다. 첫 구매 고객 30명에게는 포토 리뷰 작성 시 3,000원 추가 적립을 드립니다.' : '아직 등록된 리뷰 인용이 없습니다. 스마트스토어 리뷰를 확인해 주세요.'}</div>`;
    $('#pd-notice').innerHTML = `<div class="notice-box"><b>배송 · 교환 · 반품</b><ul style="margin-top:10px">
      <li>평일 14시 이전 결제 완료 시 당일 출고(오늘출발). 소매 전용 재고를 따로 두어 도매 생산 일정과 무관하게 출고합니다.</li>
      <li>단순 변심 교환 3,000원, 반품 5,000원. 상품 하자와 <b>색상이 사진과 다른 경우</b>는 왕복 배송비 없이 처리합니다.</li>
      <li>니트 특성상 잡사, 실뭉침, 약간의 치수 편차(1~3cm)는 불량이 아닙니다. 단추 마감과 색상 편차는 출고 전 로트별 검품으로 확인합니다.</li>
      <li>상담 평일 10:00~18:00 (점심 12:30~13:30). 상담 시간 외 문의는 톡톡 자동응답으로 배송 상태를 먼저 안내합니다.</li></ul></div>`;
    $$('.pd-tabs button').forEach(b => b.addEventListener('click', () => { $$('.pd-tabs button').forEach(x => x.classList.toggle('active', x === b)); $$('.pd-panel').forEach(pn => pn.hidden = pn.id !== b.dataset.tab); }));
    const rel = GR.PRODUCTS.filter(x => x.id !== p.id && (x.category === p.category || x.line !== p.line)).slice(0, 4);
    $('#related-grid').innerHTML = rel.map(card).join('');
    bindNotify();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderChrome();
    if (page === 'home') renderHome();
    if (page === 'shop') renderShop();
    if (page === 'product') renderProduct();
    bindNotify();
    reveal();
  });
})();
