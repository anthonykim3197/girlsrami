/* 걸스라미 자사몰 상품 데이터
   - line: 'basic' = 유입용 1만 원대 라인 (스마트스토어 판매 중, 실제 상품)
   - line: 'premium' = F/W 프리미엄 라인 (청사진 상품, 구매 가능 수량 0, 입고 예정)
   - 색상명은 도매 품번 없이 정식 표기로 정리
*/
window.GR = window.GR || {};

GR.STORE_URL = 'https://smartstore.naver.com/girlsrami';
GR.TALK_URL = 'https://smartstore.naver.com/girlsrami'; /* 스토어 홈의 톡톡 버튼으로 연결 */
GR.CHAT_ENDPOINT = 'https://girlsrami-chat.clever-insight.vip'; /* 자동상담 AI 서버 (룰 엔진은 브라우저에서 동작, AI 폴백만 서버 호출) */

GR.COLORS = {
  '라임': '#C9D96B', '라이트브라운': '#B98E6A', '베이지': '#D9C5A5', '스카이블루': '#A9C4D8', '네이비': '#2E3A55',
  '그레이': '#A9A6A2', '아이보리': '#F1EBDD', '연핑크': '#E9C4C4', '퍼플': '#8C7AA8', '그린': '#5F7F5C', '블랙': '#222222',
  '크림': '#F3EBDB', '오트밀': '#E4D9C6', '카멜': '#B8865B', '차콜': '#4A4A4A', '세이지': '#9FAA8E', '버건디': '#6E2C35',
  '모카': '#7C5A48', '더스티핑크': '#D7A9A5', '올리브': '#6E7A4F', '헤더그레이': '#9B9895', '옐로우': '#EFE29A',
  '화이트': '#FAFAFA', '브라운': '#6B4B3A'
};

