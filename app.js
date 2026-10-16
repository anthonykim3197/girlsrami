/* 걸스라미 자사몰 공통 스크립트 */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.page || '';
  const SITE_URL = 'https://girlslami.com/';

  function storeUrlFor(p) {
    return String(p?.storeUrl || p?.smartstore || '').trim();
  }
  function isSaleProduct(p) {
    const storeUrl = storeUrlFor(p);
    return p?.status === 'active'
      && /^https:\/\/smartstore\.naver\.com\/girlsrami\/products\/\d+\/?$/.test(storeUrl);
  }
  function productHref(p) { return `product-${encodeURIComponent(p.id)}.html`; }
  function offerPriceFor(p) {
    const naver = Number(typeof p?.channelPrice === 'object' ? p.channelPrice?.naver : p?.channelPrice);
    return Number.isFinite(naver) && naver > 0 ? naver : Number(p?.price);
  }
  function availabilityFor(p) {
    return Number(p?.stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  }
  function verifiedRealImageFor(p) {
    return Object.values(p?.colorPhotos || {}).find(photo => photo?.verified === true && photo.image)?.image
      || (p?.photoVerified === true ? p.image : '');
  }
  function startingColorFor(p, aiColor) {
    if (aiColor) return aiColor;
    if (p.photoSampleOnly) return null;
    return p.newRelease && p.colors.includes(p.photoColor) ? p.photoColor : p.colors[0] || null;
  }
  function setMeta(selector, attribute, value) {
    let node = document.head.querySelector(selector);
    if (!node) { node = document.createElement('meta'); document.head.append(node); }
    node.setAttribute(attribute, value);
  }
  function setCanonical(url) {
    let node = document.head.querySelector('link[rel="canonical"]');
    if (!node) { node = document.createElement('link'); node.rel = 'canonical'; document.head.append(node); }
    node.href = url;
  }
  function setProductMetadata(p) {
    const canonical = SITE_URL + productHref(p);
    const material = String(p.material || '').trim();
    const detail = window.GR_DETAIL?.[p.id];
    const colors = Array.isArray(p.colors) && p.colors.length ? p.colors.join(', ') : '';
    const description = `${nameFor(p)}. ${detail?.lead || material}${detail?.lead ? ' ' : material ? '. ' : ''}${colors ? `판매 색상 ${colors}. ` : ''}현재 구매 가능한 옵션과 배송 조건은 스마트스토어에서 확인하세요.`;
    const absoluteImage = value => /^https?:\/\//i.test(value) ? value : SITE_URL + value.replace(/^\//, '');
    const realImage = verifiedRealImageFor(p);
    const image = detail?.cardThumbnail || detail?.thumbnail || realImage;
    document.title = `${nameFor(p)} | 걸스라미`;
    if (!document.head) return;
    setMeta('meta[name="description"]', 'name', 'description');
    document.head.querySelector('meta[name="description"]').content = description;
    setMeta('meta[property="og:type"]', 'property', 'og:type'); document.head.querySelector('meta[property="og:type"]').content = 'product';
    setMeta('meta[property="og:title"]', 'property', 'og:title'); document.head.querySelector('meta[property="og:title"]').content = `${nameFor(p)} | 걸스라미`;
    setMeta('meta[property="og:description"]', 'property', 'og:description'); document.head.querySelector('meta[property="og:description"]').content = description;
    setMeta('meta[property="og:url"]', 'property', 'og:url'); document.head.querySelector('meta[property="og:url"]').content = canonical;
    if (image) { setMeta('meta[property="og:image"]', 'property', 'og:image'); document.head.querySelector('meta[property="og:image"]').content = absoluteImage(image); }
    setCanonical(canonical);
    document.head.querySelector('meta[name="robots"]')?.remove();
    const jsonLd = {
      '@context': 'https://schema.org', '@type': 'Product', name: nameFor(p), description,
      ...(image ? { image: [...new Set([image, realImage].filter(Boolean).map(absoluteImage))] } : {}),
      sku: styleCodeFor(p) || String(p.sku || ''), category: p.category || undefined,
      brand: { '@type': 'Brand', name: '걸스라미' },
      offers: { '@type': 'Offer', url: storeUrlFor(p), priceCurrency: 'KRW', price: offerPriceFor(p), availability: availabilityFor(p), seller: { '@type': 'Organization', name: '걸스라미' } }
    };
    let script = document.head.querySelector('script[data-product-json-ld]');
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.productJsonLd = ''; document.head.append(script); }
    script.textContent = JSON.stringify(jsonLd);
  }
  function noindexProductShell() {
    if (!document.head) return;
    setMeta('meta[name="robots"]', 'name', 'robots');
    document.head.querySelector('meta[name="robots"]').content = 'noindex,follow,noimageindex';
    setCanonical(SITE_URL + 'shop.html');
    document.head.querySelector('script[data-product-json-ld]')?.remove();
  }
  window.GR.storefront = Object.freeze({ isSaleProduct, productHref, verifiedRealImageFor, offerPriceFor, availabilityFor, startingColorFor });

  /* ---------- Catalog presentation contract ---------- */
  function nameFor(p) {
    return String(p?.name || '').trim().replace(/^걸스라미\s*/, '').replace(/\s*\(\s*RM\d+\s*\)\s*$/i, '');
  }
  function styleCodeFor(p) {
    const explicit = String(p?.styleCode || '').trim();
    const legacy = String(p?.sku || '').trim();
    const code = explicit || (/^RM\d+$/i.test(legacy) ? legacy : '');
    return /^RM\d+$/i.test(code) ? code.toUpperCase() : code;
  }
  const QUALITY_EDITORIALS = Object.freeze({
    RM382: {
      code: 'RM382', name: '허니루프 라운드 니트',
      intro: '벌집 조직과 라운드넥, 총장 50cm의 여유 있는 니트.',
      description: '벌집 조직, 라운드넥, 가슴 단면 58cm, 총장 50cm의 긴소매 니트입니다.',
      hero: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-cream-67661bfc.webp', width: 1000, height: 1000, alt: '크림 허니루프 라운드 니트 AI 코디', caption: 'AI 코디 · 크림' },
      colorLead: '판매 색상은 크림, 카멜, 차콜, 스카이 네 가지입니다.',
      colorBoard: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/board-8fd34a81.webp', width: 1536, height: 1024, alt: '허니루프 라운드 니트 네 가지 컬러 AI 연출', caption: 'AI 컬러 연출 · 화면과 조명에 따라 실제 색상과 차이가 있을 수 있습니다.' },
      colors: [['크림','#e9e0cf'],['카멜','#aa8059'],['차콜','#494a4b'],['스카이','#acc6df']],
      styling: [
        {
          title: 'AI 코디 1 · 데님과 롱스커트', lead: '스카이 색상은 데님, 카멜 색상은 롱스커트와 조합한 예시입니다.',
          notice: 'AI 코디 연출컷입니다. 니트 단품 상품이며 하의·신발·가방은 구성에 포함되지 않습니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/sky-51437f2b.webp', width: 1024, height: 1536, alt: '스카이 허니루프 라운드 니트와 데님 AI 코디', meta: 'AI 코디 · 스카이', title: '스카이 · 데님', items: '라이트 워시 데님 · 아이보리 스니커즈 · 브라운 숄더백' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/soft-skirt/camel-2365159f.webp', width: 1024, height: 1536, alt: '카멜 허니루프 라운드 니트와 롱스커트 AI 코디', meta: 'AI 코디 · 카멜', title: '카멜 · 롱스커트', items: '아이보리 롱스커트 · 블랙 플랫 · 미니 토트백' }
          ]
        },
        {
          title: 'AI 코디 2 · 미니스커트와 와이드 팬츠', lead: '차콜 색상은 미니스커트, 크림 색상은 와이드 팬츠와 조합한 예시입니다.',
          notice: 'AI로 만든 코디 이미지입니다. 실제 원단의 짜임은 아래 실물 접사에 표시합니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-mini/charcoal-2997e712.webp', width: 1024, height: 1536, alt: '차콜 허니루프 라운드 니트와 미니스커트 AI 코디', meta: 'AI 코디 · 차콜', title: '차콜 · 미니스커트', items: '차콜 A라인 미니스커트 · 블랙 로퍼 · 블랙 숄더백' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/tailored/cream-917467b6.webp', width: 1024, height: 1536, alt: '크림 허니루프 라운드 니트와 와이드 팬츠 AI 코디', meta: 'AI 코디 · 크림', title: '크림 · 와이드 팬츠', items: '크림 와이드 팬츠 · 블랙 슬링백 · 미니 토트백' }
          ]
        }
      ],
      realDetail: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/honey-loop-crop-knit/real-macro-1-a59df53e.webp', width: 1000, height: 1000, alt: '스카이 허니루프 라운드 니트 실물 짜임 접사', caption: '실물 사진 · 스카이' },
      detailLead: '반복되는 벌집 조직과 소맷단·밑단의 립 조직을 실물 접사로 표시했습니다.',
      material: '리싸이클 폴리 52% · 폴리 25% · 나일론 11% · 울 8% · 스판 4%',
      facts: [['품번','RM382'],['제조국','국산(대한민국)'],['제조자','걸스라미'],['제조연월','2026년 10월']],
      measurements: [['목깊이','4'],['목넓이','22'],['소매통','18'],['총기장','50'],['가슴넓이','58'],['소매기장','51'],['어깨넓이','51']],
      care: '세탁 전 케어라벨을 확인해 주세요. 고온 세탁·기계 건조는 피하고 세탁 방법은 전문 세탁업체와 상담해 주세요.'
    },
    RM495: {
      code: 'RM495', name: '오프듀티 V넥 니트 베스트',
      intro: 'V넥 입체 조직, 총장 46cm의 레이어드 니트 베스트.',
      description: 'V넥 입체 조직, 가슴 단면 55cm, 총장 46cm의 니트 베스트입니다.',
      hero: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-gray-979a3c86.webp', width: 1000, height: 1000, alt: '회색 오프듀티 V넥 니트 베스트 AI 코디', caption: 'AI 코디 · 회색' },
      colorLead: '판매 색상은 스카이, 차콜, 크림, 카멜, 회색 다섯 가지입니다.',
      colorBoard: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/boards/off-duty-vneck-knit-vest-e6d5971d.webp', width: 1536, height: 1024, alt: '오프듀티 V넥 니트 베스트 다섯 가지 컬러 AI 연출', caption: 'AI 컬러 연출 · 화면과 조명에 따라 실제 색상과 차이가 있을 수 있습니다.' },
      colors: [['스카이','#acc6df'],['차콜','#494a4b'],['크림','#e9e0cf'],['카멜','#aa8059'],['회색','#9b9b98']],
      styling: [
        {
          title: 'AI 코디 1 · 티셔츠와 셔츠', lead: '스카이 색상은 티셔츠, 카멜 색상은 셔츠 위에 겹친 예시입니다.',
          notice: 'AI 코디 연출컷입니다. 베스트 단품 상품이며 이너·하의·신발·가방은 구성에 포함되지 않습니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/sky-54519f0f.webp', width: 1024, height: 1536, alt: '스카이 오프듀티 V넥 니트 베스트와 티셔츠 AI 코디', meta: 'AI 코디 · 스카이', title: '스카이 · 티셔츠', items: '화이트 티셔츠 · 라이트 워시 데님 · 아이보리 스니커즈 · 브라운 숄더백' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/camel-9c46c383.webp', width: 1024, height: 1536, alt: '카멜 오프듀티 V넥 니트 베스트와 셔츠 AI 코디', meta: 'AI 코디 · 카멜', title: '카멜 · 셔츠', items: '화이트 셔츠 · 아이보리 롱스커트 · 블랙 플랫 · 미니 토트백' }
          ]
        },
        {
          title: 'AI 코디 2 · 미니스커트와 와이드 팬츠', lead: '차콜 색상은 미니스커트, 크림 색상은 와이드 팬츠와 조합한 예시입니다.',
          notice: 'AI로 만든 코디 이미지입니다. 실제 원단의 짜임은 아래 실물 접사에 표시합니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/charcoal-6a7578e3.webp', width: 1024, height: 1536, alt: '차콜 오프듀티 V넥 니트 베스트와 미니스커트 AI 코디', meta: 'AI 코디 · 차콜', title: '차콜 · 미니스커트', items: '블루 스트라이프 셔츠 · 차콜 A라인 미니스커트 · 블랙 로퍼 · 블랙 숄더백' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/cream-94955b6b.webp', width: 1024, height: 1536, alt: '크림 오프듀티 V넥 니트 베스트와 와이드 팬츠 AI 코디', meta: 'AI 코디 · 크림', title: '크림 · 와이드 팬츠', items: '화이트 셔츠 · 크림 와이드 팬츠 · 블랙 슬링백 · 미니 토트백' }
          ]
        }
      ],
      realDetail: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/real-macro-1-9f18d696.webp', width: 1000, height: 1000, alt: '회색 오프듀티 V넥 니트 베스트 실물 짜임 접사', caption: '실물 사진 · 회색' },
      detailLead: '입체 조직과 V넥·밑단의 립 조직을 실물 접사로 표시했습니다.',
      material: '아크릴 72% · 나일론 13% · 울 9% · 알파카 3% · 스판 3%',
      facts: [['품번','RM495'],['제조국','국산(대한민국)'],['제조자','걸스라미'],['제조연월','2026년 10월']],
      measurements: [['총기장','46'],['가슴넓이','55'],['어깨넓이','41'],['목넓이','25'],['앞목깊이','14']],
      care: '세탁 전 케어라벨을 확인해 주세요. 고온 세탁·기계 건조는 피하고 전문 세탁업체와 상담해 주세요.'
    },
    RM429: {
      code: 'RM429', name: '뮤트레이어 V넥 니트 베스트', eyebrow: 'GIRLSRAMI LAYER EDIT', accent: '#70445f', heavy: true,
      intro: '보카시 조직과 깊은 V넥, 총장 54cm의 니트 베스트.',
      description: '보카시 조직, 깊은 V넥, 가슴 단면 52cm, 총장 54cm의 니트 베스트입니다.',
      hero: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-grape-a88c8a4731d9.webp', width: 1122, height: 1402, alt: '그레이프 뮤트레이어 V넥 니트 베스트 AI 코디', caption: 'AI 코디 · 그레이프' },
      colorTitle: '여섯 가지 색상', colorLead: '판매 색상은 그레이프, 모카, 그레이, 브라운, 올리브, 곤색 여섯 가지입니다.',
      colorBoard: { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/colorboard-2c7ba91de2a5.webp', width: 1122, height: 1402, alt: '뮤트레이어 V넥 니트 베스트 여섯 가지 컬러 AI 연출', caption: 'AI 컬러 연출 · 화면과 조명에 따라 실제 색상과 차이가 있을 수 있습니다.' },
      colors: [['그레이프','#70445f'],['모카','#aa9787'],['그레이','#999996'],['브라운','#715448'],['올리브','#59604c'],['곤색','#263545']],
      styling: [
        {
          title: 'AI 코디 1 · 데님과 롱스커트', lead: '그레이프 색상은 데님, 올리브 색상은 롱스커트와 조합한 예시입니다.',
          notice: 'AI 코디 연출컷입니다. 베스트 단품 상품이며 이너·하의·신발·가방은 구성에 포함되지 않습니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/grape-8ae0062b6964.webp', width: 1024, height: 1536, alt: '그레이프 뮤트레이어 V넥 니트 베스트와 데님 AI 코디', meta: 'AI 코디 · 그레이프', title: '그레이프 · 데님', items: '화이트 티셔츠 · 라이트 데님 · 브라운 숄더백 · 화이트 스니커즈' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/olive-d8c8aa7b76df.webp', width: 1024, height: 1536, alt: '올리브 뮤트레이어 V넥 니트 베스트와 롱스커트 AI 코디', meta: 'AI 코디 · 올리브', title: '올리브 · 롱스커트', items: '화이트 셔츠 · 크림 롱스커트 · 플랫 · 브라운 미니백' }
          ]
        },
        {
          title: 'AI 코디 2 · 미니스커트와 와이드 팬츠', lead: '곤색은 미니스커트, 모카 색상은 와이드 팬츠와 조합한 예시입니다.',
          notice: 'AI로 만든 코디 이미지입니다. 상품의 실제 앞·뒤 모습과 조직은 아래 실물 사진에 표시합니다.',
          looks: [
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/navy-c57b5b37e0ae.webp', width: 1024, height: 1536, alt: '곤색 뮤트레이어 V넥 니트 베스트와 미니스커트 AI 코디', meta: 'AI 코디 · 곤색', title: '곤색 · 미니스커트', items: '블루 스트라이프 셔츠 · 차콜 A라인 미니스커트 · 차콜 타이츠 · 블랙 로퍼 · 블랙 숄더백' },
            { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/mocha-49dbc96f1b93.webp', width: 1024, height: 1536, alt: '모카 뮤트레이어 V넥 니트 베스트와 와이드 팬츠 AI 코디', meta: 'AI 코디 · 모카', title: '모카 · 와이드 팬츠', items: '화이트 셔츠 · 크림 와이드 팬츠 · 슬링백 · 미니 토트백' }
          ]
        }
      ],
      detailTitle: '실제 형태와 상품 정보', detailLead: '실물 앞면·뒷면, V넥 립 조직과 암홀 마감 사진입니다.',
      realDetails: [
        { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-011-de97939ebac0.jpg', width: 860, height: 860, alt: '그레이 뮤트레이어 V넥 니트 베스트 실물 앞면', caption: '실물 사진 · 그레이 앞면' },
        { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-015-621ebf9fe44a.jpg', width: 860, height: 860, alt: '그레이 뮤트레이어 V넥 니트 베스트 실물 뒷면', caption: '실물 사진 · 그레이 뒷면' },
        { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-016-71cd795a0c63.jpg', width: 860, height: 860, alt: '그레이 뮤트레이어 V넥 니트 베스트 V넥 립 조직 실물 디테일', caption: '실물 사진 · V넥 립 조직' },
        { src: 'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-017-16baec78ed8b.jpg', width: 860, height: 860, alt: '그레이 뮤트레이어 V넥 니트 베스트 암홀 마감 실물 디테일', caption: '실물 사진 · 암홀 마감' }
      ],
      material: '리싸이클 폴리 34% · 아크릴 29% · 폴리 27% · 울 8% · 스판 2%',
      facts: [['품번','RM429'],['사이즈','ONE SIZE'],['제조자','걸스라미'],['제조국','대한민국'],['두께감','도톰'],['신축성','보통'],['비침','거의 없음']],
      measurements: [['총기장','54'],['가슴 단면','52'],['어깨','42'],['암홀','23'],['목넓이','20'],['앞목깊이','17']],
      measurementNote: ['ONE SIZE · 단면 기준 · 단위 cm','측정 방법에 따라 1~3cm 차이가 있을 수 있습니다.'],
      care: '드라이클리닝을 권장합니다. 표백제와 기계 건조는 피하고, 다림질 전 케어라벨을 확인해 주세요.'
    }
  });
  function qualityEditorialFor(p) {
    const legacyCode = { 'vneck-knit-vest': 'RM429' }[String(p?.id || '').trim()];
    return QUALITY_EDITORIALS[styleCodeFor(p)] || QUALITY_EDITORIALS[legacyCode] || null;
  }
  function qualityImage(image, eager = false) {
    const loading = eager ? 'eager' : 'lazy';
    return `<img src="${esc(image.src)}" width="${image.width}" height="${image.height}" loading="${loading}"${eager ? ' fetchpriority="high"' : ''} decoding="async" alt="${esc(image.alt)}">`;
  }
  function qualityEditorialHtml(p) {
    const detail = qualityEditorialFor(p);
    if (!detail) return '';
    const titleId = `quality-title-${detail.code.toLowerCase()}`;
    const looks = section => section.looks.map(look => `<figure class="quality-look">${qualityImage(look)}<figcaption><p class="quality-look-meta">${esc(look.meta)}</p><h3>${esc(look.title)}</h3><p class="quality-look-items">${esc(look.items)}</p></figcaption></figure>`).join('');
    const actualDetails = detail.realDetails?.length
      ? `<p class="quality-lead">${esc(detail.detailLead)}</p><div class="quality-detail-grid">${detail.realDetails.map(image => `<figure class="quality-detail">${qualityImage(image)}<figcaption>${esc(image.caption)}</figcaption></figure>`).join('')}</div>`
      : `<figure class="quality-detail-image">${qualityImage(detail.realDetail)}<figcaption class="quality-caption">${esc(detail.realDetail.caption)}</figcaption></figure><p class="quality-lead">${esc(detail.detailLead)}</p>`;
    const measurementNote = detail.measurementNote || ['점주 제공 수치이며 측정 단위는 확인 중입니다.'];
    return `<article class="quality-editorial${detail.heavy ? ' quality-editorial-heavy' : ''}" aria-labelledby="${titleId}"${detail.accent ? ` style="--quality-accent:${esc(detail.accent)}"` : ''}>
      <header class="quality-section quality-intro">
        <p class="quality-eyebrow">${esc(detail.eyebrow || 'GIRLSRAMI KNIT EDIT')}</p>
        <h2 class="quality-title" id="${titleId}">${esc(detail.name)}</h2>
        <p class="quality-lead"><strong>${esc(detail.intro)}</strong><br>${esc(detail.description)}</p>
        <figure class="quality-media">${qualityImage(detail.hero, true)}<figcaption class="quality-media-label">${esc(detail.hero.caption)}</figcaption></figure>
      </header>
      <section class="quality-section" aria-labelledby="${titleId}-colors">
        <h2 id="${titleId}-colors">${esc(detail.colorTitle || '컬러 모아보기')}</h2><p class="quality-lead">${esc(detail.colorLead)}</p>
        <figure class="quality-board">${qualityImage(detail.colorBoard)}<figcaption class="quality-caption">${esc(detail.colorBoard.caption)}</figcaption></figure>
        <div class="quality-swatches" aria-label="상품 색상">${detail.colors.map(([name,hex]) => `<span class="quality-swatch"><i style="--quality-swatch:${esc(hex)}"></i>${esc(name)}</span>`).join('')}</div>
      </section>
      ${detail.styling.map((section, index) => `<section class="quality-section" aria-labelledby="${titleId}-styling-${index + 1}"><h2 id="${titleId}-styling-${index + 1}">${esc(section.title)}</h2><p class="quality-lead">${esc(section.lead)}</p><div class="quality-look-grid">${looks(section)}</div><p class="quality-notice">${esc(section.notice)}</p></section>`).join('')}
      <section class="quality-section" aria-labelledby="${titleId}-details">
        <h2 id="${titleId}-details">${esc(detail.detailTitle || '실제 짜임과 상품 정보')}</h2>
        ${actualDetails}
        <div class="quality-material"><strong>소재 · 혼용률 합계 100%</strong>${esc(detail.material)}</div>
        <dl class="quality-facts">${detail.facts.map(([label,value]) => `<div class="quality-fact"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
        <div class="quality-subsection"><h3>상품 실측</h3><p>${measurementNote.map(esc).join('<br>')}</p><div class="quality-measure-grid">${detail.measurements.map(([label,value]) => `<div class="quality-measure"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div></div>
        <div class="quality-subsection"><h3>관리 안내</h3><p>${esc(detail.care)}</p></div>
        <p class="quality-policy-note">배송·교환·반품은 상품 페이지의 안내를 확인해 주세요.</p>
      </section>
      <footer class="quality-section quality-closing">함께 연출한 코디 상품은 판매 구성에 포함되지 않습니다.</footer>
    </article>`;
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
      ['제조자', p.manufacturer],
      ['제조연월', p.manufactureDate]
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
    const factualSummary = [p.fit, p.length, p.colors?.length ? `판매 색상 ${p.colors.join(', ')}` : ''].filter(Boolean).join(' · ');
    return `<section class="source-editorial" aria-labelledby="source-editorial-title"><header class="editorial-heading"><span class="editorial-index">01 / THE PRODUCT EDIT</span><h2 id="source-editorial-title">${esc(p.material || nameFor(p))}</h2>${factualSummary ? `<p>${esc(factualSummary)}</p>` : ''}</header>${gallery}${measureTable}${factsDisclosureFor(p)}</section>`;
  }
  window.GR.catalogPresentation = Object.freeze({ nameFor, styleCodeFor, channelPriceFor, usesStandardEditorial, sourceEditorialFor, qualityEditorialFor, qualityEditorialHtml, factsFor });

  /* ---------- Header / Footer ---------- */
  function setMarkup(element, html) {
    if (!element || element.innerHTML === html) return;
    // Browsers normalize HTML attributes/entities while parsing the static page.
    // Compare parsed nodes too, so hydration does not replace an identical tree.
    if (element.childNodes?.length && document.createElement) {
      const template = document.createElement('template');
      template.innerHTML = html;
      const current = [...element.childNodes], next = [...template.content.childNodes];
      if (current.length === next.length && current.every((node, i) => node.isEqualNode(next[i]))) return;
    }
    element.innerHTML = html;
  }
  function chromeHtml(pageKey = page, year = new Date().getFullYear()) {
    const nav = [['index.html', '홈'], ['shop.html', '판매 상품'], ['story.html', '브랜드 이야기'], ['guide.html', '구매 안내']];
    const activeKey = { home: 'index.html', shop: 'shop.html', story: 'story.html', guide: 'guide.html' }[pageKey];
    const header = `
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
    const footer = `
      <div class="footer"><div class="wrap">
        <div class="cols">
          <div>
            <a class="logo" href="index.html"><span class="mark">GR</span>걸스라미</a>
            <p class="small muted" style="margin-top:14px;max-width:320px">국내에서 직접 기획·생산한 여성 니트. 판매 중인 상품의 소재와 실측 정보를 확인할 수 있습니다.</p>
          </div>
          <div><h5>SHOP</h5><ul><li><a href="shop.html">판매 상품</a></li><li><a href="${GR.STORE_URL}" target="_blank" rel="noopener">네이버 스마트스토어</a></li></ul></div>
          <div><h5>BRAND</h5><ul><li><a href="story.html">브랜드 이야기</a></li><li><a href="story.html#principles">만드는 원칙</a></li><li><a href="guide.html#size">사이즈 가이드</a></li></ul></div>
          <div><h5>HELP</h5><ul><li><a href="guide.html#shipping">배송 · 교환 · 반품</a></li><li><a href="guide.html#faq">자주 묻는 질문</a></li><li><a href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 상담</a></li></ul></div>
        </div>
        <div class="legal">상호 대박이할머니 (브랜드 걸스라미) · 대표 신명숙 · 원산지 국산 · 결제와 주문 관리는 네이버 스마트스토어에서 진행됩니다.<br><a href="privacy.html">개인정보 처리 안내</a> · <a href="terms.html">회원 이용약관</a> · <a href="admin.html">걸스라미 관리</a><br>© ${year} GIRLSRAMI. All rights reserved.</div>
        <div class="disclaimer">상품의 현재 판매 옵션·가격·재고·배송 조건은 연결된 스마트스토어 상품 페이지에서 확인해 주세요.${pageKey === 'product' && window.GR_DETAIL ? '' : ' 모델 착용 이미지는 AI로 제작한 스타일링 참고 이미지입니다. 실제 상품의 색상과 핏은 실물 사진과 상품 정보를 함께 확인해 주세요.'}</div>
      </div></div>
      <div class="toast" id="toast"></div>`;
    return { header, footer };
  }
  function renderChrome() {
    const html = chromeHtml();
    setMarkup($('#site-header'), html.header);
    setMarkup($('#site-footer'), html.footer);
    const mb = $('#menu-btn'); if (mb) mb.addEventListener('click', () => $('#mobile-nav').classList.toggle('open'));
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) { const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
  window.GR.toast = toast;

  /* ---------- Card ---------- */
  function stars(r) { const full = Math.round(r); return '★'.repeat(full) + '☆'.repeat(5 - full); }
  function isNewDesign(p) { return window.GR_DETAIL?.[p.id]?.isNewDesign ?? (p.newRelease === true); }
  function saleBadgesFor(p) { return isNewDesign(p) ? ['NEW'] : []; }
  function swatchColor(color, p) { return p?.colorHex?.[color] || GR.COLORS[color] || GR.COLORS[{ '스카이': '스카이블루', '회색': '그레이' }[color]] || '#ccc'; }
  function reviewStatsFor(p) {
    const snapshot = window.GR_SMARTSTORE_REVIEWS?.[p.id];
    const marketplaceId = storeUrlFor(p).match(/^https:\/\/smartstore\.naver\.com\/girlsrami\/products\/(\d+)\/?$/)?.[1];
    if (marketplaceId && snapshot?.source === 'naver-smartstore' && snapshot.productId === marketplaceId
      && Number.isFinite(snapshot.rating) && snapshot.rating >= 0 && snapshot.rating <= 5
      && Number.isInteger(snapshot.totalCount) && snapshot.totalCount > 0) {
      return { rating: snapshot.rating, reviewCount: snapshot.totalCount };
    }
    return { rating: 0, reviewCount: 0 };
  }
  function card(p) {
    p = { ...p, name: nameFor(p), ...reviewStatsFor(p) };
    const soon = !isSaleProduct(p);
    const detail = window.GR_DETAIL?.[p.id];
    const cardImage = detail?.cardThumbnail || detail?.thumbnail || verifiedRealImageFor(p) || p.catalogImage || p.image + '.jpg';
    const imageLabel = (detail?.cardThumbnail || detail?.thumbnail) ? '스타일링' : '실물 사진';
    const sw = p.colors.slice(0, 6).map(c => `<span class="swatch" title="${esc(c)}" style="background:${swatchColor(c,p)}"></span>`).join('') + (p.colors.length > 6 ? `<span class="more">+${p.colors.length - 6}</span>` : '');
    return `<a class="card reveal in" href="${productHref(p)}">
      <div class="thumb ${soon ? 'soon' : ''}">
        <div class="badges">${saleBadgesFor(p).map(b => `<span class="badge badge-new">${esc(b)}</span>`).join('')}</div>
        <img src="${esc(cardImage)}" alt="${esc(p.name)} ${imageLabel}" loading="lazy" decoding="async">
        ${soon ? `<div class="soon-tag">${p.newRelease ? '판매 예정' : '입고 예정'} <span>${esc(p.eta || '판매 일정 확인 중')}</span></div>` : ''}
      </div>
      <div class="card-body">
        <div class="cat">${esc(p.category)}</div>
        <div class="name">${esc(p.name)}<small>${esc(detail?.lead || p.sub || p.material)}</small></div>
        ${p.pricePending ? '' : priceFor(p)}
        ${p.colors.length ? `<div class="swatches">${sw}</div>` : ''}
        ${p.rating ? `<div class="rating"><span class="star">${stars(p.rating)}</span> ${p.rating} <span class="muted">(${p.reviewCount})</span></div>` : `<div class="rating muted">${soon ? '스마트스토어 입고 후 판매' : ''}</div>`}
      </div></a>`;
  }
  window.GR.card = card;

  /* ---------- Reveal ---------- */
  function reveal() {
    $$('.reveal:not(.in)').forEach(e => e.classList.add('in'));
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
  function homeProducts(products = GR.PRODUCTS, content = GR.CONTENT) {
    const saleProducts = products.filter(isSaleProduct);
    const featured = Array.isArray(content?.home?.featuredIds) ? content.home.featuredIds.map(id=>products.find(p => p.id === id)).filter(isSaleProduct) : saleProducts.slice(0, 4);
    const newProducts = saleProducts.filter(isNewDesign).sort((a, b) => nameFor(a).localeCompare(nameFor(b), 'ko'));
    const best = newProducts.length ? [...newProducts, ...featured.filter(p => !isNewDesign(p))].slice(0, Math.max(4, featured.length)) : featured;
    return best.length ? best : saleProducts.slice(0, 4);
  }
  function homeReviews(products = GR.PRODUCTS) {
    const saleProducts = products.filter(isSaleProduct);
    const rv = saleProducts.flatMap(p => p.reviews.filter(r => r.stars >= 4).map(r => ({ ...r, product: nameFor(p) }))).slice(0, 3);
    return rv.map(r => `<div class="review reveal in"><div class="star">${'★'.repeat(r.stars)}</div><p>"${esc(r.text)}"</p><div class="who">${esc(r.who)} · ${esc(r.product)}${r.body ? ' · ' + esc(r.body) : ''}</div>${r.reply ? `<div class="reply"><b>걸스라미 답글</b>${esc(r.reply)}</div>` : ''}</div>`).join('');
  }
  function renderHome() {
    setMarkup($('#best-grid'), homeProducts().map(card).join(''));
    setMarkup($('#home-reviews'), homeReviews());
  }

  /* ---------- SHOP ---------- */
  function shopProducts(products = GR.PRODUCTS, state = {}) {
    const {cat = '전체', size = 'all', sort = 'popular'} = state;
    const list = products.filter(p => isSaleProduct(p) && (cat === '전체' || p.category === cat) && (size === 'all' || p.sizes.some(s => s.startsWith(size))));
    const sorters = { popular: (a, b) => (reviewStatsFor(b).reviewCount - reviewStatsFor(a).reviewCount) || nameFor(a).localeCompare(nameFor(b), 'ko'), new: (a, b) => (b.releasedAt || '').localeCompare(a.releasedAt || '') || nameFor(a).localeCompare(nameFor(b), 'ko'), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, sale: (a, b) => GR.discount(b) - GR.discount(a) };
    return list.sort(sorters[sort] || sorters.popular);
  }
  function categoryChips(products = GR.PRODUCTS, selected = '전체') {
    const categories = ['전체', ...new Set(products.filter(isSaleProduct).map(p => p.category).filter(Boolean))];
    return categories.map(c => `<button class="chip ${selected === c ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  }
  window.GR.pageMarkup = Object.freeze({ chrome: chromeHtml, homeProducts, homeReviews, shopProducts, categoryChips });
  function renderShop() {
    const params = new URLSearchParams(location.search);
    const sizeSelect = $('#size-select'), sortSelect = $('#sort-select');
    const optionValue = (select, value, fallback) => [...select.options].some(option => option.value === value) ? value : fallback;
    const state = { cat: params.get('cat') || '전체', size: optionValue(sizeSelect, params.get('size'), 'all'), sort: optionValue(sortSelect, params.get('sort'), 'popular') };
    sizeSelect.value = state.size;
    sortSelect.value = state.sort;
    const cats = $('#cat-chips'), grid = $('#shop-grid'), count = $('#shop-count'), title = $('#shop-title'), sub = $('#shop-sub');
    setMarkup(cats, categoryChips(GR.PRODUCTS, state.cat));
    function rememberFilters() {
      const url = new URL(location.href);
      for (const [key, fallback] of [['cat', '전체'], ['size', 'all'], ['sort', 'popular']]) {
        if (state[key] === fallback) url.searchParams.delete(key);
        else url.searchParams.set(key, state[key]);
      }
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
    function draw() {
      const list = shopProducts(GR.PRODUCTS, state);
      setMarkup(grid, list.length ? list.map(card).join('') : `<p class="muted" style="grid-column:1/-1;padding:40px 0">조건에 맞는 상품이 없습니다.</p>`);
      count.textContent = `${list.length}개 상품`;
      title.textContent = state.cat === '전체' ? '현재 판매 중인 상품' : state.cat;
      sub.textContent = '스마트스토어에서 구매할 수 있는 여성 니트·조끼·가디건입니다. 상품별 소재와 실측 정보를 확인해 보세요.';
      $$('#cat-chips .chip').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));
      reveal();
    }
    cats.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; state.cat = b.dataset.cat; rememberFilters(); draw(); });
    sizeSelect.addEventListener('change', e => { state.size = e.target.value; rememberFilters(); draw(); });
    sortSelect.addEventListener('change', e => { state.sort = e.target.value; rememberFilters(); draw(); });
    draw();
  }

  /* ---------- PRODUCT ---------- */
  function renderProduct() {
    const id = document.body.dataset.productId || new URLSearchParams(location.search).get('id');
    const sourceProduct = GR.byId(id);
    if (!sourceProduct || !isSaleProduct(sourceProduct)) {
      noindexProductShell();
      document.title = '판매 상품을 확인해 주세요 | 걸스라미';
      $('#pd').innerHTML='<div class="notice-box">현재 판매 중인 상품이 아닙니다. <a href="shop.html">판매 상품 보기</a></div>';
      for (const selector of ['#pd-desc', '#pd-reviews', '#pd-notice']) {
        const section = $(selector);
        if (section) { section.innerHTML = ''; section.hidden = true; }
      }
      $('.pd-tabs')?.remove(); $('.grsd-section-nav')?.remove(); $('.related')?.remove();
      return;
    }
    const p = { ...sourceProduct, name: nameFor(sourceProduct) };
    setProductMetadata(p);
    if (window.GRStandardDetail?.render(p, { card, isSaleProduct, productHref, offerPriceFor })) return;
    const soon = !isSaleProduct(p);
    const detailImages = Array.isArray(p.detailImages) ? p.detailImages : [];
    const ai = window.GR_AI?.presentation(p);
    const editorial = ai && GR_AI.editorialFor(p);
    const qualityEditorial = qualityEditorialFor(p);
    const standardEditorial = !editorial && usesStandardEditorial(p);
    const editorialLayout = Boolean(editorial || standardEditorial || qualityEditorial);
    let color = startingColorFor(p, ai ? GR_AI.colorFor(p) : null), size = p.sizePending ? null : p.sizes[0];
    const root = $('#pd');
    root.classList.toggle('pd-editorial', editorialLayout);
    root.classList.toggle('pd-source-editorial', Boolean(standardEditorial));
    root.innerHTML = `
      <div class="pd-media${ai ? ' pd-media-ai' : p.newRelease ? ' pd-media-catalog' : ''}">
        ${ai ? GR_AI.gallery(p, color) : `
        <img src="${esc(p.catalogImage || p.image+'.jpg')}" alt="${esc(p.name)}" id="pd-img">
        ${p.photoSampleOnly ? '<p class="small muted" style="margin-top:10px">사진은 촬영 샘플 색상 기준입니다. 구매할 색상은 옵션명으로 선택해 주세요.</p>' : ''}
        ${detailImages.length ? '' : `<div class="thumbs"><div>정면 착용</div><div>원단 클로즈업<br><small>(촬영 예정)</small></div><div>키 155 / 160 / 167<br>착용 비교<small> (촬영 예정)</small></div><div>15초 숏클립<br><small>(촬영 예정)</small></div></div>`}
        `}
      </div>
      <div class="pd-info">
        <div class="crumb"><a href="index.html">홈</a> › <a href="shop.html">전체 상품</a> › <a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a></div>
        <div class="badges" style="position:static;flex-direction:row;margin-bottom:12px">${saleBadgesFor(p).map(b => `<span class="badge accent">${esc(b)}</span>`).join('')}</div>
        <h1 class="name">${esc(p.name)}</h1>
        <div class="sub">${esc(p.material || p.category)}</div>
        ${p.rating ? `<div class="rating" style="margin-top:10px"><span class="star">${stars(p.rating)}</span> <b>${p.rating}</b> <a class="muted" href="#reviews">리뷰 ${p.reviewCount}건</a></div>` : ''}
        ${p.pricePending ? '' : priceFor(p, true)}
        <div class="pd-ship"><span>배송 일정·배송비·교환 조건은 스마트스토어의 현재 상품 안내를 확인해 주세요.</span><span>${ai ? 'AI 코디 연출 · 실제 상품의 색상과 형태는 상세 실물 사진을 참고해 주세요.' : p.photoVerified ? '실제 상품 사진' : '촬영 콘셉트 시안 이미지 · 실제 상품과 다를 수 있어요.'}</span></div>
        ${soon ? `<div class="stock-note">${p.newRelease ? '판매 예정' : '입고 예정'} · ${esc(p.eta || '판매 일정 확인 중')} · 현재 구매 가능 수량 0 · 판매 일정은 스마트스토어에서 확인해 주세요.</div>` : `<div class="stock-note ok">✓ 스마트스토어에서 바로 구매할 수 있습니다. 옵션 선택과 결제는 네이버페이로 진행됩니다.</div>`}
        ${p.colors.length ? `<div class="opt"><div class="opt-label">색상 <span id="color-name">${esc(color || '선택해 주세요')}</span></div><div class="color-opts" id="color-opts">${p.colors.map(c => `<button class="color-opt ${c === color ? 'active' : ''}" data-c="${esc(c)}">${p.photoSampleOnly ? '' : `<span class="swatch" style="background:${swatchColor(c,p)}"></span>`}${esc(c)}</button>`).join('')}</div></div>` : `<div class="opt"><div class="opt-label">색상 <span>스마트스토어 옵션에서 선택</span></div></div>`}
        <div class="opt"><div class="opt-label">사이즈 <a href="guide.html#size" class="muted">사이즈 가이드</a></div><div class="size-opts" id="size-opts">${(p.sizePending ? [] : p.sizes).map(s => `<button class="size-opt ${s === size ? 'active' : ''}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>
        <div class="pd-cta">
          ${soon
            ? `<a class="btn btn-light btn-block" href="${GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어에서 판매 일정 확인</a><button class="btn btn-lg btn-block is-disabled" disabled>${p.newRelease ? '판매 예정' : '품절 · 입고 예정'} (구매 가능 수량 0)</button>`
            : `<a class="btn btn-accent btn-lg btn-block" href="${p.smartstore}" target="_blank" rel="noopener">스마트스토어에서 구매하기 →</a><div class="row"><button class="btn btn-ghost" id="add-cart"${!p.colors.length || p.sizePending || !p.sizes.length ? ' disabled' : ''}>장바구니에 담기</button><a class="btn btn-ghost" href="${GR.TALK_URL}" target="_blank" rel="noopener">톡톡 문의</a><button class="btn btn-ghost" id="share-btn">링크 공유</button></div><p id="product-cart-status" role="status"></p>`}
        </div>
        <div class="gift"><b>혜택 확인</b>현재 쿠폰·사은품 조건은 스마트스토어의 상품 안내와 결제 화면에서 확인해 주세요.</div>
        ${editorialLayout ? '' : factsFor(p)}
      </div>`;
    let editorialControl;
    function selectColor(next) { color=next; $$('#color-opts .color-opt').forEach(x=>{x.classList.toggle('active',x.dataset.c===color);x.setAttribute('aria-pressed',String(x.dataset.c===color));}); $('#color-name').textContent=color; if(ai && GR_AI.mediaFor(p,color)) $('.pd-media').innerHTML=GR_AI.gallery(p,color); editorialControl?.setColor(color); }
    $('#color-opts')?.addEventListener('click', e => { const b=e.target.closest('.color-opt');if(b)selectColor(b.dataset.c); });
    $('#size-opts').addEventListener('click', e => { const b = e.target.closest('.size-opt'); if (!b) return; size = b.dataset.s; $$('#size-opts .size-opt').forEach(x => x.classList.toggle('active', x === b)); });
    $('#share-btn')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); toast('링크를 복사했습니다'); } catch { toast(location.href); } });

    if(editorial) { root.insertAdjacentHTML('afterend',GR_AI.editorial(p,color)); editorialControl=GR_AI.bindEditorial(p,selectColor); }
    else if(ai) { root.insertAdjacentHTML('afterend', GR_AI.room(p)); GR_AI.bindRoom(p); }

    /* lower tabs */
    $('#pd-desc').classList.toggle('pd-detail-gallery', !editorialLayout && detailImages.length > 0);
    $('#pd-desc').classList.toggle('pd-editorial-detail', editorialLayout);
    $('#pd-desc').innerHTML = qualityEditorial ? qualityEditorialHtml(p) : editorial ? GR_AI.proof(p) + factsDisclosureFor(p) : standardEditorial ? sourceEditorialFor(p) : detailImages.length
      ? detailImages.map((image, i) => `<img src="${esc(typeof image === 'string' ? image : image.url)}" alt="${esc(image.alt || `${p.name} 상세 안내 ${i + 1}`)}"${Number.isFinite(image.width) && Number.isFinite(image.height) && image.width > 0 && image.height > 0 ? ` width="${image.width}" height="${image.height}"` : ''} loading="lazy" decoding="async">`).join('')
      : `
      <h4>이 옷을 만든 이유</h4><p>${esc(p.desc)}</p>
      <h4>실측 사이즈 (cm, 단면 기준)</h4>
      <div class="table-scroll"><table class="size-table"><thead><tr><th>사이즈</th><th>가슴 단면</th><th>총장</th><th>확인 상태</th></tr></thead><tbody>${(p.catalogSizes||[]).map(s => `<tr><td>${esc(s.label)}</td><td>${s.verified?s.chestHalf:'확인 중'}</td><td>${s.verified?s.length:'확인 중'}</td><td>${s.verified?'실측 확인':'미확인 · 추천 제외'}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">확인된 실측만 표시합니다. 측정 방법에 따라 1~3cm 차이가 있을 수 있어요. 색상은 화면과 조명에 따라 달라질 수 있어요.</p>
      <h4>착용 참고</h4><p>사진과 아바타는 코디 참고용이에요. 확인된 실제 상품 사진과 실측이 등록되면 상세페이지에 표시합니다.</p>`;
    if(editorialLayout) $('.pd-info .gift')?.remove();
    if(ai && !editorial && !detailImages.length) $('#pd-desc').insertAdjacentHTML('beforeend', GR_AI.care(p));
    $('#pd-reviews').innerHTML = p.reviews.length
      ? `<div class="reviews">${p.reviews.map(r => `<div class="review"><div class="star">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div><p>"${esc(r.text)}"</p><div class="who">${esc(r.who)}${r.body ? ' · ' + esc(r.body) : ''} · 스마트스토어 구매 리뷰</div>${r.reply ? `<div class="reply"><b>걸스라미 답글</b>${esc(r.reply)}</div>` : ''}</div>`).join('')}</div><p class="small muted" style="margin-top:16px">전체 리뷰 ${p.reviewCount}건은 <a href="${p.smartstore || GR.STORE_URL}" target="_blank" rel="noopener" style="text-decoration:underline">스마트스토어 상품 페이지</a>에서 볼 수 있습니다.</p>`
      : ai ? `<div class="notice-box">${soon ? '출시 후 스마트스토어에서 실제 구매 후기를 확인해 주세요.' : '아직 등록된 리뷰 인용이 없습니다.'} <a href="${esc(p.smartstore || GR.STORE_URL)}" target="_blank" rel="noopener">스마트스토어 리뷰 확인</a></div>`
      : `<div class="notice-box">${soon ? '입고 전 상품입니다. 판매 시작 후 스마트스토어에서 실제 구매 후기를 확인해 주세요.' : '아직 등록된 리뷰 인용이 없습니다. 스마트스토어 리뷰를 확인해 주세요.'}</div>`;
    $('#pd-notice').innerHTML = `<div class="notice-box"><b>배송 · 교환 · 반품</b><p style="margin-top:10px">배송비, 출고 예정일과 교환·반품 조건은 주문하는 스마트스토어 상품 페이지의 현재 안내를 확인해 주세요. 주문 후 문의는 네이버 주문 내역과 톡톡으로 접수할 수 있어요.</p><a href="${p.smartstore || GR.STORE_URL}" target="_blank" rel="noopener">스마트스토어 상품 안내 확인</a></div>`;
    $$('.pd-tabs button').forEach(b => b.addEventListener('click', () => { $$('.pd-tabs button').forEach(x => x.classList.toggle('active', x === b)); $$('.pd-panel').forEach(pn => pn.hidden = pn.id !== b.dataset.tab); }));
    const rel = GR.PRODUCTS.filter(x => isSaleProduct(x) && x.id !== p.id && x.category === p.category).slice(0, 4);
    $('#related-grid').innerHTML = rel.map(card).join('');
    bindNotify();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    renderChrome();
    bindNotify();
    reveal();
    await window.GR.bootPromise;
    if (GR.bootError) {
      const target = $('#pd') || $('#shop-grid') || $('#best-grid');
      if (target && !target.innerHTML.trim()) target.textContent = '상품 데이터를 불러오지 못했어요. 잠시 후 다시 방문해 주세요.';
      const cart = $('#add-cart'), status = $('#product-cart-status');
      if (cart) cart.disabled = true;
      if (status) status.textContent = '장바구니 연결을 확인하지 못했어요. 구매는 스마트스토어에서 진행해 주세요.';
      return;
    }
    if (page === 'home') renderHome();
    if (page === 'shop') renderShop();
    if (page === 'product') renderProduct();
    reveal();
  });
})();
