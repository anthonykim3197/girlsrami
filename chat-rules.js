/* 걸스라미 상담 룰 엔진 (브라우저 + Node 공용)
   - 구매안내 정책과 data.js 상품 정보를 바탕으로 자주 묻는 질문에 즉답
   - 매칭이 약하면 null 을 반환 → 위젯이 AI 상담(서버)으로 넘김
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GR = root.GR || {}, root.GR.rules = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const POLICY = {
    shipTime: '평일 오후 2시 이전 결제 건은 당일 출고되고, 출고 후 평균 1~2일이면 받아보실 수 있어요. 성수기(10~12월)에도 오늘출발 기준을 지키는 것을 목표로 하고, 예외적으로 지연되면 결제 당일 톡톡으로 먼저 안내드려요.',
    shipFee: '배송비는 무료예요. 제주는 3,000원, 도서 지역은 5,000원이 추가돼요. 교환 시 3,000원, 단순 변심 반품 시 5,000원의 배송비가 있어요.',
    exchange: '수령 후 7일 이내에 교환·반품 신청이 가능해요. 단순 변심은 교환 3,000원, 반품 5,000원의 배송비가 있고, 상품 하자·오배송·사진과 다른 색상은 왕복 배송비 없이 처리해 드려요. 착용 흔적, 세탁, 택 제거 후에는 교환·반품이 어려운 점 양해 부탁드려요. 신청은 스마트스토어 주문내역 또는 톡톡으로 해주세요.',
    size: '베이직 라인은 FREE(55~66, 155~167cm) 한 사이즈예요. F/W 프리미엄 라인은 FREE(55~66)와 L(66~77, 158~170cm) 두 사이즈로 나와요. 상품마다 상세 페이지에 실측 표가 있으니, 갖고 계신 옷을 펼쳐 가슴 단면을 재서 비교하시는 게 가장 정확해요. 키와 평소 사이즈를 알려주시면 더 자세히 안내드릴게요.',
    gift: '같은 주문에서 니트 2장 이상 구매하시면 슬리브리스 이너 1개를 드려요. 랜덤이 아니라 고르는 사은품이라 주문서 요청사항에 원하는 컬러(아이보리·블랙·베이지)를 적어주세요. 미기재 시 아이보리로 보내드려요. 교환·반품 시에는 사은품도 함께 반송 부탁드려요.',
    benefit: '스마트스토어 알림받기를 누르시면 2,000원 쿠폰이 바로 발급되고 첫 구매부터 쓸 수 있어요. 포토 리뷰 500원, 한 달 사용 리뷰 500원이 추가 적립되고, 두 번째 주문부터는 재구매 쿠폰이 자동 적용돼요.',
    restock: 'F/W 프리미엄 라인은 10월부터 순차 입고돼요. 지금은 구매 가능 수량이 0이고, 상품 페이지에서 입고 알림을 신청하시면 판매 시작과 함께 알려드려요. 입고 시 155/160/167cm 세 명의 착용 비교 사진도 함께 올라가요.',
    care: '드라이클리닝을 권장해요. 울 전용 세제로 찬물에 손세탁한 뒤 눕혀서 말리는 방법도 괜찮아요. 울·알파카 혼방 원사는 특성상 약간의 보풀과 잡사가 생길 수 있고, 마감 불량(단추, 봉제)은 무상 교환해 드려요.',
    color: '자연광 컬러컷을 기준으로 촬영하고 있어요. 그래도 실물이 사진과 다르다고 느끼시면 왕복 배송비 없이 교환·반품해 드려요.',
    hours: '상담원 상담은 평일 10:00~18:00(점심 12:30~13:30)에 네이버 톡톡으로 가능해요. 지금 이 자동상담은 24시간 열려 있으니 배송·교환·사이즈 등 궁금한 점을 편하게 물어보세요. 급한 배송 문의는 톡톡에 주문번호와 함께 남겨주시면 다음 영업일 오전에 우선 답변드려요.',
    payment: '결제는 네이버 스마트스토어에서 네이버페이로 진행돼요. 네이버페이 결제와 구매안전서비스를 그대로 쓰기 위해서예요. 이 사이트는 상품 정보, 사이즈, 공장 이야기를 자세히 보여드리는 곳이고, 상품 페이지의 구매하기 버튼을 누르면 스마트스토어로 이어져요.',
    order: '주문 조회와 배송 조회는 네이버 스마트스토어 주문내역에서 확인하실 수 있어요. 이 자동상담에서는 개별 주문 정보를 조회할 수 없어서, 주문번호가 필요한 문의는 톡톡으로 남겨주시면 영업시간에 확인해 드릴게요.',
    crop: '크롭 기장이 부담스러우시면 프리미엄 라인의 울 혼방 케이블 니트(총기장 62cm), 알파카 롱 가디건(82cm), 부클 롱 베스트(64cm)가 레귤러 또는 롱 기장이에요. 베이직 라인에서는 케이블 브이넥 꽈배기 니트(57cm)와 리싸이클 라운드 니트(56cm)가 골반을 덮는 기장이에요.',
    pilling: '울과 알파카 혼방 원사는 특성상 약간의 보풀과 잡사가 생길 수 있어요. 까슬거림이 있는 원사는 상세 페이지에 미리 적어두고 이너 착용을 권해드려요. 단추·봉제 같은 마감 불량은 무상 교환해 드려요.',
    factory: '걸스라미는 경기도 광주에서 니트를 직접 짜는 공장 브랜드예요. 도매로 납품하던 니트를 소매 전용 재고로 따로 운영해서, 도매 생산 일정과 무관하게 출고하고 있어요. 자세한 이야기는 공장 이야기 페이지에서 보실 수 있어요.',
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
    { id: 'factory', kw: [['공장', 3], ['어디서 만', 3], ['제조', 2], ['원산지', 3], ['생산', 2], ['도매', 3], ['브랜드', 1], ['광주', 2], ['국내', 2], ['made', 2]], answer: 'factory' },
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
    'wool-cable-regular': ['청키', '울 케이블', '울 혼방 케이블', '청키 케이블'],
    'cashmere-touch-turtle': ['폴라', '터틀', '캐시미어', '목폴라', '하이넥 폴라'],
    'alpaca-long-cardigan': ['롱 가디건', '롱가디건', '알파카 가디건', '알파카 롱'],
    'ribbed-knit-dress': ['원피스', '골지 원피스', '니트 원피스', '드레스'],
    'boucle-long-vest': ['롱 베스트', '롱베스트', '롱 조끼', '롱조끼', '부클 베스트'],
    'knit-set-cardigan-top': ['세트', '니트 세트', '가디건 세트', '따로 또 같이'],
    'wool-rib-muffler': ['머플러', '목도리', '스카프'],
    'halfzip-knit': ['하프집업', '하프 집업', '집업', '반집업', '하이넥 니트'],
  };

  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const won = n => Number(n).toLocaleString('ko-KR') + '원';
  /* 받침 여부에 따른 조사 (은/는, 이/가) */
  const josa = (w, a, b) => { const c = String(w).replace(/[^가-힣]+$/, '').slice(-1); const code = c.charCodeAt(0); if (!(code >= 0xac00 && code <= 0xd7a3)) return w + b; return w + (((code - 0xac00) % 28) ? a : b); };

  function findProducts(msg, products) {
    if (!products) return [];
    const m = norm(msg);
    const hits = [];
    for (const p of products) {
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
    const soon = !p.stock || p.stock <= 0;
    const colors = p.colors && p.colors.length ? p.colors.join(', ') : '상세 페이지 참고';
    const sizes = (p.sizes || []).join(' / ');
    const link = `product.html?id=${p.id}`;
    const base = `${josa(p.name, '은', '는')} ${won(p.price)}${p.listPrice ? ` (정가 ${won(p.listPrice)})` : ''}이고, 소재는 ${p.material}, 사이즈는 ${sizes}예요.`;
    if (intent === 'size') {
      const ms = p.measure ? Object.entries(p.measure).map(([k, v]) => `${k} ${v}cm`).join(', ') : '';
      return { text: `${p.name} 실측은 ${ms}예요. 핏은 ${p.fit}, ${p.length}이고 신축성은 '${p.stretch}'예요. 갖고 계신 옷의 가슴 단면과 비교해 보시면 가장 정확해요.`, link, linkText: '상품 실측 표 보기' };
    }
    if (intent === 'care' || intent === 'pilling') {
      return { text: `${p.name}의 세탁 안내는 '${p.care}'예요. 두께는 ${p.thickness}, 비침은 ${p.sheer}이에요.`, link, linkText: '상품 상세 보기' };
    }
    if (intent === 'color') {
      return { text: `${p.name}의 컬러는 ${colors}예요. 자연광 컬러컷 기준으로 촬영하고, 실물이 사진과 다르다고 느끼시면 왕복 배송비 없이 교환·반품해 드려요.`, link, linkText: '컬러 보기' };
    }
    if (soon) {
      return { text: `${base} 지금은 ${p.eta || '입고 예정'}이라 구매 가능 수량이 0이에요. 상품 페이지에서 입고 알림을 신청하시면 판매 시작과 함께 알려드릴게요. 컬러는 ${colors}로 준비 중이에요.`, link, linkText: '입고 알림 신청' };
    }
    return { text: `${base} 컬러는 ${colors}이고 스마트스토어에서 바로 구매하실 수 있어요.${p.badges && p.badges.includes('오늘출발') ? ' 평일 2시 이전 결제 시 오늘 출발해요.' : ''}`, link, linkText: '상품 보기' };
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
      return { intent: 'price', text: '베이직 라인은 11,900~13,900원이고 전부 무료배송이에요. F/W 프리미엄 라인은 19,000~49,000원으로 10~11월 순차 입고 예정이에요. 특정 상품 이름을 말씀해 주시면 바로 안내드릴게요.', link: 'shop.html', linkText: '전체 상품 보기', score: 2 };
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
    { label: '입고 예정 상품', msg: '입고 예정 상품은 언제 살 수 있나요?' },
  ];

  return { match, findProduct, productAnswer, policySummary, POLICY, QUICK, version: '1.0' };
});
