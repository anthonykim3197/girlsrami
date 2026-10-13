/* 걸스라미 상담 룰 엔진 (브라우저 + Node 공용)
   - 구매안내 정책과 data.js 상품 정보를 바탕으로 자주 묻는 질문에 즉답
   - 매칭이 약하면 null 을 반환 → 위젯이 AI 상담(서버)으로 넘김
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GR = root.GR || {}, root.GR.rules = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const POLICY = {
    shipTime: '상품별 출고 예정일과 현재 배송 상태는 스마트스토어 상품 안내와 네이버 주문 내역에서 확인해 주세요.',
    shipFee: '배송비와 지역별 추가 비용은 상품과 배송지에 따라 달라질 수 있어요. 주문 전 스마트스토어 결제 화면에서 확인해 주세요.',
    exchange: '교환·반품 신청 기간, 반송 방법과 비용은 주문한 스마트스토어 상품의 현재 안내를 확인해 주세요. 신청은 네이버 주문 내역이나 톡톡에서 할 수 있어요.',
    size: '상품마다 상세 페이지에 확인된 실측을 표시해요. 갖고 있는 편한 옷을 펼쳐 가슴 단면과 총장을 재서 비교해 주세요.',
    gift: '진행 중인 사은품과 대상 상품, 수량 조건은 스마트스토어의 현재 상품 안내에서 확인해 주세요.',
    benefit: '사용 가능한 쿠폰과 리뷰 적립 등 현재 혜택은 스마트스토어 상품 페이지와 결제 화면에서 확인해 주세요.',
    restock: '현재 구매할 수 있는 상품은 판매 상품 목록에서 확인할 수 있어요. 재입고 문의는 스마트스토어 톡톡으로 상품명을 남겨 주세요.',
    care: '소재에 따라 관리 방법이 달라요. 상품 상세의 소재·관리 안내와 상품에 부착된 케어 라벨을 먼저 확인해 주세요.',
    color: '화면과 조명에 따라 색상이 다르게 보일 수 있어요. AI 코디와 실물 사진은 별도로 표시하며, 교환·반품 조건은 스마트스토어 상품 안내를 확인해 주세요.',
    hours: '상품·주문 상담은 네이버 스마트스토어 톡톡으로 남겨 주세요. 이 자동상담에서는 판매 상품 정보와 구매 안내를 확인할 수 있어요.',
    payment: '결제는 네이버 스마트스토어에서 네이버페이로 진행돼요. 네이버페이 결제와 구매안전서비스를 그대로 쓰기 위해서예요. 이 사이트는 상품 정보, 사이즈, 공장 이야기를 자세히 보여드리는 곳이고, 상품 페이지의 구매하기 버튼을 누르면 스마트스토어로 이어져요.',
    order: '주문 조회와 배송 조회는 네이버 스마트스토어 주문내역에서 확인하실 수 있어요. 이 자동상담에서는 개별 주문 정보를 조회할 수 없어서, 주문번호가 필요한 문의는 톡톡으로 남겨주시면 영업시간에 확인해 드릴게요.',
    crop: '상품 상세의 총장 실측을 갖고 있는 편한 옷과 비교해 주세요. 판매 상품 목록에서 니트와 조끼, 가디건의 기장을 확인할 수 있어요.',
    pilling: '니트의 촉감과 보풀 정도는 소재와 사용 환경에 따라 달라질 수 있어요. 상품별 소재와 관리 안내, 케어 라벨을 확인해 주세요.',
    factory: '걸스라미는 여성 니트를 직접 기획하고 국내에서 생산합니다. 상품별 소재, 실측과 제조 정보를 상세 페이지에서 확인할 수 있어요.',
    greeting: '안녕하세요, 걸스라미 상담입니다. 배송, 교환·반품, 사이즈, 사은품, 입고 일정 등 궁금한 점을 편하게 물어보세요.',
    thanks: '도움이 되었다니 다행이에요. 또 궁금한 점이 있으면 언제든 물어보세요.',
  };

  /* 의도별 키워드 (가중치) */
  const INTENTS = [
    { id: 'greeting', kw: [['안녕', 2], ['하이', 1], ['헬로', 1], ['처음', 1], ['시작', 1]], answer: 'greeting', exclusive: true },
    { id: 'thanks', kw: [['감사', 2], ['고마', 2], ['땡큐', 2], ['좋아요', 1], ['알겠', 1], ['넵', 1]], answer: 'thanks', exclusive: true },
    { id: 'order', kw: [['주문번호', 3], ['주문조회', 3], ['배송조회', 3], ['송장', 3], ['운송장', 3], ['어디쯤', 3], ['언제 와', 1], ['아직 안', 2], ['안 왔', 3], ['안왔', 3], ['출발했', 2], ['내 주문', 3], ['제 주문', 3], ['취소', 2]], answer: 'order' },
    { id: 'shipFee', kw: [['배송비', 3], ['배송료', 3], ['택배비', 3], ['제주', 3], ['도서', 2], ['무료배송', 3], ['무료 배송', 3]], answer: 'shipFee' },
    { id: 'shipTime', kw: [['배송', 2], ['출고', 3], ['도착', 2], ['며칠', 2], ['몇일', 2], ['언제 받', 3], ['언제 도착', 3], ['언제 와', 2], ['언제와', 2], ['오늘출발', 3], ['당일', 2], ['택배', 2], ['빨리', 1], ['걸리', 1]], answer: 'shipTime' },
    { id: 'exchange', kw: [['교환', 3], ['반품', 3], ['환불', 3], ['취소', 1], ['불량', 2], ['하자', 2], ['오배송', 3], ['잘못 왔', 3], ['다른 게 왔', 3]], answer: 'exchange' },
    { id: 'gift', kw: [['사은품', 3], ['나시', 3], ['슬리브리스', 3], ['이너', 2], ['증정', 3], ['서비스', 1], ['2장', 2], ['두 장', 2], ['두장', 2]], answer: 'gift' },
    { id: 'benefit', kw: [['쿠폰', 3], ['할인', 2], ['적립', 3], ['포인트', 2], ['리뷰', 2], ['이벤트', 2], ['혜택', 3], ['알림받기', 3], ['재구매', 2], ['세일', 2]], answer: 'benefit' },
    { id: 'restock', kw: [['입고', 3], ['재입고', 3], ['예정', 2], ['언제 살', 3], ['언제 사', 2], ['언제 나', 2], ['출시', 3], ['프리미엄', 2], ['품절', 3], ['재고', 2], ['수량 0', 3], ['구매 가능', 1], ['살 수 있', 2], ['살수있', 2]], answer: 'restock' },
    { id: 'crop', kw: [['크롭', 3], ['짧', 2], ['기장', 2], ['긴 기장', 3], ['롱', 1], ['레귤러', 2], ['허리', 1]], answer: 'crop' },
    { id: 'size', kw: [['사이즈', 3], ['치수', 3], ['실측', 3], ['가슴', 2], ['어깨', 2], ['암홀', 2], ['소매', 1], ['총장', 2], ['맞을까', 3], ['맞나', 2], ['맞을', 2], ['크게 나', 2], ['작게 나', 2], ['프리', 2], ['free', 2], ['66', 1], ['77', 2], ['55', 1], ['kg', 2], ['cm', 2], ['키가', 2], ['몸무게', 2], ['통통', 2], ['마른', 1], ['핏', 1], ['오버핏', 2], ['루즈', 1]], answer: 'size' },
    { id: 'pilling', kw: [['보풀', 3], ['까슬', 3], ['따가', 3], ['가려', 2], ['잡사', 3], ['실뭉침', 3], ['실밥', 2], ['거칠', 2], ['촉감', 1]], answer: 'pilling' },
    { id: 'care', kw: [['세탁', 3], ['빨래', 3], ['드라이', 3], ['손세탁', 3], ['세탁기', 3], ['건조', 2], ['다림', 2], ['줄어', 2], ['늘어나', 1], ['관리', 2], ['보관', 2]], answer: 'care' },
    { id: 'color', kw: [['색상', 2], ['색이', 2], ['컬러', 2], ['사진과', 3], ['사진이랑', 3], ['실물', 3], ['달라', 1], ['다르', 1], ['비침', 2], ['비쳐', 2], ['비치', 2]], answer: 'color' },
    { id: 'hours', kw: [['상담', 2], ['시간', 1], ['전화', 3], ['연락', 2], ['톡톡', 2], ['문의', 1], ['사람', 2], ['직원', 3], ['담당자', 3], ['영업시간', 3], ['몇 시', 2], ['몇시', 2], ['주말', 2], ['공휴일', 2]], answer: 'hours' },
    { id: 'payment', kw: [['결제', 3], ['네이버페이', 3], ['카드', 2], ['스마트스토어', 2], ['왜 네이버', 3], ['무통장', 3], ['계좌', 2], ['현금', 2], ['영수증', 2], ['현금영수증', 3], ['어디서 사', 3], ['어디서 구매', 3], ['구매 방법', 3], ['구매하기', 2]], answer: 'payment' },
    { id: 'factory', kw: [['공장', 3], ['어디서 만', 3], ['제조', 2], ['원산지', 3], ['생산', 2], ['도매', 3], ['브랜드', 1], ['국내', 2], ['made', 2]], answer: 'factory' },
  ];

  /* 상품 검색용 별칭 */
  const PRODUCT_ALIASES = {
    'boucle-crop-cardigan': ['부클 가디건', '부클가디건', '크롭 가디건', '크롭가디건', '부클 크롭', '살안타'],
    'cable-vneck-knit': ['꽈배기', '케이블 브이넥', '브이넥 니트', '9컬러', '브이넥 꽈배기'],
    'vneck-knit-vest': ['조끼', '베스트', '니트 조끼'],
    'alpaca-round-knit': ['알파카 라운드', '알파카 니트', '루즈 라운드', '몽실'],
    'stripe-cable-half': ['단가라', '스트라이프', '줄무늬', '단가라 반팔'],
    'popcorn-vneck-half': ['팝콘', '슬라브', '반팔 브이넥', '팝콘 반팔'],
    'recycled-round-sweater': ['무지', '박시 라운드', '리싸이클 라운드', '무지 니트'],
    'fisherman-crop-bustier': ['피셔맨 뷔스티에', '크롭 뷔스티에', '니트 뷔스티에'],
    'boucle-round-half-cardigan': ['부클 반팔 가디건', '반팔 크롭 가디건'],
    'boucle-fisher-vneck-vest': ['부클 피셔 베스트', '부클 브이넥 베스트'],
    'honey-loop-crop-knit': ['허니루프', '벌집 니트', '라운드 니트'],
    'off-duty-vneck-knit-vest': ['오프듀티', '오프듀티 베스트', '브이넥 니트 베스트'],
  };

  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const won = n => Number(n).toLocaleString('ko-KR') + '원';
  /* 받침 여부에 따른 조사 (은/는, 이/가) */
  const josa = (w, a, b) => { const c = String(w).replace(/[^가-힣]+$/, '').slice(-1); const code = c.charCodeAt(0); if (!(code >= 0xac00 && code <= 0xd7a3)) return w + b; return w + (((code - 0xac00) % 28) ? a : b); };

  function findProducts(msg, products) {
    if (!products) return [];
    const m = norm(msg);
    const hits = [];
    for (const p of products.filter(p => p.status === 'active' && /^https:\/\/smartstore\.naver\.com\/girlsrami\/products\/\d+\/?$/.test(String(p.storeUrl || p.smartstore || '')))) {
      const names = [p.name, ...(PRODUCT_ALIASES[p.id] || [])];
      let len = 0;
      for (const n of names) { const k = norm(n); if (k && m.includes(k) && k.length > len) len = k.length; }
      if (len) hits.push({ p, len });
    }
    return hits.sort((a, b) => b.len - a.len).map(h => h.p);
  }
  function findProduct(msg, products) { return findProducts(msg, products)[0] || null; }

  /* 비교·추천·상황 설명형 질문은 AI가 더 잘 답함 */
  const NEEDS_AI = /(중에|보다|비교|차이|vs|어떤 ?게|어떤 ?것|뭐가 나|뭐가 더|추천|골라|어울릴|코디|매칭|선물|어머니|엄마|남자|남친|남편|따뜻|더울|추울|계절|언제까지 입|사무실|학교|여행)/;

  function productAnswer(p, intent) {
    const colors = p.colors && p.colors.length ? p.colors.join(', ') : '상세 페이지 참고';
    const sizes = (p.sizes || []).join(' / ');
    const link = `product-${p.id}.html`;
    const base = `${josa(p.name, '은', '는')} ${won(p.price)}${p.listPrice ? ` (정가 ${won(p.listPrice)})` : ''}이고, 소재는 ${p.material}, 사이즈는 ${sizes}예요.`;
    if (intent === 'size') {
      const ms = p.measure ? Object.entries(p.measure).map(([k, v]) => `${k} ${v}cm`).join(', ') : '';
      return { text: `${p.name} 실측은 ${ms}예요. 핏은 ${p.fit}, ${p.length}이고 신축성은 '${p.stretch}'예요. 갖고 계신 옷의 가슴 단면과 비교해 보시면 가장 정확해요.`, link, linkText: '상품 실측 표 보기' };
    }
    if (intent === 'care' || intent === 'pilling') {
      return { text: `${p.name}의 세탁 안내는 '${p.care}'예요. 두께는 ${p.thickness}, 비침은 ${p.sheer}이에요.`, link, linkText: '상품 상세 보기' };
    }
    if (intent === 'color') {
      return { text: `${p.name}의 판매 색상은 ${colors}예요. AI 코디와 실물 사진은 상품 상세에서 구분해 표시하고 있어요.`, link, linkText: '컬러 보기' };
    }
    return { text: `${base} 판매 색상은 ${colors}이고, 현재 옵션과 배송 조건은 연결된 스마트스토어 상품 페이지에서 확인할 수 있어요.`, link, linkText: '상품 보기' };
  }

  /**
   * match(message, products) → { intent, text, link?, linkText?, score } | null
   */
  function match(message, products) {
    const m = norm(message);
    if (!m) return null;
    const scores = [];
    for (const it of INTENTS) {
      let s = 0;
      for (const [k, w] of it.kw) if (m.includes(norm(k))) s += w;
      if (s > 0) scores.push({ it, s });
    }
    scores.sort((a, b) => b.s - a.s);
    const top = scores[0];
    const productsHit = findProducts(m, products);
    const product = productsHit[0] || null;

    // 상품 2개 이상 비교하거나, 추천·상황 설명이 있으면 AI로 (정책성 키워드가 강하면 예외)
    const strongPolicy = top && !top.it.exclusive && top.s >= 5 && ['shipTime', 'shipFee', 'exchange', 'gift', 'benefit', 'care', 'hours', 'payment', 'order'].includes(top.it.id);
    if ((productsHit.length >= 2 || NEEDS_AI.test(m)) && !strongPolicy) return null;

    // 인사/감사는 짧은 메시지일 때만 단독 처리
    if (top && top.it.exclusive) {
      if (m.length <= 12 && !product) return { intent: top.it.id, text: POLICY[top.it.answer], score: top.s };
      scores.shift();
    }
    const best = scores[0];

    // 상품이 언급되면 상품 카드형 답변 우선
    if (product) {
      const pi = best && best.s >= 2 ? best.it.id : 'product';
      const a = productAnswer(product, pi);
      return { intent: 'product:' + pi, text: a.text, link: a.link, linkText: a.linkText, score: (best ? best.s : 0) + 3 };
    }
    // 가격/얼마 만 물어본 경우
    if (/(얼마|가격|금액|몇 ?원|price)/.test(m) && !best) {
      const sale = (products || []).filter(p => p.status === 'active' && /^https:\/\/smartstore\.naver\.com\/girlsrami\/products\/\d+\/?$/.test(String(p.storeUrl || p.smartstore || '')) && Number.isFinite(Number(p.price)));
      const prices = sale.map(p => Number(p.price));
      const range = prices.length ? `${won(Math.min(...prices))}${Math.min(...prices) === Math.max(...prices) ? '' : `~${won(Math.max(...prices))}`}` : '상품별 판매가';
      return { intent: 'price', text: `현재 판매 상품 가격은 ${range}예요. 최종 가격과 적용 가능한 혜택은 스마트스토어 상품 페이지에서 확인해 주세요.`, link: 'shop.html', linkText: '판매 상품 보기', score: 2 };
    }
    if (!best) return null;
    // 점수가 낮으면 AI에게 넘김 (단, 명확한 키워드 3점 이상이면 즉답)
    if (best.s < 3) return null;
    // 상위 두 의도가 동점이면 애매 → AI
    if (scores[1] && scores[1].s === best.s && !['shipTime', 'shipFee'].includes(best.it.id)) return null;
    return { intent: best.it.id, text: POLICY[best.it.answer], score: best.s };
  }

  /* 서버 시스템 프롬프트용 정책 요약 */
  function policySummary() {
    return Object.entries(POLICY).filter(([k]) => !['greeting', 'thanks'].includes(k)).map(([k, v]) => `- ${k}: ${v}`).join('\n');
  }

  const QUICK = [
    { label: '배송 언제 와요?', msg: '배송은 언제 오나요?' },
    { label: '교환·반품 방법', msg: '교환 반품은 어떻게 하나요?' },
    { label: '사이즈 문의', msg: '사이즈 어떻게 고르면 되나요?' },
    { label: '사은품 조건', msg: '사은품은 어떻게 받나요?' },
    { label: '판매 상품 보기', msg: '지금 구매할 수 있는 상품을 알려주세요.' },
  ];

  return { match, findProduct, productAnswer, policySummary, POLICY, QUICK, version: '1.0' };
});