GR.PRODUCTS = [
  /* ---------------- 베이직 라인 (실제 판매 중, 스마트스토어 연결) ---------------- */
  {
    id: 'boucle-crop-cardigan', sku: '6679667474', line: 'basic', category: '가디건', season: 'ALL',
    name: '부클 라운드 크롭 니트 가디건', sub: '봄·여름·간절기 살안타템',
    price: 12900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/6679667474',
    image: 'p-cardigan-boucle', colors: ['라임','라이트브라운','베이지','스카이블루','네이비'],
    sizes: ['FREE'], fit: '크롭 · 기본핏', length: '크롭 (총기장 42cm)',
    material: '아크릴 100%', thickness: '얇음', stretch: '조금 늘어남', sheer: '조금 비침', care: '드라이클리닝 권장',
    measure: { '총기장': 42, '가슴': 51, '어깨': 37, '암홀': 20, '소매기장': 57, '소매통': 14, '소매밑단': 10 },
    rating: 4.76, reviewCount: 188, badges: ['베스트','오늘출발'],
    desc: '보송한 부클 원사로 짠 크롭 가디건. 여름 냉방과 간절기 햇빛을 가려주고, 스커트와 하이웨스트 팬츠 어디에나 잘 어울립니다. 크롭 기장이 부담스러운 분은 프리미엄 라인의 레귤러 기장 가디건을 추천합니다.',
    reviews: [
      { stars: 5, text: '크롭이라 바지 스커트 어디에도 잘 어울려요. 여름엔 꼭 필요한 살안타템이에요. 원단도 찾던 원단이고 이 금액에 나시까지 주시고 잘 입을게요.', who: 'ne****', body: '155cm · 44kg', reply: '찾던 원단이라는 말씀에 힘이 납니다. 같은 부클 원사로 레귤러 기장도 준비 중이니 가을에 다시 만나요.' },
      { stars: 5, text: '색이 너무나 이쁘고 편해서 하나 더 구매합니다. 서비스 나시에 감동입니다.', who: 'lsan******', body: '160cm · 53kg', reply: '재구매 감사합니다. 두 번째 주문은 재구매 쿠폰이 자동 적용됩니다.' },
      { stars: 2, text: '사진에서 봤던 것보다 많이 크롭이고 재질도 생각했던 거랑 좀 달라서 아쉬웠어요.', who: 'godh******', body: '', reply: '실측 기장(42cm)을 상단에 더 크게 표기하고, 키별 착용 비교 사진을 추가했습니다. 불편을 드려 죄송합니다. 교환을 원하시면 톡톡으로 연락 주세요.' }
    ]
  },
  {
    id: 'cable-vneck-knit', sku: '8087805239', line: 'basic', category: '니트', season: 'ALL',
    name: '케이블 브이넥 꽈배기 니트', sub: '9가지 컬러 데일리 니트',
    price: 12900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/8087805239',
    image: 'p-vneck-cable', colors: ['스카이블루','그레이','아이보리','베이지','연핑크','퍼플','그린','네이비','블랙'],
    sizes: ['FREE'], fit: '레귤러핏', length: '골반 덮는 기장 (총기장 57cm)',
    material: '아크릴 100%', thickness: '얇음', stretch: '보통', sheer: '약간 비침', care: '드라이클리닝 권장',
    measure: { '총기장': 57, '가슴': 51, '어깨': 40, '암홀': 22, '소매기장': 56, '소매통': 16, '소매밑단': 9 },
    rating: 4.81, reviewCount: 104, badges: ['베스트','9컬러'],
    desc: '쇄골이 은은하게 드러나는 브이넥 꽈배기 니트. 162cm 모델 기준 골반을 덮는 기장과 손끝까지 오는 소매의 레귤러핏입니다. 아이보리와 화이트 계열은 특성상 비침이 있을 수 있습니다.',
    reviews: [
      { stars: 5, text: '편하고 핏이 좋아요. 깔별로 사서 겨우내 잘 입어요.', who: 'cheo*****', body: '', reply: '컬러별로 입어주셔서 감사합니다. 겨울에는 같은 디자인의 울 혼방 버전이 나옵니다.' },
      { stars: 1, text: '색상 촌스러운 초록. 사진엔 예쁘게 찍힘. 절대 저 색 아님.', who: 'eh****', body: '', reply: '사진과 실물 색 차이로 실망을 드려 죄송합니다. 그린 컬러는 자연광 컬러컷으로 사진을 교체했고, 색상 불만은 반품비 없이 교환·반품해 드립니다.' }
    ]
  },
  {
    id: 'vneck-knit-vest', sku: '9721023441', line: 'basic', category: '조끼', season: 'ALL',
    name: '브이넥 리싸이클 니트 조끼', sub: '레이어드 필수 아이템',
    price: 12900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/9721023441',
    image: 'p-vest-vneck', colors: [],
    sizes: ['FREE'], fit: '기본핏 · 세미크롭', length: '총기장 54cm',
    material: '리싸이클 폴리 · 아크릴 · 울 · 스판 혼방', thickness: '도톰', stretch: '보통', sheer: '비침 거의 없음', care: '드라이클리닝 권장',
    measure: { '총기장': 54, '가슴': 52, '어깨': 42, '암홀': 23, '목넓이': 20, '목깊이': 17 },
    rating: 4.83, reviewCount: 96, badges: ['주간 1위','오늘출발'],
    desc: '리싸이클 원사를 섞은 보카시 니트 조끼. 셔츠나 티셔츠 위에 걸치기 좋은 도톰한 두께입니다. 울 혼방 특성상 잡사와 실뭉침은 원단의 자연스러운 특징입니다.',
    reviews: [
      { stars: 5, text: '옷은 이뻐요. 크롭으로 제 몸매엔 바지보단 스커트에 매칭할 때 이쁘네요.', who: 'lyh8*****', body: '', reply: '스커트 매칭 팁 감사합니다. 레귤러 기장 롱 조끼도 F/W에 준비했습니다.' }
    ]
  },
  {
    id: 'alpaca-round-knit', sku: '7594968064', line: 'basic', category: '니트', season: 'FW',
    name: '알파카 혼방 루즈 라운드 니트', sub: '보들보송 몽실 텍스처',
    price: 12900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/7594968064',
    image: 'p-alpaca-round', colors: [],
    sizes: ['FREE'], fit: '루즈 · 박시핏', length: '총기장 53cm',
    material: '아크릴 72% · 나일론 13% · 알파카 3% 외', thickness: '도톰', stretch: '좋음', sheer: '살짝 비침', care: '드라이클리닝 권장',
    measure: { '총기장': 53, '가슴': 62, '어깨': 56, '암홀': 22, '소매기장': 44, '소매통': 19, '소매밑단': 11 },
    rating: 4.5, reviewCount: 8, badges: ['F/W'],
    desc: '알파카를 섞어 포근한 촉감의 루즈핏 니트. 163cm 모델 기준 어깨가 떨어지는 드롭숄더 실루엣입니다.',
    reviews: []
  },
  {
    id: 'stripe-cable-half', sku: '8424655623', line: 'basic', category: '니트', season: 'SS',
    name: '단가라 케이블 세미크롭 반팔 니트', sub: '클래식 스트라이프',
    price: 11900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/8424655623',
    image: 'p-stripe-cable-half', colors: [],
    sizes: ['FREE'], fit: '세미크롭', length: '총기장 45cm',
    material: '아크릴 100%', thickness: '보통', stretch: '보통', sheer: '약간 비침', care: '드라이클리닝 권장',
    measure: { '총기장': 45, '가슴': 46, '어깨': 35, '암홀': 21, '소매기장': 23, '소매통': 15, '소매밑단': 12 },
    rating: 4.75, reviewCount: 4, badges: ['S/S'],
    desc: '라운드넥 꽈배기 반팔 니트. 봄과 초여름에 스커트나 하이웨스트 청바지에 잘 어울리는 세미크롭 기장입니다.',
    reviews: []
  },
  {
    id: 'popcorn-vneck-half', sku: '10115610353', line: 'basic', category: '니트', season: 'SS',
    name: '슬라브 팝콘 브이넥 반팔 니트', sub: '간절기 부들부들 촉감',
    price: 11900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/10115610353',
    image: 'p-popcorn-half', colors: ['블랙','베이지'],
    sizes: ['FREE'], fit: '기본핏', length: '총기장 47cm',
    material: '아크릴 100%', thickness: '보통', stretch: '있음', sheer: '약간 있음', care: '드라이클리닝 권장',
    measure: { '총기장': 47, '가슴': 45, '어깨': 40, '암홀': 20, '소매기장': 18, '소매통': 17, '소매밑단': 13 },
    rating: 4.8, reviewCount: 4, badges: ['S/S'],
    desc: '볼록볼록한 팝콘 조직의 브이넥 반팔 니트. 부들부들한 촉감으로 봄, 여름, 가을 간절기까지 입습니다. 네크라인 깊이는 착용 사진을 참고해 주세요.',
    reviews: []
  },
  {
    id: 'recycled-round-sweater', sku: '9704215111', line: 'basic', category: '니트', season: 'FW',
    name: '리싸이클 무지 박시 라운드 니트', sub: '기본 중의 기본',
    price: 13900, listPrice: null, stock: 999,
    smartstore: 'https://smartstore.naver.com/girlsrami/products/9704215111',
    image: 'p-recycled-round', colors: [],
    sizes: ['FREE'], fit: '루즈 · 박시핏', length: '총기장 56cm',
    material: '리싸이클 폴리 · 아크릴 · 울 · 스판 혼방', thickness: '도톰', stretch: '좋음', sheer: '비침 없음', care: '드라이클리닝 권장',
    measure: { '총기장': 56, '가슴': 53, '어깨': 41, '암홀': 22, '소매기장': 56, '소매통': 16, '소매부리': 9 },
    rating: 5.0, reviewCount: 2, badges: ['F/W'],
    desc: '보들보들한 촉감의 무지 니트. 원사 특성상 거친 느낌이 있을 수 있어 이너 티셔츠 착용을 권합니다.',
    reviews: []
  },

  /* ---------------- 프리미엄 라인 (F/W 청사진, 구매 가능 수량 0) ---------------- */
  {
    id: 'wool-cable-regular', sku: 'GR-FW26-001', line: 'premium', category: '니트', season: 'FW',
    name: '울 혼방 청키 케이블 라운드 니트', sub: '4050 라인 · 레귤러 기장',
    price: 39000, listPrice: 49000, stock: 0, eta: '10월 중순 입고 예정',
    smartstore: null,
    image: 'p-wool-cable-regular', colors: ['카멜','크림','차콜','네이비'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '레귤러핏', length: '엉덩이 덮는 기장 (총기장 62cm)',
    material: '울 50% · 아크릴 40% · 나일론 10%', thickness: '두꺼움', stretch: '좋음', sheer: '없음', care: '울 전용 세제 손세탁 또는 드라이클리닝',
    measure: { '총기장': 62, '가슴': 56, '어깨': 46, '암홀': 24, '소매기장': 58, '소매통': 18, '소매밑단': 10 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄','L사이즈'],
    desc: '기존 꽈배기 니트에서 "기장이 짧다", "팔 둘레가 조금 작다"는 의견을 받아 다시 설계한 레귤러 버전. 팔 둘레와 가슴에 여유를 주고 엉덩이를 덮는 기장으로 만들었습니다. 경기 광주 공장에서 소량 생산합니다.',
    reviews: []
  },
  {
    id: 'cashmere-touch-turtle', sku: 'GR-FW26-002', line: 'premium', category: '니트', season: 'FW',
    name: '캐시미어 터치 폴라 니트', sub: '4050 라인 · 목이 편한 하이넥',
    price: 34000, listPrice: 42000, stock: 0, eta: '10월 말 입고 예정',
    smartstore: null,
    image: 'p-cashmere-turtle', colors: ['차콜','크림','카멜','버건디'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '세미 루즈핏', length: '총기장 60cm',
    material: '비스코스 · 나일론 · 울 · 캐시미어 혼방', thickness: '보통', stretch: '좋음', sheer: '없음', care: '드라이클리닝',
    measure: { '총기장': 60, '가슴': 54, '어깨': 44, '소매기장': 58 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄','L사이즈'],
    desc: '목이 답답하지 않게 접어 입을 수 있는 폴라 니트. 안감처럼 부드러운 캐시미어 터치 원사를 썼습니다.',
    reviews: []
  },
  {
    id: 'alpaca-long-cardigan', sku: 'GR-FW26-003', line: 'premium', category: '가디건', season: 'FW',
    name: '알파카 혼방 롱 가디건', sub: '포켓 · 허벅지 중간 기장',
    price: 49000, listPrice: 59000, stock: 0, eta: '11월 초 입고 예정',
    smartstore: null,
    image: 'p-alpaca-long-cardigan', colors: ['오트밀','차콜','모카'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '루즈핏', length: '롱 (총기장 82cm)',
    material: '알파카 20% · 울 30% · 아크릴 50%', thickness: '두꺼움', stretch: '보통', sheer: '없음', care: '드라이클리닝',
    measure: { '총기장': 82, '가슴': 60, '어깨': 50, '소매기장': 56 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄'],
    desc: '크롭 가디건 리뷰에서 가장 많이 나온 요청, "긴 기장으로도 만들어 주세요"에 대한 답입니다. 코트 대신 걸치는 롱 가디건.',
    reviews: []
  },
  {
    id: 'ribbed-knit-dress', sku: 'GR-FW26-004', line: 'premium', category: '원피스', season: 'FW',
    name: '골지 라운드 니트 롱 원피스', sub: '한 벌로 끝나는 F/W',
    price: 45000, listPrice: 55000, stock: 0, eta: '11월 초 입고 예정',
    smartstore: null,
    image: 'p-knit-dress', colors: ['버건디','차콜','크림'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '스트레이트', length: '미디 (총기장 112cm)',
    material: '울 30% · 아크릴 60% · 스판 10%', thickness: '보통', stretch: '좋음', sheer: '없음', care: '드라이클리닝',
    measure: { '총기장': 112, '가슴': 48, '어깨': 40, '소매기장': 58 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄','L사이즈'],
    desc: '몸에 붙지 않는 스트레이트 실루엣의 골지 니트 원피스. 부츠와 롱 가디건에 맞춰 입습니다.',
    reviews: []
  },
  {
    id: 'boucle-long-vest', sku: 'GR-FW26-005', line: 'premium', category: '조끼', season: 'FW',
    name: '부클 니트 롱 베스트', sub: '레귤러 기장 조끼',
    price: 29000, listPrice: 36000, stock: 0, eta: '10월 중순 입고 예정',
    smartstore: null,
    image: 'p-vest-long-boucle', colors: ['모카','크림','네이비'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '기본핏', length: '총기장 64cm',
    material: '울 20% · 아크릴 70% · 나일론 10%', thickness: '도톰', stretch: '보통', sheer: '없음', care: '드라이클리닝',
    measure: { '총기장': 64, '가슴': 54, '어깨': 40, '암홀': 24 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄'],
    desc: '주간 1위 니트 조끼의 레귤러 기장 버전. 셔츠 위에 겹쳐 입어도 허리가 드러나지 않습니다.',
    reviews: []
  },
  {
    id: 'knit-set-cardigan-top', sku: 'GR-FW26-006', line: 'premium', category: '세트', season: 'FW',
    name: '니트 세트 (가디건 + 슬리브리스)', sub: '따로 또 같이',
    price: 49000, listPrice: 62000, stock: 0, eta: '11월 중순 입고 예정',
    smartstore: null,
    image: 'p-knit-set', colors: ['더스티핑크','크림','차콜'],
    sizes: ['FREE(55~66)'], fit: '기본핏', length: '가디건 총기장 52cm · 탑 총기장 50cm',
    material: '울 30% · 아크릴 70%', thickness: '보통', stretch: '좋음', sheer: '없음', care: '드라이클리닝',
    measure: { '가디건 총기장': 52, '가디건 가슴': 52, '탑 총기장': 50, '탑 가슴': 44 },
    rating: null, reviewCount: 0, badges: ['NEW','프리미엄','세트'],
    desc: '사은품으로 드리던 슬리브리스를 정식 세트로 만들었습니다. 같은 원사, 같은 염색 로트로 색을 맞췄습니다.',
    reviews: []
  },
  {
    id: 'wool-rib-muffler', sku: 'GR-FW26-007', line: 'premium', category: '액세서리', season: 'FW',
    name: '울 골지 머플러', sub: '선물하기 좋은 두께',
    price: 19000, listPrice: 24000, stock: 0, eta: '10월 말 입고 예정',
    smartstore: null,
    image: 'p-wool-muffler', colors: ['크림','카멜','차콜','버건디'],
    sizes: ['FREE'], fit: '-', length: '길이 180cm · 폭 28cm',
    material: '울 50% · 아크릴 50%', thickness: '두꺼움', stretch: '좋음', sheer: '없음', care: '손세탁',
    measure: { '길이': 180, '폭': 28 },
    rating: null, reviewCount: 0, badges: ['NEW','선물'],
    desc: '공장 편직기로 짠 두툼한 골지 머플러. 니트와 같은 컬러로 맞춰 입을 수 있습니다.',
    reviews: []
  },
  {
    id: 'halfzip-knit', sku: 'GR-FW26-008', line: 'premium', category: '니트', season: 'FW',
    name: '하프집업 하이넥 니트', sub: '자사몰 단독 디자인',
    price: 39000, listPrice: 46000, stock: 0, eta: '11월 초 입고 예정',
    smartstore: null,
    image: 'p-halfzip', colors: ['올리브','크림','네이비'],
    sizes: ['FREE(55~66)','L(66~77)'], fit: '세미 루즈핏', length: '총기장 61cm',
    material: '울 40% · 아크릴 60%', thickness: '보통', stretch: '좋음', sheer: '없음', care: '드라이클리닝',
    measure: { '총기장': 61, '가슴': 55, '어깨': 46, '소매기장': 58 },
    rating: null, reviewCount: 0, badges: ['NEW','자사몰 단독','L사이즈'],
    desc: '도매 거래처와 겹치지 않는 자사몰 전용 디자인. 지퍼를 올리면 폴라, 내리면 브이넥처럼 입습니다.',
    reviews: []
  }
];

GR.CATEGORIES = ['전체','니트','가디건','조끼','원피스','세트','액세서리'];

GR.fmt = n => n.toLocaleString('ko-KR') + '원';
GR.byId = id => GR.PRODUCTS.find(p => p.id === id);
GR.discount = p => p.listPrice ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
