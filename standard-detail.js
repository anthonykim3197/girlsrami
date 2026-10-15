/* Approved Girlsrami own-store product detail. Media is declared, never synthesized here. */
(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const own = (obj, key) => obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
  const url = value => typeof value === 'string' && /^(?:https?:\/\/|\.?\.?\/|[a-zA-Z0-9_-])/.test(value) && !/^[^/]*:/.test(value.replace(/^https?:/, '')) ? value : '';
  const eight = list => Array.isArray(list) && list.length === 8 && list.every(x => url(x));
  const positive = value => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0;
  const lookLabel = (look, color) => own(look?.labelsByColor,color) || look?.label || '스타일링';
  const lookItems = (look, color) => Array.isArray(own(look?.itemsByColor,color)) ? look.itemsByColor[color] : look?.items || [];
  const imageSize = image => positive(image?.width) && positive(image?.height) ? ` width="${positive(image.width)}" height="${positive(image.height)}"` : '';
  function rotation(value) {
    if (eight(value)) return {frames:value};
    if (eight(value?.frames)) return {frames:value.frames};
    if (!Array.isArray(value?.sheets) || value.sheets.length !== 2 || !value.sheets.every(x => url(x))) return null;
    const result = {sheets:value.sheets};
    // Omitted dimensions are measured from the loaded sheet; legacy square cells remain supported.
    const cellWidth = positive(value.cellWidth) || positive(value.cellSize), cellHeight = positive(value.cellHeight) || positive(value.cellSize);
    if (cellWidth) result.cellWidth = cellWidth;
    if (cellHeight) result.cellHeight = cellHeight;
    return result;
  }
  const iconPaths = {
    plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
    chat:'<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 1.5-6A8 8 0 1 1 21 11Z"/><path d="M7 9h8M7 13h5"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    rotate:'<path d="M20 8a9 9 0 1 0 .6 7M20 3v5h-5"/>',left:'<path d="m14 6-6 6 6 6"/>',right:'<path d="m10 6 6 6-6 6"/>',
    play:'<path d="m9 5 11 7-11 7Z"/>',pause:'<path d="M9 5v14M16 5v14"/>',
    bag:'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>',arrow:'<path d="M6 18 18 6M6 6h12v12"/>'
  };
  const icon = key => `<svg class="grsd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[key] || ''}</svg>`;
  const TALK = 'https://talk.naver.com/ct/w4j7l2#nafullscreen';
  function reviewContent(p, store) {
    const source = own(window.GR_SMARTSTORE_REVIEWS,p.id);
    const snapshot = source?.source === 'naver-smartstore' && Array.isArray(source.reviews) ? source : null;
    const sourceUrl = url(snapshot?.url) || store;
    const hasRating = snapshot && Number.isFinite(snapshot.rating) && snapshot.rating >= 0 && snapshot.rating <= 5 && Number.isInteger(snapshot.totalCount) && snapshot.totalCount > 0;
    const summary = hasRating ? `<a class="grsd-review-summary" href="#pd-reviews">스마트스토어 <strong>★ ${snapshot.rating.toFixed(2)}</strong><span>후기 ${snapshot.totalCount}건</span>${icon('right')}</a>` : '';
    const selectedNotice = hasRating && snapshot.reviews.length < snapshot.totalCount ? `전체 ${snapshot.totalCount}건 중 ${snapshot.reviews.length}건을 옮겨 소개합니다. ` : '';
    const cards = (snapshot?.reviews || []).map(r => {
      const stars = Math.max(0,Math.min(5,Math.round(Number(r.rating)||0))), photo = url(r.image);
      return `<article class="grsd-review-card"><div class="grsd-review-card-top"><span class="grsd-review-stars" role="img" aria-label="5점 만점에 ${stars}점">${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</span>${r.kind?`<span class="grsd-review-kind">${esc(r.kind)}</span>`:''}</div><p class="grsd-review-author">${esc(r.author)}<time datetime="${esc(r.date)}">${esc(r.date)}</time></p>${r.option?`<p class="grsd-review-option">${esc(r.option)}</p>`:''}<p class="grsd-review-text">${esc(r.text)}</p>${photo?`<button type="button" class="grsd-review-photo" data-review-image="${esc(photo)}" aria-label="${esc(r.author)} 구매 후기 사진 확대"><img src="${esc(photo)}" alt="${esc(r.option || p.name || '')} 구매 후기 사진" loading="lazy"><span>${icon('plus')}</span></button>`:''}${r.excerpt?'<small class="grsd-review-excerpt">일부 발췌</small>':''}</article>`;
    }).join('');
    const html = `<div class="grsd-reviews-heading"><div><span class="grsd-eyebrow">CUSTOMER REVIEWS</span><h2>구매 후기</h2><p>네이버 스마트스토어에서 남겨 주신 후기입니다.</p></div>${hasRating?`<div class="grsd-review-score"><strong>${snapshot.rating.toFixed(2)}</strong><span>/ 5</span><small>스마트스토어 후기 ${snapshot.totalCount}건</small></div>`:''}</div>${snapshot?`<p class="grsd-review-source">출처: 네이버 스마트스토어 · <time datetime="${esc(snapshot.checkedAt)}">${esc(snapshot.checkedAt)}</time> 확인 기준<br>${selectedNotice}후기는 확인 후 수동으로 갱신합니다. 최신 후기와 원문은 스마트스토어에서 확인해 주세요.</p>`:''}${cards?`<div class="grsd-review-grid">${cards}</div>`:''}<a class="grsd-review-all" href="${esc(sourceUrl)}" target="_blank" rel="noopener">스마트스토어에서 구매 후기 확인 ${icon('arrow')}</a><details class="grsd-review-guide"><summary>구매 후 후기는 어떻게 남기나요?</summary><p>스마트스토어에서 구매한 상품의 후기는 네이버에서 작성할 수 있어요.</p><ol><li>상품을 받으신 뒤 구매확정을 해주세요.</li><li>구매한 네이버 계정으로 <strong>Npay 결제내역</strong>에 들어가세요.</li><li>해당 상품의 <strong>리뷰쓰기</strong>를 선택해 후기를 남겨 주세요.</li></ol><p>작성 가능한 기간과 한달사용리뷰 등 자세한 조건은 네이버 안내를 확인해 주세요. 걸스라미 자사몰에는 확인한 후기를 따로 옮겨 소개합니다.</p><a href="https://help.pay.naver.com/faq/content.help?faqId=10767" target="_blank" rel="noopener">네이버 후기 작성 안내 ${icon('arrow')}</a></details>`;
    return {summary,html};
  }
  const LABELS = {가슴:'가슴 단면',가슴넓이:'가슴 단면',가슴너비:'가슴 단면',어깨:'어깨너비',어깨넓이:'어깨너비',총장:'총기장',목넓이:'목너비',목깊이:'앞목깊이',소매길이:'소매기장'};
  const ORDER = ['가슴 단면','어깨너비','총기장','목너비','앞목깊이','소매기장','암홀','소매통','소매밑단'];
  function normalize(p, supplied = {}) {
    const ai = p.aiPresentation || {}, editorial = ai.editorial || {}, d = supplied || {};
    const colors = (p.colors || []).filter(c => typeof c === 'string');
    const looks = (d.looks || editorial.looks || []).map((l, i) => ({id:String(l.id || `look-${i}`), label:l.label || l.title || `스타일 ${i + 1}`, labelsByColor:l.labelsByColor || {}, itemsByColor:l.itemsByColor || {}, items:Array.isArray(l.items) ? l.items : typeof l.items === 'string' ? l.items.split(' · ') : [], images:Object.fromEntries(colors.filter(c => url(own(l.images,c))).map(c => [c,l.images[c]]))})).filter(l => Object.keys(l.images).length);
    if (!looks.length) {
      const images = Object.fromEntries(colors.filter(c => ai.colors?.[c]?.kind !== 'photo' && url(ai.colors?.[c]?.fullBody || ai.colors?.[c]?.image)).map(c => [c,ai.colors[c].fullBody || ai.colors[c].image]));
      if (Object.keys(images).length) looks.push({id:'signature',label:'시그니처 스타일링',items:[],images});
    }
    if (url(d.thumbnail) && colors.includes(d.thumbnailColor)) {
      if (!looks.length) looks.push({id:'signature',label:'시그니처 스타일링',items:[],images:{}});
      looks[0].images[d.thumbnailColor] = d.thumbnail;
    }
    const model360 = {}, product360 = {}, originals = {};
    colors.forEach(c => {
      const model = own(d.model360,c) || own(editorial.turntables,c) || (ai.turntable?.color === c ? ai.turntable : null), modelRotation = rotation(model);
      if (modelRotation) model360[c] = eight(model) ? model : modelRotation;
      const productRotation = rotation(own(d.product360,c));
      if (productRotation) product360[c] = productRotation;
      const photos = own(d.originals,c);
      if (Array.isArray(photos)) originals[c] = photos.filter(f => url(f.src)).map(f => ({src:f.src,angle:Number.isFinite(Number(f.angle)) ? Number(f.angle) : null}));
      const verified = own(p.colorPhotos,c);
      if (!originals[c]?.length && verified?.verified === true && url(verified.image)) originals[c] = [{src:verified.image,angle:null}];
    });
    if (!Object.values(originals).some(a=>a.length) && p.photoVerified === true && url(p.image)) originals[p.photoColor || colors[0] || '촬영 샘플'] = [{src:p.image,angle:null}];
    const rawMeasure = d.measurements || editorial.measurements || Object.entries(p.measure || {}).map(([label,value]) => ({label,value}));
    const seen = new Set();
    const measurements = rawMeasure.map(m => ({label:LABELS[m.label] || m.label,value:m.value})).filter(m => m.label && m.value !== null && m.value !== '' && Number.isFinite(Number(m.value)) && !seen.has(m.label) && seen.add(m.label)).sort((a,b)=>(ORDER.includes(a.label)?ORDER.indexOf(a.label):99)-(ORDER.includes(b.label)?ORDER.indexOf(b.label):99));
    const sizes = d.size ? [d.size] : (p.sizes || []).map(s => typeof s === 'string' ? s : s.label).filter(s => s && !/미정|확인/.test(s));
    const unit = d.sizeUnit || (/cm/.test(editorial.measurementUnit || '') ? 'cm' : '');
    return {...d, colors,looks,model360,product360,originals,measurements,sizes,unit,
      measurementVerified:d.measurementVerified === true || (d.measurementVerified !== false && Boolean(unit)),
      fabric:(d.fabric || editorial.details || []).map(f => ({src:url(f.src || f.image),caption:f.caption || '',width:positive(f.width),height:positive(f.height)})).filter(f => f.src),
      colorBoard:url(d.colorBoard || editorial.colorStory),
      defaultColor:colors.includes(d.thumbnailColor) ? d.thumbnailColor : colors.includes(ai.defaultColor) ? ai.defaultColor : colors[0] || '',
      lead:d.lead || p.sub || '', storyTitle:d.storyTitle || p.name,
      storyParagraphs:d.storyParagraphs || [p.desc].filter(Boolean),points:d.points || []};
  }
  function measurementDiagram(p, d) {
    const vest = /베스트|조끼|뷔스티에/.test(p.name + ' ' + p.category), bustier = /뷔스티에/.test(p.name), short = /반팔/.test(p.name), vneck = /브이|V넥|VNECK/i.test(p.name);
    let garment = bustier ? 'M155 85L125 90L120 157Q120 195 114 210L105 352H315L306 210Q300 195 300 157L295 90L265 85L265 151Q210 174 155 151Z' : vest ? 'M155 85L116 100L98 155Q121 182 111 226L105 352L315 352L309 226Q299 182 322 155L304 100L265 85L210 162Z' : short ? 'M165 85L120 99L56 173L96 209L119 178L112 352H308L301 178L324 209L364 173L300 99L255 85Q210 120 165 85Z' : 'M165 85L120 99L61 174L35 311L83 323L118 201L112 352H308L302 201L337 323L385 311L359 174L300 99L255 85Q210 120 165 85Z';
    if (vneck && !vest) garment=garment.replace('Q210 120 165 85','L210 162L165 85');
    const locations = {
      '가슴 단면':{line:'M114 210H306',x:90,y:210},'어깨너비':{line:'M116 54H304',x:91,y:54},'총기장':vest?{line:'M357 100V352',x:382,y:226}:{line:'M398 100V352',x:398,y:376},
      '목너비':{line:`M${vest?155:165} 85H${vest?265:255}`,x:210,y:63},'앞목깊이':{line:`M210 89V${bustier?162:vneck?158:108}`,x:238,y:126},
      '소매기장':{line:short?'M309 102L365 168':'M309 102L375 305',x:368,y:short?116:217},
      '암홀':{line:'M128 110V205',x:148,y:172},'소매통':{line:short?'M78 165L102 187':'M62 213L105 226',x:56,y:short?157:214},
      '소매밑단':{line:short?'M58 177L91 205':'M39 306L80 317',x:40,y:short?200:338}
    };
    const marks = d.measurements.map((m,i)=>({number:i+1,...locations[m.label]})).filter(m=>m.line && (!vest || ![6,8,9].includes(ORDER.indexOf(d.measurements[m.number-1].label)+1)));
    return `<svg viewBox="0 0 430 430" role="img" aria-labelledby="grsd-diagram-title"><title id="grsd-diagram-title">${esc(p.name)} 측정 위치. 아래 표의 번호를 확인하세요.</title><defs><marker id="grsd-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="#646d59" stroke-width="1.5"/></marker><pattern id="grsd-ribs" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M2 0v7" stroke="#cdd0c2"/></pattern></defs><path d="${garment}" fill="#e4e3da" stroke="#8f9386" stroke-width="1.7"/>${vneck?'<path d="M155 85L210 162L265 85M149 88L210 174L271 88" fill="none" stroke="#a6aa9b" stroke-width="2"/>':''}<path d="M112 322H308V352H112Z" fill="url(#grsd-ribs)" stroke="#a6aa9b"/>${/가디건/.test(p.name)?'<path d="M210 110V352" stroke="#a6aa9b"/><g fill="#a6aa9b"><circle cx="216" cy="170" r="3"/><circle cx="216" cy="220" r="3"/><circle cx="216" cy="270" r="3"/></g>':''}<g stroke="#949b87" stroke-width=".8" stroke-dasharray="3 4"><path d="M116 54V100M304 54V100${vest?'M304 100H365M315 352H365':''}"/></g><g fill="none" stroke="#646d59" stroke-width="1.2" marker-start="url(#grsd-arrow)" marker-end="url(#grsd-arrow)">${marks.map(m=>`<path d="${m.line}"/>`).join('')}</g>${marks.map(m=>`<circle cx="${m.x}" cy="${m.y}" r="12" fill="#fcfbf7" stroke="#78816a"/><text x="${m.x}" y="${m.y}" fill="#56614b" font-family="sans-serif" font-size="12" text-anchor="middle" dominant-baseline="central">${m.number}</text>`).join('')}<text x="210" y="408" text-anchor="middle" font-size="10" letter-spacing="2" fill="#7d8274">MEASUREMENT GUIDE</text></svg>`;
  }
  function render(p, helpers) {
    const root = document.querySelector('#pd');
    if (!root) return false;
    const d = normalize(p, own(window.GR_DETAIL,p.id)), q = s => root.querySelector(s), qq = s => [...root.querySelectorAll(s)];
    document.body.classList.add('grsd-page'); root.className = 'grsd';
    const name = p.name.replace(/^걸스라미\s*/,''), code = p.styleCode || '', selectedSize = d.sizes[0] || '';
    const hasModels = d.looks.length > 0 || Object.keys(d.model360).length > 0;
    const hasProducts = Object.keys(d.product360).length > 0 || Object.values(d.originals).some(a=>a.length);
    const state = {color:d.defaultColor,look:d.looks[0]?.id || '',mode:hasModels?'model':'product',view:d.looks.length?'look':'spin',frame:0,playing:false};
    const swatch = c => { const value = own(d.colorHex,c) || own(p.colorHex,c) || own(GR.COLORS,c) || own(GR.COLORS,{'스카이':'스카이블루','회색':'그레이'}[c]); return /^#[0-9a-f]{3,8}$/i.test(value || '') ? value : ''; };
    const chips = mobile => d.colors.map(c=>`<button type="button" ${mobile?'data-gallery-color':'data-c'}="${esc(c)}" class="${mobile?'':'color-opt'}${c===state.color?' active':''}" aria-pressed="${c===state.color}">${swatch(c)?`<i style="--grsd-swatch:${swatch(c)}"></i>`:''}<span>${esc(c)}</span></button>`).join('');
    const store = url(p.storeUrl || p.smartstore), price = helpers.offerPriceFor(p), review = reviewContent(p,store);
    // The cart validates the database catalog, independently from display-only size corrections.
    const backendSizes = (p.catalogSizes || p.sizes || []).map(s => typeof s === 'string' ? s : s.label);
    const cartReady = d.colors.length > 0 && d.sizes.length > 0 && !p.sizePending && d.sizes.every(s => backendSizes.includes(s));
    root.innerHTML = `<div class="grsd-breadcrumb"><a href="shop.html">SHOP</a> / ${esc(p.category)}${code?' / '+esc(code):''}</div><div class="grsd-hero"><div class="grsd-media"><div class="grsd-mode" role="group" aria-label="상품 보기 방식">${hasModels?'<button type="button" data-mode="model">모델 착용</button>':''}${hasProducts?'<button type="button" data-mode="product">제품만 보기</button>':''}</div><div class="grsd-gallery-colors" aria-label="사진 색상 선택">${chips(true)}</div><figure class="grsd-stage" tabindex="0" aria-label="상품 이미지. 360도 보기에서 방향키로 회전할 수 있습니다."><img id="pd-img" alt="${esc(name)}" draggable="false" fetchpriority="high"><div class="grsd-sprite" role="img" hidden></div><span class="grsd-stage-label"></span><span class="grsd-loading" role="status" hidden>사진 불러오는 중</span><button type="button" class="grsd-zoom" aria-label="현재 상품 이미지 확대">${icon('plus')}</button></figure><div class="grsd-image-meta"><span class="grsd-caption" aria-live="polite"></span><span class="grsd-angle"></span></div><p class="grsd-media-note" role="status"></p><div class="grsd-gallery-tools"><div class="grsd-views" role="group" aria-label="모델 이미지 종류"><button type="button" data-view="look">코디 화보</button><button type="button" data-view="spin">${icon('rotate')}360° 착용</button></div><button class="grsd-original" type="button" hidden>실물 사진 보기</button></div><div class="grsd-looks" role="group" aria-label="코디 선택"></div><div class="grsd-spin" hidden><div class="grsd-rotation-toolbar"><button type="button" data-step="-1" aria-label="이전 각도">${icon('left')}</button><button type="button" class="grsd-play" aria-pressed="false">${icon('play')}<span>자동 회전</span></button><button type="button" data-step="1" aria-label="다음 각도">${icon('right')}</button></div><div class="grsd-angles" aria-label="사진 각도"></div><p class="grsd-rotation-hint">사진을 좌우로 밀어 돌려보세요.</p></div></div><div class="grsd-info"><div class="grsd-eyebrow">${(d.isNewDesign ?? (p.newRelease === true))?'<span class="grsd-new">NEW</span>':''}<span>GIRLSRAMI KNIT EDIT</span></div><h1>${esc(name)}</h1>${d.lead?`<p class="grsd-lead">${esc(d.lead)}</p>`:''}${Number.isFinite(price)?`<p class="grsd-price">${price.toLocaleString('ko-KR')}<span>원</span></p>`:''}${review.summary}<div class="grsd-options"><div class="grsd-color-heading"><span>COLOR</span><strong id="color-name">${esc(state.color)}</strong><small>${d.colors.length} COLORS</small></div><div class="grsd-swatches" id="color-opts" role="group" aria-label="판매 색상">${chips(false)}</div><div class="grsd-size-row"><span>SIZE</span><div id="size-opts">${d.sizes.length?d.sizes.map(s=>`<button type="button" class="size-opt${s===selectedSize?' active':''}" data-s="${esc(s)}" aria-pressed="${s===selectedSize}">${esc(s)}</button>`).join(''):'<span>스마트스토어에서 확인</span>'}</div>${d.measurements.length?'<a href="#size">실측 확인</a>':''}</div></div><a class="grsd-purchase" href="${esc(store)}" target="_blank" rel="noopener">${icon('bag')}<span>스마트스토어에서 구매하기</span>${icon('arrow')}</a><div class="grsd-utility"><a href="${TALK}" target="_blank" rel="noopener">${icon('chat')}톡톡 문의</a><button type="button" id="share-btn">${icon('share')}링크 공유</button></div><button type="button" class="grsd-cart" id="add-cart"${!cartReady?' disabled':''}>${icon('bag')}장바구니에 담기</button><p id="product-cart-status" role="status">${!cartReady?'구매는 스마트스토어에서 바로 진행할 수 있어요.':''}</p><p class="grsd-shipping-note">색상 선택과 결제는 스마트스토어에서 진행됩니다.<br>배송 및 교환 조건은 구매 페이지에서 확인해 주세요.</p></div></div><dialog class="grsd-lightbox" aria-label="상품 이미지 확대"><button type="button" class="grsd-lightbox-close" aria-label="확대 이미지 닫기">${icon('close')}</button><img alt="확대 상품 이미지"><div class="grsd-lightbox-sprite" hidden></div><span class="grsd-loading grsd-lightbox-status" role="status" hidden></span></dialog>`;
    const sectionHead = (title, index, desc='')=>`<div class="grsd-section-heading"><div><h2>${title}</h2>${desc?`<p>${esc(desc)}</p>`:''}</div><span>${index}</span></div>`;
    const desc = document.querySelector('#pd-desc'); desc.className='grsd grsd-detail';
    desc.innerHTML = `<section class="grsd-story"><span class="grsd-eyebrow">GIRLSRAMI KNIT EDIT</span><h2>${esc(d.storyTitle)}</h2>${d.storyParagraphs.map(t=>`<p>${esc(t)}</p>`).join('')}${d.points.length?`<div class="grsd-points">${d.points.map(x=>`<article><b>${esc(x.title)}</b><p>${esc(x.text)}</p></article>`).join('')}</div>`:''}</section>${d.looks.some(l=>l.items.length || Object.values(l.itemsByColor || {}).some(a=>a.length))?`<section class="grsd-section" id="styling">${sectionHead('Styling','01 / HOW TO WEAR')}<div class="grsd-style-notes">${d.looks.filter(l=>l.items.length).map((l,i)=>`<article><small>LOOK ${String(i+1).padStart(2,'0')}</small><h3>${esc(l.label)}</h3><p>${l.items.map(esc).join(' · ')}</p></article>`).join('')}</div></section>`:''}${d.colorBoard?`<section class="grsd-section" id="colors">${sectionHead('Color Palette','02 / COLORS')}<figure><button class="grsd-image-button" type="button" data-full-image="${esc(d.colorBoard)}" aria-label="색상 이미지 확대"><img src="${esc(d.colorBoard)}"${imageSize(d.colorBoardSize)} alt="${esc(name)} 판매 색상 ${esc(d.colors.join(', '))}" loading="lazy"></button><figcaption>${esc(d.colors.join(' · '))}</figcaption></figure></section>`:''}<section class="grsd-section" id="fabric">${sectionHead('Fabric Detail','03 / TEXTURE')}<div class="grsd-fabric-layout"><div class="grsd-fabric-photos">${d.fabric.map(f=>`<figure><button class="grsd-image-button" type="button" data-full-image="${esc(f.src)}" aria-label="원단 디테일 확대"><img src="${esc(f.src)}"${imageSize(f)} alt="${esc(f.caption || name+' 원단 디테일')}" loading="lazy"></button>${f.caption?`<figcaption>${esc(f.caption)}</figcaption>`:''}</figure>`).join('')}</div><div class="grsd-fabric-copy"><span class="grsd-eyebrow">FABRIC & CARE</span><h3>${esc(d.materialRaw || p.material || '소재와 관리')}</h3>${d.materialNote?`<p>${esc(d.materialNote)}</p>`:''}${p.care?`<p>${esc(p.care)}</p>`:''}</div></div></section>${d.measurements.length?`<section class="grsd-section" id="size">${sectionHead('Size Guide','04 / FIT & SIZE','잘 맞는 옷을 옆에 두고, 같은 위치를 비교해 보세요.')}<div class="grsd-size-layout"><figure class="grsd-measurement-art">${measurementDiagram(p,d)}<figcaption>측정 위치를 안내하는 도식입니다.</figcaption></figure><div><div class="grsd-size-kicker"><strong>${esc(d.sizes.join(' / ') || '사이즈 확인 중')}</strong><span>단면 기준${d.unit?' · '+esc(d.unit):' · 단위 확인 중'}</span></div><table class="grsd-measure-table"><caption class="grsd-sr-only">${esc(name)} 실측</caption><thead><tr><th scope="col">측정 위치</th><th scope="col">실측${d.unit?' ('+esc(d.unit)+')':''}</th></tr></thead><tbody>${d.measurements.map((m,i)=>`<tr><td><span class="grsd-number">${i+1}</span>${esc(m.label)}</td><td><b>${esc(m.value)}</b></td></tr>`).join('')}</tbody></table><p class="grsd-size-note">상품을 평평하게 놓고 잰 단면 수치입니다.<br>측정 위치와 방법에 따라 차이가 있을 수 있습니다.${!d.measurementVerified?'<br>측정 단위 확인 전에는 수치만으로 사이즈를 결정하지 마세요.':''}</p></div></div></section>`:''}<dl class="grsd-product-info">${[['STYLE NO.',code],['SIZE',d.sizes.join(' / ')],['MADE IN',p.origin],['MANUFACTURER',p.manufacturer]].filter(([,v])=>v).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p class="grsd-disclosure">모델 착용 및 일부 연출 이미지는 AI로 제작되어 실제 상품과 차이가 있을 수 있습니다. 색상과 짜임은 실물 사진을, 크기는 실측표를 함께 참고해 주세요. 함께 코디한 의류와 소품은 판매 구성에 포함되지 않습니다.</p>`;
    const tabs = document.querySelector('.pd-tabs');
    if (tabs) { tabs.className='grsd-section-nav'; tabs.innerHTML=`${d.looks.some(l=>l.items.length || Object.values(l.itemsByColor || {}).some(a=>a.length))?'<a href="#styling">Styling</a>':''}<a href="#fabric">Fabric Detail</a>${d.measurements.length?'<a href="#size">Size Guide</a>':''}<a href="#pd-reviews">Reviews</a><a href="#pd-notice">배송·교환</a>`; }
    const reviews = document.querySelector('#pd-reviews'); reviews.hidden=false; reviews.className='grsd grsd-lower';
    reviews.classList.add('grsd-reviews'); reviews.innerHTML=review.html;
    const notice = document.querySelector('#pd-notice'); notice.hidden=false; notice.className='grsd grsd-lower';
    notice.innerHTML=`<details><summary>배송 · 교환 · 관리 안내</summary><p>${esc(p.care || '세탁 전 상품의 케어라벨을 확인해 주세요.')}</p><p>배송비, 출고 예정일 및 교환·반품 조건은 스마트스토어 상품 페이지의 현재 안내를 확인해 주세요.</p><a href="${esc(store)}" target="_blank" rel="noopener">구매 페이지 안내 확인 ${icon('arrow')}</a></details>`;
    const related = GR.PRODUCTS.filter(x=>helpers.isSaleProduct(x)&&x.id!==p.id&&x.category===p.category).slice(0,4);
    document.querySelector('#related-grid').innerHTML=related.map(helpers.card).join('');
    const chatLabel=document.querySelector('#gr-chat-fab > span'); if(chatLabel)chatLabel.textContent='1:1 상담';
    bindGallery();
    function bindGallery() {
      const stage=q('.grsd-stage'), image=q('#pd-img'), sprite=q('.grsd-sprite'), loading=q('.grsd-loading'), caption=q('.grsd-caption'), note=q('.grsd-media-note'), angles=q('.grsd-angles'), box=q('.grsd-lightbox');
      let serial=0, zoomSerial=0, timer=null, generation=0, displayed=null, pointer=null, opener=null, lookKey=null, angleKey=null;
      const loaded=new Map();
      function load(src) { if(!loaded.has(src))loaded.set(src,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve({src,width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>{loaded.delete(src);reject(new Error('image'));};img.src=src;}));return loaded.get(src); }
      const selectedLook=()=>d.looks.find(l=>l.id===state.look) || d.looks[0];
      function source() {
        if(state.mode==='model') {
          const model = rotation(own(d.model360,state.color));
          if(state.view==='spin'&&model)return {...model,color:state.color,kind:'model',spin:true};
          const look=selectedLook(),exact=url(own(look?.images,state.color));
          if(exact)return {frames:[exact],color:state.color,kind:'model',look};
          const real = own(d.originals,state.color);
          if(real?.length)return {frames:real.map(f=>f.src),angles:real.map(f=>f.angle),color:state.color,kind:'original',modelUnavailable:true,spin:real.length===8&&real.every((f,i)=>f.angle===i*45)};
          const available=Object.keys(look?.images||{})[0];
          if(available)return {frames:[look.images[available]],color:available,kind:'model',look,sample:true};
          const turnColor=Object.keys(d.model360)[0];
          if(turnColor)return {...rotation(d.model360[turnColor]),color:turnColor,kind:'model',spin:true,sample:turnColor!==state.color};
        }
        const product=own(d.product360,state.color);
        if(product)return {...product,color:state.color,kind:'product',spin:true};
        const exact=own(d.originals,state.color),c=exact?.length?state.color:Object.keys(d.originals).find(c=>d.originals[c].length);
        if(c)return {frames:d.originals[c].map(f=>f.src),angles:d.originals[c].map(f=>f.angle),color:c,kind:'original',sample:c!==state.color,spin:d.originals[c].length===8&&d.originals[c].every((f,i)=>f.angle===i*45)};
        const productColor=Object.keys(d.product360)[0];
        if(productColor)return {...d.product360[productColor],color:productColor,kind:'product',spin:true,sample:true};
        return null;
      }
      function stop(){clearTimeout(timer);timer=null;generation++;state.playing=false;const play=q('.grsd-play');play.setAttribute('aria-pressed','false');play.innerHTML=icon('play')+'<span>자동 회전</span>';}
      function updateControls(current) {
        const count=current?.sheets?8:current?.frames.length||0;
        qq('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
        qq('[data-c],[data-gallery-color]').forEach(b=>{const on=(b.dataset.c||b.dataset.galleryColor)===state.color;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
        q('#color-name').textContent=state.color;
        q('.grsd-views').hidden=state.mode!=='model';
        qq('[data-view]').forEach(b=>{b.hidden=b.dataset.view==='spin'?!rotation(own(d.model360,state.color)):!d.looks.length;b.setAttribute('aria-pressed',String(b.dataset.view===state.view));});
        q('.grsd-looks').hidden=state.mode!=='model'||state.view!=='look';
        const nextLookKey = `${state.color}|${state.look}`;
        if (nextLookKey !== lookKey) { lookKey = nextLookKey; q('.grsd-looks').innerHTML=d.looks.map(l=>{const exact=url(own(l.images,state.color)),src=exact||Object.values(l.images)[0];return `<button type="button" data-look="${esc(l.id)}" aria-pressed="${l.id===state.look}"${!exact?' disabled':''}><img src="${esc(src)}" alt="" width="100" height="140" loading="lazy"><span>${esc(lookLabel(l,state.color))}</span>${!exact?'<small>선택 색상 화보 없음</small>':''}</button>`;}).join(''); }
        const styleNotes = desc.querySelector('.grsd-style-notes');
        if (styleNotes) styleNotes.innerHTML=d.looks.filter(l=>own(l.images,state.color) && lookItems(l,state.color).length).map((l,i)=>`<article><small>LOOK ${String(i+1).padStart(2,'0')}</small><h3>${esc(lookLabel(l,state.color))}</h3><p>${lookItems(l,state.color).map(esc).join(' · ')}</p></article>`).join('');
        q('.grsd-spin').hidden=count<2; q('.grsd-rotation-toolbar').hidden=!current?.spin;
        const nextAngleKey = `${count}|${current?.spin}|${current?.angles?.join(',')}`;
        if (nextAngleKey !== angleKey) { angleKey = nextAngleKey; angles.innerHTML=count>1?Array.from({length:count},(_,i)=>`<button type="button" data-angle="${i}" aria-pressed="${state.frame===i}">${current.spin?i*45+'°':current.angles?.[i]!==null&&current.angles?.[i]!==undefined?current.angles[i]+'°':i+1}</button>`).join(''):''; }
        angles.querySelectorAll('[data-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.angle)===state.frame)));
        q('.grsd-rotation-hint').textContent=current?.spin?(state.mode==='model'?`${d.model360Label || lookLabel(d.looks[0],state.color)} 착장의 8방향입니다. 사진을 좌우로 밀어 돌려보세요.`:'사진을 좌우로 밀어 돌려보세요.'):'실제 촬영된 사진을 순서대로 확인하세요.';
        q('.grsd-original').hidden=!own(d.originals,current?.color)?.length||state.mode!=='product'||current?.kind==='original';
      }
      async function show() {
        const token=++serial,current=source();
        const count=current?.sheets?8:current?.frames.length||0;state.frame=count?((state.frame%count)+count)%count:0;
        updateControls(current);
        if(!current){image.hidden=true;sprite.hidden=true;note.textContent='현재 등록된 사진이 없습니다. 스마트스토어에서 상품 사진을 확인해 주세요.';q('.grsd-zoom').disabled=true;return false;}
        const frame=state.frame,src=current.sheets?current.sheets[frame<4?0:1]:current.frames[frame];
        loading.hidden=false;q('.grsd-zoom').disabled=true;
        try { const loadedImage=await load(src);if(token!==serial)return false;
          image.hidden=Boolean(current.sheets);sprite.hidden=!current.sheets;
          const position=`${frame%2*100}% ${Math.floor(frame%4/2)*100}%`;
          const cellWidth=current.sheets?(positive(current.cellWidth)||loadedImage.width/2):0,cellHeight=current.sheets?(positive(current.cellHeight)||loadedImage.height/2):0;
          if(current.sheets){sprite.style.backgroundImage=`url(${JSON.stringify(src)})`;sprite.style.backgroundPosition=position;stage.style.setProperty('--grsd-frame-aspect',`${cellWidth} / ${cellHeight}`);sprite.setAttribute('aria-label',`${name} ${current.color} ${current.kind==='model'?'모델 착용':'제품'} ${frame*45}도`);}
          else {image.src=src;image.alt=`${name} ${current.color} ${current.spin?frame*45+'도':current.look?lookLabel(current.look,current.color):'실물 사진'}`;stage.style.removeProperty('--grsd-frame-aspect');}
          displayed={src,position,sprite:Boolean(current.sheets),cellWidth,cellHeight};
          stage.classList.toggle('is-product',current.kind!=='model');stage.classList.toggle('is-spin',Boolean(current.spin));stage.classList.toggle('has-sprite',Boolean(current.sheets));
          q('.grsd-stage-label').textContent=current.kind==='model'?(current.spin?'360° STYLING':'STYLING'):current.kind==='original'?'PRODUCT PHOTO':'PRODUCT VIEW';
          caption.textContent=`${current.color} · ${current.spin?'8방향':current.look?lookLabel(current.look,current.color):'실물 사진'}`;
          q('.grsd-angle').textContent=current.spin?frame*45+'° / 360°':code;
          note.textContent=current.modelUnavailable?'선택 색상은 착용 화보 대신 실제 상품 사진으로 보여드립니다.':current.sample?`선택 옵션은 ${state.color}입니다. 현재 사진은 ${current.color} 촬영 샘플로, 선택 색상 사진과 다릅니다.`:'';
          q('.grsd-zoom').disabled=false;
          return true;
        }catch{if(token===serial){stop();image.hidden=true;sprite.hidden=true;displayed=null;caption.textContent='';q('.grsd-stage-label').textContent='';q('.grsd-angle').textContent='';note.textContent='사진을 불러오지 못했어요. 색상이나 각도를 다시 선택해 주세요.';}return false;}finally{if(token===serial)loading.hidden=true;}
      }
      function change(values){stop();Object.assign(state,values);if(state.mode==='model'&&state.view==='spin'&&!rotation(own(d.model360,state.color))&&d.looks.length)state.view='look';show();}
      root.addEventListener('click',e=>{
        const b=e.target.closest('button');if(!b)return;
        if(b.matches('[data-c],[data-gallery-color]'))change({color:b.dataset.c||b.dataset.galleryColor});
        if(b.matches('[data-mode]'))change({mode:b.dataset.mode});
        if(b.matches('[data-look]'))change({look:b.dataset.look,view:'look',frame:0});
        if(b.matches('[data-view]'))change({view:b.dataset.view,frame:0});
        if(b.matches('[data-angle]'))change({frame:Number(b.dataset.angle)});
        if(b.matches('[data-step]'))change({frame:state.frame+Number(b.dataset.step)});
        if(b.matches('[data-s]'))qq('[data-s]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
      });
      q('.grsd-play').onclick=async()=>{if(state.playing)return stop();const current=source();if(!current?.spin)return;state.playing=true;const loop=++generation;q('.grsd-play').setAttribute('aria-pressed','true');q('.grsd-play').innerHTML=icon('pause')+'<span>일시 정지</span>';const tick=async()=>{if(!state.playing||loop!==generation)return;state.frame++;await show();if(state.playing&&loop===generation)timer=setTimeout(tick,1400);};timer=setTimeout(tick,1400);};
      stage.addEventListener('keydown',e=>{const current=source(),count=current?.sheets?8:current?.frames.length||0;if(count<2)return;const next={ArrowLeft:state.frame-1,ArrowRight:state.frame+1,Home:0,End:count-1}[e.key];if(next!==undefined){e.preventDefault();change({frame:next});}});
      stage.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;const current=source();if((current?.sheets?8:current?.frames.length||0)<2)return;stop();pointer={id:e.pointerId,x:e.clientX};stage.setPointerCapture(e.pointerId);});
      stage.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const delta=e.clientX-pointer.x;if(Math.abs(delta)>36){state.frame+=delta>0?1:-1;pointer.x=e.clientX;show();}});
      const release=()=>{pointer=null;};stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
      document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
      if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(stage);
      async function zoom(data,button){
        if(!data)return;
        stop();opener=button;const token=++zoomSerial;
        const img=box.querySelector('img'),sp=box.querySelector('.grsd-lightbox-sprite'),status=box.querySelector('.grsd-lightbox-status');
        img.hidden=true;sp.hidden=true;img.removeAttribute('src');
        box.classList.toggle('is-review-photo',Boolean(data.review));img.alt=data.alt || '확대 상품 이미지';
        status.textContent='사진 불러오는 중';status.hidden=Boolean(data.sprite);
        if(!box.open)box.showModal();
        if(data.sprite){
          sp.style.backgroundImage=`url(${JSON.stringify(data.src)})`;sp.style.backgroundPosition=data.position;
          sp.style.setProperty('--grsd-cell-width',`${data.cellWidth}px`);sp.style.setProperty('--grsd-cell-height',`${data.cellHeight}px`);
          sp.style.setProperty('--grsd-cell-ratio',String(data.cellWidth/data.cellHeight));sp.hidden=false;
          return;
        }
        try{
          await load(data.src);
          if(token!==zoomSerial||!box.open)return;
          img.src=data.src;
          if(img.decode)await img.decode();
          if(token!==zoomSerial||!box.open)return;
          img.hidden=false;status.hidden=true;
        }catch{
          if(token!==zoomSerial||!box.open)return;
          img.hidden=true;img.removeAttribute('src');status.hidden=false;
          status.textContent='사진을 불러오지 못했어요. 창을 닫고 다시 시도해 주세요.';
        }
      }
      q('.grsd-zoom').onclick=e=>zoom(displayed,e.currentTarget);
      q('.grsd-original').onclick=e=>{const current=source(),originals=own(d.originals,current?.color);if(originals?.length)zoom({src:(originals.find(x=>x.angle===state.frame*45)||originals[0]).src,sprite:false},e.currentTarget);};
      desc.querySelectorAll('[data-full-image]').forEach(b=>b.onclick=()=>zoom({src:b.dataset.fullImage,sprite:false},b));
      reviews.querySelectorAll('[data-review-image]').forEach(b=>b.onclick=()=>zoom({src:b.dataset.reviewImage,sprite:false,review:true,alt:b.querySelector('img').alt},b));
      box.querySelector('button').onclick=()=>box.close();box.addEventListener('close',()=>{zoomSerial++;box.querySelector('img').hidden=true;box.querySelector('.grsd-lightbox-sprite').hidden=true;box.querySelector('.grsd-lightbox-status').hidden=true;opener?.focus();});box.addEventListener('click',e=>{if(e.target===box)box.close();});
      q('#share-btn').onclick=async()=>{const canonical=new URL(helpers.productHref(p),'https://girlslami.com/').href;try{await navigator.clipboard.writeText(canonical);GR.toast?.('상품 링크를 복사했습니다.');}catch{window.prompt('상품 링크를 복사해 주세요.',canonical);}};
      show();
    }
    return true;
  }
  window.GRStandardDetail=Object.freeze({render,normalize,measurementDiagram,reviewContent});
})();
