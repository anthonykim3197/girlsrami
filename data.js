/* 걸스라미 자사몰 상품 데이터
   - 현재 스마트스토어에서 판매 중인 공개 상품만 포함
   - 가격·재고·상품 URL은 2026-10-13 공개 카탈로그 기준
   - 판매 중이 아닌 기획 상품은 공개 폴백에서 제외
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
  {
    "id": "cable-vneck-knit",
    "fit": "레귤러핏",
    "sku": "8087805239",
    "sub": "브이넥 · 세로 케이블 · 9가지 컬러",
    "care": "드라이크리닝 권장",
    "desc": "쇄골이 자연스럽게 드러나는 브이넥과 세로 케이블 조직이 특징인 긴소매 니트입니다. 총기장 57cm의 레귤러핏이며 아이보리 계열은 비침이 있을 수 있습니다.",
    "line": "basic",
    "name": "케이블 브이넥 꽈배기 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/ai-rm385-beige-hero-webp-97fcadb66f44.webp",
    "price": 12900,
    "sheer": "약간 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 2546,
    "badges": [],
    "colors": [
      "소라",
      "회색",
      "아이",
      "베이지",
      "연핑",
      "보라",
      "초록",
      "곤색",
      "검정"
    ],
    "length": "총기장 57cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.81,
    "season": "ALL",
    "status": "active",
    "measure": {
      "가슴": 51,
      "암홀": 22,
      "어깨": 40,
      "소매통": 16,
      "총기장": 57,
      "소매기장": 56,
      "소매밑단": 9
    },
    "reviews": [],
    "stretch": "보통",
    "category": "니트",
    "colorHex": {
      "검정": "#272629",
      "곤색": "#2E355C",
      "보라": "#A696C2",
      "소라": "#B9D1D7",
      "아이": "#E8E2D3",
      "연핑": "#D8B1BC",
      "초록": "#5F9A50",
      "회색": "#B7B6BE",
      "베이지": "#D2BC99"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/8087805239",
    "variants": [
      {
        "sku": "RM385-SORA",
        "color": "소라",
        "stock": 285,
        "optionId": 29358837330
      },
      {
        "sku": "RM385-GRAY",
        "color": "회색",
        "stock": 286,
        "optionId": 29358837332
      },
      {
        "sku": "RM385-IVORY",
        "color": "아이",
        "stock": 277,
        "optionId": 29358837334
      },
      {
        "sku": "RM385-BEIGE",
        "color": "베이지",
        "stock": 291,
        "optionId": 29358837336
      },
      {
        "sku": "RM385-LIGHT-PINK",
        "color": "연핑",
        "stock": 286,
        "optionId": 29358837338
      },
      {
        "sku": "RM385-PURPLE",
        "color": "보라",
        "stock": 285,
        "optionId": 29358837339
      },
      {
        "sku": "RM385-GREEN",
        "color": "초록",
        "stock": 269,
        "optionId": 29358837340
      },
      {
        "sku": "RM385-NAVY",
        "color": "곤색",
        "stock": 289,
        "optionId": 29358837341
      },
      {
        "sku": "RM385-BLACK",
        "color": "검정",
        "stock": 278,
        "optionId": 29358837342
      }
    ],
    "listPrice": null,
    "styleCode": "RM385",
    "thickness": "얇음",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/8087805239",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "검정": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-black-71042f02cf24.jpg",
        "verified": true
      },
      "곤색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-navy-a3b1eb033298.jpg",
        "verified": true
      },
      "보라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-purple-225c8a0d1e51.jpg",
        "verified": true
      },
      "소라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-sora-b98cf270a2af.jpg",
        "verified": true
      },
      "아이": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-ivory-e50fe03a8180.jpg",
        "verified": true
      },
      "연핑": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-light-pink-95283b1c5074.jpg",
        "verified": true
      },
      "초록": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-green-e482eafa9213.jpg",
        "verified": true
      },
      "회색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-gray-3c713b2b80c0.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-beige-74fc064fcdd4.jpg",
        "verified": true
      }
    },
    "reviewCount": 104,
    "detailImages": [
      {
        "alt": "케이블 브이넥 꽈배기 니트 브이넥 케이블 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/detail-1-6307f1910e0d.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "케이블 브이넥 꽈배기 니트 소매와 시보리 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/detail-2-99c5f8232ca5.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "케이블 브이넥 꽈배기 니트 몸판 케이블 조직 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/detail-3-abf723882a95.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM385-SORA",
        "kind": "photo",
        "color": "소라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-sora-b98cf270a2af.jpg",
        "optionId": 29358837330,
        "verified": true
      },
      {
        "sku": "RM385-GRAY",
        "kind": "photo",
        "color": "회색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-gray-3c713b2b80c0.jpg",
        "optionId": 29358837332,
        "verified": true
      },
      {
        "sku": "RM385-IVORY",
        "kind": "photo",
        "color": "아이",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-ivory-e50fe03a8180.jpg",
        "optionId": 29358837334,
        "verified": true
      },
      {
        "sku": "RM385-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-beige-74fc064fcdd4.jpg",
        "optionId": 29358837336,
        "verified": true
      },
      {
        "sku": "RM385-LIGHT-PINK",
        "kind": "photo",
        "color": "연핑",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-light-pink-95283b1c5074.jpg",
        "optionId": 29358837338,
        "verified": true
      },
      {
        "sku": "RM385-PURPLE",
        "kind": "photo",
        "color": "보라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-purple-225c8a0d1e51.jpg",
        "optionId": 29358837339,
        "verified": true
      },
      {
        "sku": "RM385-GREEN",
        "kind": "photo",
        "color": "초록",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-green-e482eafa9213.jpg",
        "optionId": 29358837340,
        "verified": true
      },
      {
        "sku": "RM385-NAVY",
        "kind": "photo",
        "color": "곤색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-navy-a3b1eb033298.jpg",
        "optionId": 29358837341,
        "verified": true
      },
      {
        "sku": "RM385-BLACK",
        "kind": "photo",
        "color": "검정",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-black-71042f02cf24.jpg",
        "optionId": 29358837342,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "검정": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-black-71042f02cf24.jpg",
          "verified": true
        },
        "곤색": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-navy-a3b1eb033298.jpg",
          "verified": true
        },
        "보라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-purple-225c8a0d1e51.jpg",
          "verified": true
        },
        "소라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-sora-b98cf270a2af.jpg",
          "verified": true
        },
        "아이": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-ivory-e50fe03a8180.jpg",
          "verified": true
        },
        "연핑": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-light-pink-95283b1c5074.jpg",
          "verified": true
        },
        "초록": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-green-e482eafa9213.jpg",
          "verified": true
        },
        "회색": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/source-rm385-gray-3c713b2b80c0.jpg",
          "verified": true
        },
        "베이지": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/ai-rm385-beige-hero-webp-97fcadb66f44.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/cable-vneck-knit/ai-rm385-beige-fullbody-webp-554fa8d8abab.webp"
        }
      },
      "defaultColor": "베이지",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "stripe-cable-half",
    "fit": "세미크롭",
    "sku": "8424655623",
    "sub": "스트라이프 · 케이블 조직 · 총기장 45cm",
    "care": "드라이크리닝 권장",
    "desc": "라운드넥과 케이블 조직의 스트라이프 반팔 니트입니다. 총기장 45cm의 세미크롭 핏으로 스커트나 하이웨이스트 청바지와 코디할 수 있습니다.",
    "line": "basic",
    "name": "단가라 케이블 세미크롭 반팔 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/ai-rm401-sky-blue-hero-webp-8a1810cb968d.webp",
    "price": 11900,
    "sheer": "약간 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 1485,
    "badges": [],
    "colors": [
      "곤색",
      "베이지",
      "초록",
      "하늘",
      "연핑"
    ],
    "length": "총기장 45cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.75,
    "season": "SS",
    "status": "active",
    "measure": {
      "가슴": 46,
      "암홀": 21,
      "어깨": 35,
      "소매통": 15,
      "총기장": 45,
      "소매기장": 23,
      "소매밑단": 12
    },
    "reviews": [],
    "stretch": "보통",
    "category": "니트",
    "colorHex": {
      "곤색": "#2D3550",
      "연핑": "#DBB5C6",
      "초록": "#6FAB4E",
      "하늘": "#94B7C9",
      "베이지": "#C9B58F"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/8424655623",
    "variants": [
      {
        "sku": "RM401-NAVY",
        "color": "곤색",
        "stock": 295,
        "optionId": 31015860156
      },
      {
        "sku": "RM401-BEIGE",
        "color": "베이지",
        "stock": 297,
        "optionId": 31015860157
      },
      {
        "sku": "RM401-GREEN",
        "color": "초록",
        "stock": 299,
        "optionId": 31015860158
      },
      {
        "sku": "RM401-SKY-BLUE",
        "color": "하늘",
        "stock": 295,
        "optionId": 31015860159
      },
      {
        "sku": "RM401-LIGHT-PINK",
        "color": "연핑",
        "stock": 299,
        "optionId": 31015860160
      }
    ],
    "listPrice": null,
    "styleCode": "RM401",
    "thickness": "보통",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/8424655623",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "곤색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-navy-a91f78ea5cd4.jpg",
        "verified": true
      },
      "연핑": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-light-pink-81dd199c8cd7.jpg",
        "verified": true
      },
      "초록": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-green-df5c1e647a83.jpg",
        "verified": true
      },
      "하늘": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-sky-blue-4492a33d8b82.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-beige-0449e71eb0c4.jpg",
        "verified": true
      }
    },
    "reviewCount": 4,
    "detailImages": [
      {
        "alt": "단가라 케이블 세미크롭 반팔 니트 라운드넥 케이블 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/detail-1-5cc150a037da.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "단가라 케이블 세미크롭 반팔 니트 밑단 케이블과 시보리 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/detail-2-484eb666b3b9.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "단가라 케이블 세미크롭 반팔 니트 반소매 끝단 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/detail-3-6b22168928e2.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM401-NAVY",
        "kind": "photo",
        "color": "곤색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-navy-a91f78ea5cd4.jpg",
        "optionId": 31015860156,
        "verified": true
      },
      {
        "sku": "RM401-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-beige-0449e71eb0c4.jpg",
        "optionId": 31015860157,
        "verified": true
      },
      {
        "sku": "RM401-GREEN",
        "kind": "photo",
        "color": "초록",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-green-df5c1e647a83.jpg",
        "optionId": 31015860158,
        "verified": true
      },
      {
        "sku": "RM401-SKY-BLUE",
        "kind": "photo",
        "color": "하늘",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-sky-blue-4492a33d8b82.jpg",
        "optionId": 31015860159,
        "verified": true
      },
      {
        "sku": "RM401-LIGHT-PINK",
        "kind": "photo",
        "color": "연핑",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-light-pink-81dd199c8cd7.jpg",
        "optionId": 31015860160,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "곤색": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-navy-a91f78ea5cd4.jpg",
          "verified": true
        },
        "연핑": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-light-pink-81dd199c8cd7.jpg",
          "verified": true
        },
        "초록": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-green-df5c1e647a83.jpg",
          "verified": true
        },
        "하늘": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/ai-rm401-sky-blue-hero-webp-8a1810cb968d.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/ai-rm401-sky-blue-fullbody-webp-1778a3ad675a.webp"
        },
        "베이지": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/stripe-cable-half/source-rm401-beige-0449e71eb0c4.jpg",
          "verified": true
        }
      },
      "defaultColor": "하늘",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "vneck-knit-vest",
    "fit": "여유 있는 기본핏",
    "sku": "9721023441",
    "sub": "보카시 결 · 깊은 V넥 · 총기장 54cm",
    "care": "드라이클리닝 권장 · 세탁 전 케어라벨 확인",
    "desc": "보카시 결, 깊은 V넥, 넓은 밑단 립이 있는 니트 베스트입니다. 총기장 54cm, 가슴 단면 52cm의 여유 있는 기본핏으로 티셔츠나 셔츠 위에 겹쳐 입습니다.",
    "line": "basic",
    "name": "뮤트레이어 V넥 니트 베스트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-grape-a88c8a4731d9.webp",
    "price": 19900,
    "sheer": "비침 거의 없음",
    "sizes": [
      "ONE SIZE"
    ],
    "stock": 1681,
    "badges": [],
    "colors": [
      "그레이프",
      "모카",
      "그레이",
      "브라운",
      "올리브",
      "곤색"
    ],
    "length": "총기장 54cm",
    "origin": "대한민국",
    "rating": 0,
    "season": "ALL",
    "status": "active",
    "measure": {
      "암홀": 23,
      "어깨": 42,
      "목넓이": 20,
      "총기장": 54,
      "앞목깊이": 17,
      "가슴 단면": 52
    },
    "reviews": [],
    "stretch": "보통",
    "category": "조끼",
    "colorHex": {
      "곤색": "#263545",
      "모카": "#aa9787",
      "그레이": "#999996",
      "브라운": "#715448",
      "올리브": "#59604c",
      "그레이프": "#70445f"
    },
    "material": "리싸이클 폴리 34% · 아크릴 29% · 폴리 27% · 울 8% · 스판 2%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/9721023441",
    "variants": [
      {
        "sku": "RM429-GRAPE",
        "color": "그레이프",
        "stock": 232,
        "optionId": 37552832758
      },
      {
        "sku": "RM429-MOCHA",
        "color": "모카",
        "stock": 291,
        "optionId": 37552832759
      },
      {
        "sku": "RM429-GRAY",
        "color": "그레이",
        "stock": 289,
        "optionId": 37552832760
      },
      {
        "sku": "RM429-BROWN",
        "color": "브라운",
        "stock": 292,
        "optionId": 37552832761
      },
      {
        "sku": "RM429-OLIVE",
        "color": "올리브",
        "stock": 288,
        "optionId": 37552832762
      },
      {
        "sku": "RM429-NAVY",
        "color": "곤색",
        "stock": 289,
        "optionId": 37552832763
      }
    ],
    "listPrice": null,
    "styleCode": "RM429",
    "thickness": "도톰",
    "photoColor": "그레이프",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/9721023441",
    "careDetails": {
      "dry": "기계 건조 피하기",
      "iron": "케어라벨 확인 후 낮은 온도",
      "wash": "드라이클리닝 권장",
      "bleach": "표백제 사용 피하기"
    },
    "colorPhotos": {
      "곤색": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-06--67ddcc980dea.jpg",
        "verified": true
      },
      "모카": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-02--9e5f36685039.jpg",
        "verified": true
      },
      "그레이": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-03--ffbb7624ac26.jpg",
        "verified": true
      },
      "브라운": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-04--c7803e0916b8.jpg",
        "verified": true
      },
      "올리브": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-05--37d76f397167.jpg",
        "verified": true
      },
      "그레이프": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/option-01--7c447e029a96.jpg",
        "verified": true
      }
    },
    "reviewCount": 0,
    "channelPrice": {
      "naver": 16800
    },
    "manufacturer": "걸스라미",
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "곤색": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-navy-345431909cff.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/navy-d045ebf5f3a2.webp"
        },
        "모카": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-mocha-71a9cc18eeb7.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/mocha-d2819a244e18.webp"
        },
        "그레이": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-gray-7be7dc468e40.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/gray-fa1e11638337.webp"
        },
        "브라운": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-brown-359aeed2f38f.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/brown-b1c873e9d1a2.webp"
        },
        "올리브": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-olive-315dfa1a64bc.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/olive-be53dffaf95b.webp"
        },
        "그레이프": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-grape-a88c8a4731d9.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/grape-8ae0062b6964.webp"
        }
      },
      "editorial": {
        "looks": [
          {
            "id": "city-denim",
            "note": "화이트 티셔츠 위에 베스트를 겹치고 라이트 데님, 브라운 숄더백, 화이트 레트로 스니커즈를 매치합니다.",
            "items": [
              "화이트 티셔츠",
              "라이트 데님",
              "브라운 숄더백",
              "화이트 레트로 스니커즈"
            ],
            "label": "화이트 티 · 라이트 데님",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/navy-d045ebf5f3a2.webp",
              "모카": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/mocha-d2819a244e18.webp",
              "그레이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/gray-fa1e11638337.webp",
              "브라운": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/brown-b1c873e9d1a2.webp",
              "올리브": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/olive-be53dffaf95b.webp",
              "그레이프": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-denim/grape-8ae0062b6964.webp"
            },
            "occasion": "산책 · 카페"
          },
          {
            "id": "soft-skirt",
            "note": "화이트 옥스퍼드 셔츠 위에 베스트를 겹치고 크림 롱스커트, 발레 플랫, 다크 브라운 미니백을 매치합니다.",
            "items": [
              "화이트 옥스퍼드 셔츠",
              "크림 롱스커트",
              "발레 플랫",
              "다크 브라운 구조적 미니백"
            ],
            "label": "화이트 셔츠 · 크림 롱스커트",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/navy-202fc02094bf.webp",
              "모카": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/mocha-aedfca47b8fa.webp",
              "그레이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/gray-538ad73e55e3.webp",
              "브라운": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/brown-b71d8bec9886.webp",
              "올리브": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/olive-d8c8aa7b76df.webp",
              "그레이프": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/soft-skirt/grape-bc96bd74fbad.webp"
            },
            "occasion": "전시 · 주말 약속"
          },
          {
            "id": "city-mini",
            "note": "블루 스트라이프 셔츠 위에 베스트를 겹치고 차콜 A라인 미니스커트, 타이츠, 블랙 로퍼와 숄더백을 매치합니다.",
            "items": [
              "블루 스트라이프 셔츠",
              "차콜 A라인 미니스커트",
              "차콜 타이츠",
              "블랙 로퍼",
              "블랙 숄더백"
            ],
            "label": "스트라이프 셔츠 · 미니스커트",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/navy-c57b5b37e0ae.webp",
              "모카": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/mocha-cc13f4a08df0.webp",
              "그레이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/gray-1a22678dff2c.webp",
              "브라운": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/brown-17fd3f835034.webp",
              "올리브": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/olive-7816c5270edb.webp",
              "그레이프": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/city-mini/grape-404016980629.webp"
            },
            "occasion": "쇼핑 · 친구와 브런치"
          },
          {
            "id": "tailored",
            "note": "화이트 셔츠 위에 베스트를 겹치고 크림 와이드 팬츠, 슬링백 슈즈, 미니 토트백을 매치합니다.",
            "items": [
              "화이트 셔츠",
              "크림 와이드 팬츠",
              "슬링백 슈즈",
              "미니 토트백"
            ],
            "label": "화이트 셔츠 · 크림 와이드 팬츠",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/navy-dad73bffcd9a.webp",
              "모카": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/mocha-49dbc96f1b93.webp",
              "그레이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/gray-eb28e37db062.webp",
              "브라운": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/brown-25a152161e85.webp",
              "올리브": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/olive-8778803d1147.webp",
              "그레이프": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/looks/tailored/grape-4ba1740a7803.webp"
            },
            "occasion": "출근 · 저녁 약속"
          }
        ],
        "details": [
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-011-de97939ebac0.jpg",
            "caption": "그레이 · 실물 앞면"
          },
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-015-621ebf9fe44a.jpg",
            "caption": "그레이 · 실물 뒷면"
          },
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-016-71cd795a0c63.jpg",
            "caption": "그레이 · V넥 립 조직"
          },
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/actual/detail-017-16baec78ed8b.jpg",
            "caption": "그레이 · 암홀 마감"
          }
        ],
        "colorStory": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/colorboard-2c7ba91de2a5.webp",
        "heroByColor": {
          "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-navy-345431909cff.webp",
          "모카": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-mocha-71a9cc18eeb7.webp",
          "그레이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-gray-7be7dc468e40.webp",
          "브라운": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-brown-359aeed2f38f.webp",
          "올리브": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-olive-315dfa1a64bc.webp",
          "그레이프": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/rm429/hero-grape-a88c8a4731d9.webp"
        },
        "measurements": [
          {
            "label": "총기장",
            "value": 54
          },
          {
            "label": "가슴 단면",
            "value": 52
          },
          {
            "label": "어깨",
            "value": 42
          },
          {
            "label": "암홀",
            "value": 23
          },
          {
            "label": "목넓이",
            "value": 20
          },
          {
            "label": "앞목깊이",
            "value": 17
          }
        ],
        "measurementNote": "단면 기준. 측정 방법에 따라 1~3cm 차이가 있을 수 있습니다.",
        "measurementUnit": "cm"
      },
      "defaultColor": "그레이프"
    }
  },
  {
    "id": "alpaca-round-knit",
    "fit": "루즈 · 박시핏",
    "sku": "7594968064",
    "sub": "알파카 혼방 · 드롭 숄더 · 가슴 단면 62cm",
    "care": "드라이크리닝 권장",
    "desc": "알파카 혼방 원사의 보송한 질감과 드롭 숄더가 어우러진 루즈핏 라운드 니트입니다. 총기장 53cm, 가슴 단면 62cm로 여유 있게 입을 수 있습니다.",
    "line": "basic",
    "name": "알파카 혼방 루즈 라운드 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/ai-rm375-gray-hero-webp-5a5404b35ba8.webp",
    "price": 12900,
    "sheer": "살짝 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 2093,
    "badges": [],
    "colors": [
      "회색",
      "차콜",
      "파랑",
      "크림",
      "오렌지",
      "네온",
      "보라"
    ],
    "length": "총기장 53cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.5,
    "season": "FW",
    "status": "active",
    "measure": {
      "가슴": 62,
      "암홀": 22,
      "어깨": 56,
      "목깊이": 9,
      "목넓이": 22,
      "소매통": 19,
      "총기장": 53,
      "소매기장": 44,
      "소매밑단": 11
    },
    "reviews": [],
    "stretch": "좋음",
    "category": "니트",
    "colorHex": {
      "네온": "#A6BC35",
      "보라": "#7C4FA3",
      "차콜": "#555654",
      "크림": "#DED8C6",
      "파랑": "#2E78B0",
      "회색": "#999A97",
      "오렌지": "#C66E4B"
    },
    "material": "아크릴72 / 나일론13 / 알파카3 / 스판3",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/7594968064",
    "variants": [
      {
        "sku": "RM375-GRAY",
        "color": "회색",
        "stock": 299,
        "optionId": 27092503101
      },
      {
        "sku": "RM375-CHARCOAL",
        "color": "차콜",
        "stock": 300,
        "optionId": 27092503102
      },
      {
        "sku": "RM375-BLUE",
        "color": "파랑",
        "stock": 295,
        "optionId": 27092503103
      },
      {
        "sku": "RM375-CREAM",
        "color": "크림",
        "stock": 299,
        "optionId": 27092503104
      },
      {
        "sku": "RM375-ORANGE",
        "color": "오렌지",
        "stock": 300,
        "optionId": 27092503105
      },
      {
        "sku": "RM375-NEON",
        "color": "네온",
        "stock": 300,
        "optionId": 27092503106
      },
      {
        "sku": "RM375-PURPLE",
        "color": "보라",
        "stock": 300,
        "optionId": 27092503107
      }
    ],
    "listPrice": null,
    "styleCode": "RM375",
    "thickness": "도톰",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/7594968064",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "네온": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-neon-7e00c704068d.jpg",
        "verified": true
      },
      "보라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-purple-58daed484926.jpg",
        "verified": true
      },
      "차콜": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-charcoal-674075f96d2b.jpg",
        "verified": true
      },
      "크림": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-cream-2de7646f49e7.jpg",
        "verified": true
      },
      "파랑": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-blue-82ae6e23a956.jpg",
        "verified": true
      },
      "회색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-gray-c493f493d29a.jpg",
        "verified": true
      },
      "오렌지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-orange-0a65e9551627.jpg",
        "verified": true
      }
    },
    "reviewCount": 8,
    "detailImages": [
      {
        "alt": "오렌지 · 전체 실루엣 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/detail-1-ad1fe57b0706.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "네온 · 전체 실루엣 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/detail-2-ab8480397dec.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "보라 · 전체 실루엣 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/detail-3-a7ecd85638e7.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM375-GRAY",
        "kind": "photo",
        "color": "회색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-gray-c493f493d29a.jpg",
        "optionId": 27092503101,
        "verified": true
      },
      {
        "sku": "RM375-CHARCOAL",
        "kind": "photo",
        "color": "차콜",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-charcoal-674075f96d2b.jpg",
        "optionId": 27092503102,
        "verified": true
      },
      {
        "sku": "RM375-BLUE",
        "kind": "photo",
        "color": "파랑",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-blue-82ae6e23a956.jpg",
        "optionId": 27092503103,
        "verified": true
      },
      {
        "sku": "RM375-CREAM",
        "kind": "photo",
        "color": "크림",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-cream-2de7646f49e7.jpg",
        "optionId": 27092503104,
        "verified": true
      },
      {
        "sku": "RM375-ORANGE",
        "kind": "photo",
        "color": "오렌지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-orange-0a65e9551627.jpg",
        "optionId": 27092503105,
        "verified": true
      },
      {
        "sku": "RM375-NEON",
        "kind": "photo",
        "color": "네온",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-neon-7e00c704068d.jpg",
        "optionId": 27092503106,
        "verified": true
      },
      {
        "sku": "RM375-PURPLE",
        "kind": "photo",
        "color": "보라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-purple-58daed484926.jpg",
        "optionId": 27092503107,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "네온": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-neon-7e00c704068d.jpg",
          "verified": true
        },
        "보라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-purple-58daed484926.jpg",
          "verified": true
        },
        "차콜": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-charcoal-674075f96d2b.jpg",
          "verified": true
        },
        "크림": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-cream-2de7646f49e7.jpg",
          "verified": true
        },
        "파랑": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-blue-82ae6e23a956.jpg",
          "verified": true
        },
        "회색": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/ai-rm375-gray-hero-webp-5a5404b35ba8.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/ai-rm375-gray-fullbody-webp-d1c53b1f50d1.webp"
        },
        "오렌지": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/alpaca-round-knit/source-rm375-orange-0a65e9551627.jpg",
          "verified": true
        }
      },
      "defaultColor": "회색",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "popcorn-vneck-half",
    "fit": "기본핏",
    "sku": "10115610353",
    "sub": "팝콘 조직 · 브이넥 · 총기장 47cm",
    "care": "드라이크리닝 권장",
    "desc": "입체적인 팝콘 조직과 브이넥의 반팔 니트입니다. 총기장 47cm의 기본핏이며 스커트나 데님과 코디할 수 있습니다. 네크라인 깊이와 조직은 실물 사진에서 확인해 주세요.",
    "line": "basic",
    "name": "슬라브 팝콘 브이넥 반팔 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/ai-rm471-light-green-hero-webp-8ea81f81437a.webp",
    "price": 11900,
    "sheer": "약간 있음",
    "sizes": [
      "FREE"
    ],
    "stock": 1197,
    "badges": [],
    "colors": [
      "노랑",
      "연두",
      "베이지",
      "검정"
    ],
    "length": "총기장 47cm",
    "origin": "국산(경기도 광주시)",
    "rating": 3.25,
    "season": "SS",
    "status": "active",
    "measure": {
      "가슴": 45,
      "암홀": 20,
      "어깨": 40,
      "소매통": 17,
      "총기장": 47,
      "소매기장": 18,
      "소매밑단": 13
    },
    "reviews": [],
    "stretch": "있음",
    "category": "니트",
    "colorHex": {
      "검정": "#262628",
      "노랑": "#E4D990",
      "연두": "#B7CB9C",
      "베이지": "#C8BDA9"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/10115610353",
    "variants": [
      {
        "sku": "RM471-YELLOW",
        "color": "노랑",
        "stock": 299,
        "optionId": 39923620258
      },
      {
        "sku": "RM471-LIGHT-GREEN",
        "color": "연두",
        "stock": 300,
        "optionId": 39923620259
      },
      {
        "sku": "RM471-BEIGE",
        "color": "베이지",
        "stock": 299,
        "optionId": 39923620260
      },
      {
        "sku": "RM471-BLACK",
        "color": "검정",
        "stock": 299,
        "optionId": 39923620261
      }
    ],
    "listPrice": null,
    "styleCode": "RM471",
    "thickness": "보통",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/10115610353",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "검정": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-black-659fbdaf28c4.jpg",
        "verified": true
      },
      "노랑": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-yellow-d2f881b5d242.jpg",
        "verified": true
      },
      "연두": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-light-green-b8ef877890df.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-beige-1bb0dbd6d448.jpg",
        "verified": true
      }
    },
    "reviewCount": 4,
    "detailImages": [
      {
        "alt": "슬라브 팝콘 브이넥 반팔 니트 브이넥과 팝콘 조직 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/detail-1-ed231724c0e2.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "슬라브 팝콘 브이넥 반팔 니트 소매와 옆선 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/detail-2-548b12377b27.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "슬라브 팝콘 브이넥 반팔 니트 밑단과 조직 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/detail-3-e90e070c2a80.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM471-YELLOW",
        "kind": "photo",
        "color": "노랑",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-yellow-d2f881b5d242.jpg",
        "optionId": 39923620258,
        "verified": true
      },
      {
        "sku": "RM471-LIGHT-GREEN",
        "kind": "photo",
        "color": "연두",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-light-green-b8ef877890df.jpg",
        "optionId": 39923620259,
        "verified": true
      },
      {
        "sku": "RM471-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-beige-1bb0dbd6d448.jpg",
        "optionId": 39923620260,
        "verified": true
      },
      {
        "sku": "RM471-BLACK",
        "kind": "photo",
        "color": "검정",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-black-659fbdaf28c4.jpg",
        "optionId": 39923620261,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "검정": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-black-659fbdaf28c4.jpg",
          "verified": true
        },
        "노랑": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-yellow-d2f881b5d242.jpg",
          "verified": true
        },
        "연두": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/ai-rm471-light-green-hero-webp-8ea81f81437a.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/ai-rm471-light-green-fullbody-webp-c3cee42515ea.webp"
        },
        "베이지": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/popcorn-vneck-half/source-rm471-beige-1bb0dbd6d448.jpg",
          "verified": true
        }
      },
      "defaultColor": "연두",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "recycled-round-sweater",
    "fit": "루즈 · 박시핏",
    "sku": "9704215111",
    "sub": "리싸이클 혼방 · 보카시 결 · 총기장 56cm",
    "care": "드라이크리닝 권장",
    "desc": "라운드넥, 보카시 결, 립 마감의 니트입니다. 리싸이클 폴리가 포함된 혼방 원사를 사용했으며, 원사 특성상 피부에 거칠게 느껴질 수 있어 이너 티셔츠와 함께 착용하는 구성을 제안합니다.",
    "line": "basic",
    "name": "리싸이클 무지 박시 라운드 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/ai-rm418-olive-hero-webp-4c7ab5836e1c.webp",
    "price": 13900,
    "sheer": "비침 없음",
    "sizes": [
      "FREE"
    ],
    "stock": 1798,
    "badges": [],
    "colors": [
      "스카이",
      "곤색",
      "올리브",
      "모카",
      "그레이",
      "브라운"
    ],
    "length": "총기장 56cm",
    "origin": "국산(경기도 광주시)",
    "rating": 5,
    "season": "FW",
    "status": "active",
    "measure": {
      "가슴": 53,
      "암홀": 22,
      "어깨": 41,
      "목깊이": 9,
      "목넓이": 20,
      "소매통": 16,
      "총기장": 56,
      "소매기장": 56,
      "소매밑단": 9
    },
    "reviews": [],
    "stretch": "좋음",
    "category": "니트",
    "colorHex": {
      "곤색": "#3D465D",
      "모카": "#99877A",
      "그레이": "#8D8B8C",
      "브라운": "#6F605B",
      "스카이": "#9CB7C3",
      "올리브": "#6D735D"
    },
    "material": "리싸이클폴리 / 아크릴 / 폴리 / 울 / 스판",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/9704215111",
    "variants": [
      {
        "sku": "RM418-SKY",
        "color": "스카이",
        "stock": 300,
        "optionId": 37463670455
      },
      {
        "sku": "RM418-NAVY",
        "color": "곤색",
        "stock": 300,
        "optionId": 37463670456
      },
      {
        "sku": "RM418-OLIVE",
        "color": "올리브",
        "stock": 299,
        "optionId": 37463670457
      },
      {
        "sku": "RM418-MOCHA",
        "color": "모카",
        "stock": 300,
        "optionId": 37463670458
      },
      {
        "sku": "RM418-GRAY",
        "color": "그레이",
        "stock": 300,
        "optionId": 37463670460
      },
      {
        "sku": "RM418-BROWN",
        "color": "브라운",
        "stock": 299,
        "optionId": 37463670459
      }
    ],
    "listPrice": null,
    "styleCode": "RM418",
    "thickness": "도톰",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/9704215111",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "곤색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-navy-8e21aeab029e.jpg",
        "verified": true
      },
      "모카": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-mocha-d8764308671b.jpg",
        "verified": true
      },
      "그레이": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-gray-85503b55557b.jpg",
        "verified": true
      },
      "브라운": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-brown-62585530dbd6.jpg",
        "verified": true
      },
      "스카이": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-sky-30b033d8513d.jpg",
        "verified": true
      },
      "올리브": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-olive-59b0b4606f6c.jpg",
        "verified": true
      }
    },
    "reviewCount": 2,
    "detailImages": [
      {
        "alt": "리싸이클 무지 박시 라운드 니트 소매와 시보리 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/detail-1-019d42c9d00e.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "리싸이클 무지 박시 라운드 니트 몸판과 밑단 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/detail-2-d46934b5f01b.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "리싸이클 무지 박시 라운드 니트 라운드넥 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/detail-3-c70870754760.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM418-SKY",
        "kind": "photo",
        "color": "스카이",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-sky-30b033d8513d.jpg",
        "optionId": 37463670455,
        "verified": true
      },
      {
        "sku": "RM418-NAVY",
        "kind": "photo",
        "color": "곤색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-navy-8e21aeab029e.jpg",
        "optionId": 37463670456,
        "verified": true
      },
      {
        "sku": "RM418-OLIVE",
        "kind": "photo",
        "color": "올리브",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-olive-59b0b4606f6c.jpg",
        "optionId": 37463670457,
        "verified": true
      },
      {
        "sku": "RM418-MOCHA",
        "kind": "photo",
        "color": "모카",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-mocha-d8764308671b.jpg",
        "optionId": 37463670458,
        "verified": true
      },
      {
        "sku": "RM418-GRAY",
        "kind": "photo",
        "color": "그레이",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-gray-85503b55557b.jpg",
        "optionId": 37463670460,
        "verified": true
      },
      {
        "sku": "RM418-BROWN",
        "kind": "photo",
        "color": "브라운",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-brown-62585530dbd6.jpg",
        "optionId": 37463670459,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "곤색": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-navy-8e21aeab029e.jpg",
          "verified": true
        },
        "모카": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-mocha-d8764308671b.jpg",
          "verified": true
        },
        "그레이": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-gray-85503b55557b.jpg",
          "verified": true
        },
        "브라운": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-brown-62585530dbd6.jpg",
          "verified": true
        },
        "스카이": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/source-rm418-sky-30b033d8513d.jpg",
          "verified": true
        },
        "올리브": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/ai-rm418-olive-hero-webp-4c7ab5836e1c.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/recycled-round-sweater/ai-rm418-olive-fullbody-webp-70ec88a33b1d.webp"
        }
      },
      "defaultColor": "올리브",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "boucle-crop-cardigan",
    "fit": "크롭 · 기본핏",
    "sku": "6679667474",
    "sub": "라운드넥 · 버튼 여밈 · 총기장 42cm",
    "care": "드라이클리닝 권장",
    "desc": "보송한 부클 조직과 둥근 네크라인, 버튼 여밈을 갖춘 크롭 가디건. 긴소매와 총기장 42cm의 짧은 몸판을 하이웨스트 팬츠나 스커트에 맞춰 입기 좋습니다.",
    "line": "basic",
    "name": "부클 라운드 크롭 니트 가디건",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/thumbnail-f523344b.webp",
    "price": 12900,
    "sheer": "조금 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 1168,
    "badges": [],
    "colors": [
      "연두",
      "연밤",
      "베이지",
      "소라",
      "곤색"
    ],
    "length": "총기장 42cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.76,
    "season": "ALL",
    "status": "active",
    "measure": {
      "가슴": 51,
      "암홀": 20,
      "어깨": 37,
      "목깊이": 7,
      "목넓이": 18,
      "소매통": 14,
      "총기장": 42,
      "소매기장": 57,
      "소매밑단": 10
    },
    "reviews": [],
    "stretch": "조금 늘어남",
    "category": "가디건",
    "colorHex": {
      "곤색": "#333B50",
      "소라": "#A8BEC5",
      "연두": "#A6B58D",
      "연밤": "#A39183",
      "베이지": "#D1C3A8"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/6679667474",
    "variants": [
      {
        "sku": "RM277-LIGHT-GREEN",
        "color": "연두",
        "stock": 203,
        "optionId": 23228051024
      },
      {
        "sku": "RM277-WARM-TAUPE",
        "color": "연밤",
        "stock": 252,
        "optionId": 23228051025
      },
      {
        "sku": "RM277-BEIGE",
        "color": "베이지",
        "stock": 217,
        "optionId": 23228051026
      },
      {
        "sku": "RM277-SORA",
        "color": "소라",
        "stock": 252,
        "optionId": 23228051027
      },
      {
        "sku": "RM277-NAVY",
        "color": "곤색",
        "stock": 244,
        "optionId": 23228051028
      }
    ],
    "listPrice": null,
    "styleCode": "RM277",
    "thickness": "얇음",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/6679667474",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이클리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "곤색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-navy-c7852aadeb00.jpg",
        "verified": true
      },
      "소라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-sora-af31ff46763b.jpg",
        "verified": true
      },
      "연두": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-light-green-ce44fbdd9ec8.jpg",
        "verified": true
      },
      "연밤": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-warm-taupe-7ed5e507c686.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-beige-6341963ca184.jpg",
        "verified": true
      }
    },
    "reviewCount": 188,
    "detailImages": [
      {
        "alt": "연두 · 넥과 버튼 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-32-a6dba2df.webp",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "연두 · 부클 짜임 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-33-fc333a2e.webp",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "연두 · 소매 디테일 · 실물",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-34-4e0e2b67.webp",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM277-LIGHT-GREEN",
        "kind": "photo",
        "color": "연두",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-light-green-ce44fbdd9ec8.jpg",
        "optionId": 23228051024,
        "verified": true
      },
      {
        "sku": "RM277-WARM-TAUPE",
        "kind": "photo",
        "color": "연밤",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-warm-taupe-7ed5e507c686.jpg",
        "optionId": 23228051025,
        "verified": true
      },
      {
        "sku": "RM277-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-beige-6341963ca184.jpg",
        "optionId": 23228051026,
        "verified": true
      },
      {
        "sku": "RM277-SORA",
        "kind": "photo",
        "color": "소라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-sora-af31ff46763b.jpg",
        "optionId": 23228051027,
        "verified": true
      },
      {
        "sku": "RM277-NAVY",
        "kind": "photo",
        "color": "곤색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-crop-cardigan/source-rm277-navy-c7852aadeb00.jpg",
        "optionId": 23228051028,
        "verified": true
      }
    ],
    "photoVerified": true,
    "aiPresentation": {
      "colors": {
        "곤색": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-navy-cf275544.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/navy-03d60de0.webp"
        },
        "소라": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-sky-blue-695c7ae3.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/sky-blue-5c243d76.webp"
        },
        "연두": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-light-green-564d9c1c.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/light-green-ab501383.webp"
        },
        "연밤": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-warm-taupe-924733f1.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/warm-taupe-0ca757dc.webp"
        },
        "베이지": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-beige-3a724a3a.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/beige-16670535.webp"
        }
      },
      "editorial": {
        "looks": [
          {
            "id": "city-denim",
            "note": "가디건에 라이트 워시 데님, 아이보리 레트로 스니커즈, 초콜릿 숄더백을 매치합니다.",
            "items": [
              "라이트 워시 데님",
              "아이보리 레트로 스니커즈",
              "초콜릿 숄더백"
            ],
            "label": "라이트 데님 · 레트로 스니커즈",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/navy-03d60de0.webp",
              "소라": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/sky-blue-5c243d76.webp",
              "연두": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/light-green-ab501383.webp",
              "연밤": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/warm-taupe-0ca757dc.webp",
              "베이지": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-denim/beige-16670535.webp"
            },
            "occasion": "산책 · 카페"
          },
          {
            "id": "soft-skirt",
            "note": "가디건에 아이보리 새틴 롱스커트, 블랙 발레리나 플랫, 미니 토트백을 매치합니다.",
            "items": [
              "아이보리 새틴 롱스커트",
              "블랙 발레리나 플랫",
              "미니 토트백"
            ],
            "label": "새틴 롱스커트 · 발레리나 플랫",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/soft-skirt/navy-10598db9.webp",
              "소라": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/soft-skirt/sky-blue-b1a50dca.webp",
              "연두": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/soft-skirt/light-green-c0491570.webp",
              "연밤": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/soft-skirt/warm-taupe-bea1643b.webp",
              "베이지": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/soft-skirt/beige-bb2ff7ae.webp"
            },
            "occasion": "전시 · 주말 약속"
          },
          {
            "id": "city-mini",
            "note": "가디건에 차콜 A라인 미니스커트, 블랙 로퍼, 블랙 숄더백을 매치합니다.",
            "items": [
              "차콜 A라인 미니스커트",
              "블랙 로퍼",
              "블랙 숄더백"
            ],
            "label": "차콜 미니스커트 · 블랙 로퍼",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-mini/navy-93e3436f.webp",
              "소라": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-mini/sky-blue-e7cb40cc.webp",
              "연두": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-mini/light-green-ebbc83e7.webp",
              "연밤": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-mini/warm-taupe-93258d6f.webp",
              "베이지": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/city-mini/beige-543366f0.webp"
            },
            "occasion": "쇼핑 · 친구와 브런치"
          },
          {
            "id": "tailored",
            "note": "가디건에 크림 와이드 슬랙스, 블랙 포인티드 슬링백, 미니 토트백을 매치합니다.",
            "items": [
              "크림 와이드 슬랙스",
              "블랙 포인티드 슬링백",
              "구조적인 미니 토트"
            ],
            "label": "크림 와이드 슬랙스 · 슬링백",
            "images": {
              "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/tailored/navy-cc8388b7.webp",
              "소라": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/tailored/sky-blue-40354f1e.webp",
              "연두": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/tailored/light-green-f4950a99.webp",
              "연밤": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/tailored/warm-taupe-68422291.webp",
              "베이지": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/boucle-crop-cardigan/tailored/beige-c296d79c.webp"
            },
            "occasion": "출근 · 저녁 약속"
          }
        ],
        "details": [
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-32-a6dba2df.webp",
            "caption": "연두 · 넥과 버튼 · 실물"
          },
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-33-fc333a2e.webp",
            "caption": "연두 · 부클 짜임 · 실물"
          },
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/smartstore-v1/assets/original/detail-34-4e0e2b67.webp",
            "caption": "연두 · 소매 디테일 · 실물"
          }
        ],
        "colorStory": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/boards/boucle-crop-cardigan-99e8f075.webp",
        "turntables": {},
        "heroByColor": {
          "곤색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-navy-cf275544.webp",
          "소라": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-sky-blue-695c7ae3.webp",
          "연두": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-light-green-564d9c1c.webp",
          "연밤": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-warm-taupe-924733f1.webp",
          "베이지": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/boucle-crop-cardigan/hero-beige-3a724a3a.webp"
        },
        "measurements": [
          {
            "label": "총기장",
            "value": 42
          },
          {
            "label": "가슴",
            "value": 51
          },
          {
            "label": "어깨",
            "value": 37
          },
          {
            "label": "암홀",
            "value": 20
          },
          {
            "label": "목넓이",
            "value": 18
          },
          {
            "label": "목깊이",
            "value": 7
          },
          {
            "label": "소매기장",
            "value": 57
          },
          {
            "label": "소매통",
            "value": 14
          },
          {
            "label": "소매밑단",
            "value": 10
          }
        ],
        "measurementNote": "측정 방법에 따라 1~3cm 차이가 있을 수 있습니다.",
        "measurementUnit": "cm · 단면 기준"
      },
      "defaultColor": "베이지",
      "cropHasAiLabel": false
    }
  },
  {
    "id": "fisherman-crop-bustier",
    "fit": "슬림핏 · 크롭",
    "sku": "6600921594",
    "sub": "스퀘어넥 · 케이블 조직 · 총기장 40cm",
    "care": "드라이크리닝 권장",
    "desc": "스퀘어 네크라인과 세로 케이블 조직이 돋보이는 크롭 니트 뷔스티에. 티셔츠 위에 가볍게 겹쳐 입는 원사이즈 베스트입니다.",
    "line": "basic",
    "name": "피셔맨 케이블 크롭 니트 뷔스티에",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/ai-rm336-beige-hero-webp-b7812dbf2022.webp",
    "price": 10600,
    "sheer": "살짝 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 1150,
    "badges": [],
    "colors": [
      "베이지",
      "연밤",
      "소라",
      "검정"
    ],
    "length": "총기장 40cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.62,
    "season": "SS",
    "status": "active",
    "measure": {
      "가슴": 41,
      "암홀": 20,
      "어깨": 30,
      "목깊이": 14,
      "목넓이": 19,
      "총기장": 40
    },
    "reviews": [],
    "stretch": "보통",
    "category": "조끼",
    "colorHex": {
      "검정": "#28282A",
      "소라": "#8EA9B6",
      "연밤": "#9D8A7A",
      "베이지": "#C8B89D"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/6600921594",
    "variants": [
      {
        "sku": "RM336-BEIGE",
        "color": "베이지",
        "stock": 286,
        "optionId": 22892704426
      },
      {
        "sku": "RM336-WARM-TAUPE",
        "color": "연밤",
        "stock": 293,
        "optionId": 22892704427
      },
      {
        "sku": "RM336-SORA",
        "color": "소라",
        "stock": 290,
        "optionId": 22892704428
      },
      {
        "sku": "RM336-BLACK",
        "color": "검정",
        "stock": 281,
        "optionId": 22892704429
      }
    ],
    "listPrice": null,
    "styleCode": "RM336",
    "thickness": "보통",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/6600921594",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "검정": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-black-b920a9bb8e99.jpg",
        "verified": true
      },
      "소라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-sora-cb3eb6ad4a76.jpg",
        "verified": true
      },
      "연밤": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-warm-taupe-9be25fa2cf83.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-beige-5fee0c4220b9.jpg",
        "verified": true
      }
    },
    "reviewCount": 39,
    "detailImages": [
      {
        "alt": "피셔맨 케이블 크롭 니트 뷔스티에 스퀘어 네크라인과 케이블 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/detail-1-3ac38651bed1.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "피셔맨 케이블 크롭 니트 뷔스티에 몸판 케이블 조직 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/detail-2-d5a0e84d8f33.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "피셔맨 케이블 크롭 니트 뷔스티에 마네킹 옆면 핏 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/detail-3-59e76ca05412.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM336-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-beige-5fee0c4220b9.jpg",
        "optionId": 22892704426,
        "verified": true
      },
      {
        "sku": "RM336-WARM-TAUPE",
        "kind": "photo",
        "color": "연밤",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-warm-taupe-9be25fa2cf83.jpg",
        "optionId": 22892704427,
        "verified": true
      },
      {
        "sku": "RM336-SORA",
        "kind": "photo",
        "color": "소라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-sora-cb3eb6ad4a76.jpg",
        "optionId": 22892704428,
        "verified": true
      },
      {
        "sku": "RM336-BLACK",
        "kind": "photo",
        "color": "검정",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-black-b920a9bb8e99.jpg",
        "optionId": 22892704429,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "검정": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-black-b920a9bb8e99.jpg",
          "verified": true
        },
        "소라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-sora-cb3eb6ad4a76.jpg",
          "verified": true
        },
        "연밤": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/source-rm336-warm-taupe-9be25fa2cf83.jpg",
          "verified": true
        },
        "베이지": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/ai-rm336-beige-hero-webp-b7812dbf2022.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/fisherman-crop-bustier/ai-rm336-beige-fullbody-webp-82f977560bb2.webp"
        }
      },
      "defaultColor": "베이지",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "boucle-round-half-cardigan",
    "fit": "기본핏 · 크롭",
    "sku": "5565703580",
    "sub": "반팔 · 버튼 여밈 · 총기장 42cm",
    "care": "드라이크리닝 권장",
    "desc": "라운드넥과 짧은 소매, 단정한 버튼 여밈의 부클 크롭 가디건. 얇고 가벼운 조직으로 봄과 여름에 단품 또는 가벼운 겉옷으로 입습니다.",
    "line": "basic",
    "name": "부클 라운드 반팔 크롭 가디건",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/ai-rm279-light-green-hero-webp-f5085e7eb678.webp",
    "price": 11900,
    "sheer": "조금 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 1353,
    "badges": [],
    "colors": [
      "라임",
      "연두",
      "베이지",
      "소라",
      "곤색"
    ],
    "length": "총기장 42cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.81,
    "season": "SS",
    "status": "active",
    "measure": {
      "가슴": 51,
      "암홀": 20,
      "어깨": 37,
      "목깊이": 7,
      "목넓이": 19,
      "소매통": 15,
      "총기장": 42,
      "소매기장": 24,
      "소매밑단": 14
    },
    "reviews": [],
    "stretch": "조금 늘어남",
    "category": "가디건",
    "colorHex": {
      "곤색": "#30394B",
      "라임": "#BAC48F",
      "소라": "#A6BCC4",
      "연두": "#ADB88D",
      "베이지": "#D0C5B2"
    },
    "material": "아크릴 100%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/5565703580",
    "variants": [
      {
        "sku": "RM279-LIME",
        "color": "라임",
        "stock": 276,
        "optionId": 23227605688
      },
      {
        "sku": "RM279-LIGHT-GREEN",
        "color": "연두",
        "stock": 285,
        "optionId": 23227605689
      },
      {
        "sku": "RM279-BEIGE",
        "color": "베이지",
        "stock": 254,
        "optionId": 17756826744
      },
      {
        "sku": "RM279-SORA",
        "color": "소라",
        "stock": 262,
        "optionId": 17756826745
      },
      {
        "sku": "RM279-NAVY",
        "color": "곤색",
        "stock": 276,
        "optionId": 17756826748
      }
    ],
    "listPrice": null,
    "styleCode": "RM279",
    "thickness": "조금 얇음",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/5565703580",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "곤색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-navy-5cc5c438adb1.jpg",
        "verified": true
      },
      "라임": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-lime-71eccde5a3cc.jpg",
        "verified": true
      },
      "소라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-sora-2bcadf8d0dec.jpg",
        "verified": true
      },
      "연두": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-light-green-1afd3a4af8a4.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-beige-26c4ebcd5ce9.jpg",
        "verified": true
      }
    },
    "reviewCount": 89,
    "detailImages": [
      {
        "alt": "부클 라운드 반팔 크롭 가디건 마네킹 정면 핏 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/detail-1-faf9e5c8ff50.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "부클 라운드 반팔 크롭 가디건 버튼 여밈과 몸판 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/detail-2-5173c24e3bf8.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "부클 라운드 반팔 크롭 가디건 마네킹 뒷면 핏 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/detail-3-391efa7c3751.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM279-LIME",
        "kind": "photo",
        "color": "라임",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-lime-71eccde5a3cc.jpg",
        "optionId": 23227605688,
        "verified": true
      },
      {
        "sku": "RM279-LIGHT-GREEN",
        "kind": "photo",
        "color": "연두",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-light-green-1afd3a4af8a4.jpg",
        "optionId": 23227605689,
        "verified": true
      },
      {
        "sku": "RM279-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-beige-26c4ebcd5ce9.jpg",
        "optionId": 17756826744,
        "verified": true
      },
      {
        "sku": "RM279-SORA",
        "kind": "photo",
        "color": "소라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-sora-2bcadf8d0dec.jpg",
        "optionId": 17756826745,
        "verified": true
      },
      {
        "sku": "RM279-NAVY",
        "kind": "photo",
        "color": "곤색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-navy-5cc5c438adb1.jpg",
        "optionId": 17756826748,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "곤색": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-navy-5cc5c438adb1.jpg",
          "verified": true
        },
        "라임": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-lime-71eccde5a3cc.jpg",
          "verified": true
        },
        "소라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-sora-2bcadf8d0dec.jpg",
          "verified": true
        },
        "연두": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/ai-rm279-light-green-hero-webp-f5085e7eb678.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/ai-rm279-light-green-fullbody-webp-d4e69b1e1a9e.webp"
        },
        "베이지": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-round-half-cardigan/source-rm279-beige-26c4ebcd5ce9.jpg",
          "verified": true
        }
      },
      "defaultColor": "연두",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "boucle-fisher-vneck-vest",
    "fit": "루즈핏 · 크롭",
    "sku": "5548814040",
    "sub": "피셔 케이블 · 루즈핏 · 총기장 46cm",
    "care": "드라이크리닝 권장",
    "desc": "브이넥과 피셔 케이블 조직이 돋보이는 부클 니트 베스트. 여유 있는 품과 짧은 기장으로 티셔츠 위에 겹쳐 입기 좋습니다.",
    "line": "basic",
    "name": "부클 피셔 케이블 브이넥 베스트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/ai-rm274-light-gray-hero-webp-c0fc2d12ffc6.webp",
    "price": 9800,
    "sheer": "매우 조금 비침",
    "sizes": [
      "FREE"
    ],
    "stock": 1440,
    "badges": [],
    "colors": [
      "아이",
      "연두",
      "베이지",
      "소라",
      "연회색"
    ],
    "length": "총기장 46cm",
    "origin": "국산(경기도 광주시)",
    "rating": 4.7,
    "season": "SS",
    "status": "active",
    "measure": {
      "가슴": 55,
      "암홀": 22,
      "어깨": 41,
      "목깊이": 14,
      "목넓이": 25,
      "총기장": 46
    },
    "reviews": [],
    "stretch": "조금 늘어남",
    "category": "조끼",
    "colorHex": {
      "소라": "#AEB9CD",
      "아이": "#E3DDC8",
      "연두": "#B6C1A3",
      "베이지": "#C6B6A3",
      "연회색": "#B6B5B7"
    },
    "material": "아크릴 45% 폴리 55%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/5548814040",
    "variants": [
      {
        "sku": "RM274-IVORY",
        "color": "아이",
        "stock": 279,
        "optionId": 17657406194
      },
      {
        "sku": "RM274-LIGHT-GREEN",
        "color": "연두",
        "stock": 285,
        "optionId": 17657406201
      },
      {
        "sku": "RM274-BEIGE",
        "color": "베이지",
        "stock": 295,
        "optionId": 23225266490
      },
      {
        "sku": "RM274-SORA",
        "color": "소라",
        "stock": 292,
        "optionId": 17657406196
      },
      {
        "sku": "RM274-LIGHT-GRAY",
        "color": "연회색",
        "stock": 289,
        "optionId": 23225266491
      }
    ],
    "listPrice": null,
    "styleCode": "RM274",
    "thickness": "조금 두꺼움",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/5548814040",
    "careDetails": {
      "dry": "",
      "iron": "",
      "wash": "드라이크리닝 권장",
      "bleach": ""
    },
    "colorPhotos": {
      "소라": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-sora-ab8a58836af1.jpg",
        "verified": true
      },
      "아이": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-ivory-d8072308e0b6.jpg",
        "verified": true
      },
      "연두": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-light-green-bf9743492756.jpg",
        "verified": true
      },
      "베이지": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-beige-588916b4c5c6.jpg",
        "verified": true
      },
      "연회색": {
        "kind": "photo",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-light-gray-7be96e5ecd95.jpg",
        "verified": true
      }
    },
    "reviewCount": 37,
    "detailImages": [
      {
        "alt": "부클 피셔 케이블 브이넥 베스트 브이넥과 케이블 근접 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/detail-1-bc3b3bf9fcb3.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "부클 피셔 케이블 브이넥 베스트 마네킹 옆면 케이블 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/detail-2-55f51a9ffbbe.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      },
      {
        "alt": "부클 피셔 케이블 브이넥 베스트 마네킹 뒷면 핏 실물 상세",
        "url": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/detail-3-12ef2d6dff3a.jpg",
        "kind": "photo",
        "width": 860,
        "height": 860,
        "verified": true
      }
    ],
    "manufacturer": "걸스라미",
    "sourcePhotos": [
      {
        "sku": "RM274-IVORY",
        "kind": "photo",
        "color": "아이",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-ivory-d8072308e0b6.jpg",
        "optionId": 17657406194,
        "verified": true
      },
      {
        "sku": "RM274-LIGHT-GREEN",
        "kind": "photo",
        "color": "연두",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-light-green-bf9743492756.jpg",
        "optionId": 17657406201,
        "verified": true
      },
      {
        "sku": "RM274-BEIGE",
        "kind": "photo",
        "color": "베이지",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-beige-588916b4c5c6.jpg",
        "optionId": 23225266490,
        "verified": true
      },
      {
        "sku": "RM274-SORA",
        "kind": "photo",
        "color": "소라",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-sora-ab8a58836af1.jpg",
        "optionId": 17657406196,
        "verified": true
      },
      {
        "sku": "RM274-LIGHT-GRAY",
        "kind": "photo",
        "color": "연회색",
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-light-gray-7be96e5ecd95.jpg",
        "optionId": 23225266491,
        "verified": true
      }
    ],
    "photoVerified": false,
    "aiPresentation": {
      "colors": {
        "소라": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-sora-ab8a58836af1.jpg",
          "verified": true
        },
        "아이": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-ivory-d8072308e0b6.jpg",
          "verified": true
        },
        "연두": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-light-green-bf9743492756.jpg",
          "verified": true
        },
        "베이지": {
          "kind": "photo",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/source-rm274-beige-588916b4c5c6.jpg",
          "verified": true
        },
        "연회색": {
          "kind": "ai",
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/ai-rm274-light-gray-hero-webp-c0fc2d12ffc6.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/catalog-refresh-20261006/boucle-fisher-vneck-vest/ai-rm274-light-gray-fullbody-webp-51de4ec27b62.webp"
        }
      },
      "defaultColor": "연회색",
      "portraitCrop": true,
      "cropHasAiLabel": false
    }
  },
  {
    "id": "honey-loop-crop-knit",
    "eta": "",
    "fit": "",
    "sku": "RM382",
    "sub": "벌집 짜임 · 가슴 단면 58cm · 총기장 50cm",
    "care": "세탁 전 제품의 케어라벨을 확인해 주세요. 첫 세탁은 전문 세탁업체와 상담을 권장합니다. 소재별 세탁법 확인 전에는 고온 세탁·기계 건조·강한 비틀기를 피하고, 니트의 늘어짐에 주의해 주세요.",
    "desc": "벌집처럼 반복되는 짜임과 라운드 네크라인. 여유로운 몸판에 손등을 덮는 긴 소매를 더하고, 목둘레와 소매 끝, 밑단을 골지로 마무리한 라운드 니트입니다.",
    "line": "basic",
    "name": "허니루프 라운드 니트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/thumbnail-f39ebe89.webp",
    "price": 18700,
    "sheer": "",
    "sizes": [
      "미정"
    ],
    "stock": 100,
    "badges": [
      "NEW"
    ],
    "colors": [
      "크림",
      "카멜",
      "차콜",
      "스카이"
    ],
    "length": "",
    "origin": "대한민국",
    "rating": 0,
    "season": "",
    "status": "active",
    "measure": {
      "목깊이": 4,
      "목넓이": 22,
      "소매통": 18,
      "총기장": 50,
      "가슴넓이": 58,
      "소매기장": 51,
      "어깨넓이": 51
    },
    "reviews": [],
    "stretch": "",
    "category": "니트",
    "material": "리싸이클 폴리 52% · 폴리 25% · 나일론 11% · 울 8% · 스판 4%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/13795042666",
    "variants": [
      {
        "sku": "RM382-CREAM",
        "color": "크림",
        "stock": 25
      },
      {
        "sku": "RM382-CAMEL",
        "color": "카멜",
        "stock": 25
      },
      {
        "sku": "RM382-CHARCOAL",
        "color": "차콜",
        "stock": 25
      },
      {
        "sku": "RM382-SKY",
        "color": "스카이",
        "stock": 25
      }
    ],
    "listPrice": 0,
    "styleCode": "RM382",
    "thickness": "",
    "newRelease": true,
    "photoColor": "스카이",
    "releasedAt": "2026-10-03",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/13795042666",
    "colorPhotos": {
      "스카이": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/october-2026/honey-loop-crop-knit/front.jpg",
        "verified": true
      }
    },
    "reviewCount": 0,
    "sizePending": true,
    "detailImages": [],
    "manufacturer": "걸스라미",
    "pricePending": false,
    "photoVerified": false,
    "aiPresentation": {
      "model": {
        "hip": 90,
        "chest": 82,
        "label": "가상 모델 설정",
        "waist": 64,
        "height": 165,
        "weight": 50
      },
      "colors": {
        "차콜": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-charcoal-3050ac74.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/charcoal-84bd9bfd.webp"
        },
        "카멜": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-camel-253a7b42.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/camel-68fccfd1.webp"
        },
        "크림": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-cream-67661bfc.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/cream-91abc219.webp"
        },
        "스카이": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-sky-67ce9b85.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/sky-51437f2b.webp"
        }
      },
      "editorial": {
        "looks": [
          {
            "id": "city-denim",
            "note": "니트에 라이트 워시 데님, 아이보리 레트로 스니커즈, 초콜릿 숄더백을 매치합니다.",
            "items": [
              "라이트 워시 데님",
              "아이보리 레트로 스니커즈",
              "초콜릿 숄더백"
            ],
            "label": "라이트 데님 · 레트로 스니커즈",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/charcoal-84bd9bfd.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/camel-68fccfd1.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/cream-91abc219.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-denim/sky-51437f2b.webp"
            },
            "occasion": "산책 · 카페"
          },
          {
            "id": "soft-skirt",
            "note": "니트에 아이보리 새틴 롱스커트, 블랙 발레리나 플랫, 미니 토트백을 매치합니다.",
            "items": [
              "아이보리 새틴 롱스커트",
              "블랙 발레리나 플랫",
              "미니 토트백"
            ],
            "label": "새틴 롱스커트 · 발레리나 플랫",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/soft-skirt/charcoal-7bd3938f.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/soft-skirt/camel-2365159f.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/soft-skirt/cream-465adde9.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/soft-skirt/sky-b4df00ec.webp"
            },
            "occasion": "전시 · 주말 약속"
          },
          {
            "id": "city-mini",
            "note": "니트에 차콜 A라인 미니스커트, 블랙 로퍼, 블랙 숄더백을 매치합니다.",
            "items": [
              "차콜 A라인 미니스커트",
              "블랙 로퍼",
              "블랙 숄더백"
            ],
            "label": "차콜 미니스커트 · 블랙 로퍼",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-mini/charcoal-2997e712.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-mini/camel-86325221.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-mini/cream-82feae41.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/city-mini/sky-3f6f046b.webp"
            },
            "occasion": "쇼핑 · 친구와 브런치"
          },
          {
            "id": "tailored",
            "note": "니트에 크림 와이드 슬랙스, 블랙 포인티드 슬링백, 미니 토트백을 매치합니다.",
            "items": [
              "크림 와이드 슬랙스",
              "블랙 포인티드 슬링백",
              "구조적인 미니 토트"
            ],
            "label": "크림 와이드 슬랙스 · 슬링백",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/tailored/charcoal-2849ada0.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/tailored/camel-221b6c3c.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/tailored/cream-917467b6.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/looks/tailored/sky-fa2d0514.webp"
            },
            "occasion": "출근 · 저녁 약속"
          }
        ],
        "details": [
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/honey-loop-crop-knit/real-macro-1-a59df53e.webp",
            "caption": "스카이 · 실물 짜임"
          }
        ],
        "colorStory": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/board-8fd34a81.webp",
        "turntables": {
          "차콜": {
            "color": "차콜",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/000-8eca2fd8.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/045-312298c1.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/090-fff899d4.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/135-bad8ef41.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/180-70663c23.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/225-068564d1.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/270-4304321f.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/charcoal/315-94459d80.webp"
            ]
          },
          "카멜": {
            "color": "카멜",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/000-26afca88.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/045-10a11af6.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/090-825d5f12.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/135-629e6f8a.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/180-d996f273.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/225-942a54da.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/270-192eec63.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/camel/315-65de27f8.webp"
            ]
          },
          "크림": {
            "color": "크림",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/000-464a7ec1.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/045-5f3f6d03.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/090-7a7eddb9.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/135-2d280e01.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/180-8760fc8a.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/225-3e019a67.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/270-dfccf6c5.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/cream/315-7349ba51.webp"
            ]
          },
          "스카이": {
            "color": "스카이",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/000-4efe3ce4.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/045-657f4e2b.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/090-890013dc.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/135-9d9310a2.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/180-e45b29de.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/225-e7c0b623.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/270-55d86e1d.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/315-fff49875.webp"
            ]
          }
        },
        "heroByColor": {
          "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-charcoal-3050ac74.webp",
          "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-camel-253a7b42.webp",
          "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-cream-67661bfc.webp",
          "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/exports/hero-sky-67ce9b85.webp"
        },
        "measurements": [
          {
            "label": "총기장",
            "value": 50
          },
          {
            "label": "가슴넓이",
            "value": 58
          },
          {
            "label": "어깨넓이",
            "value": 51
          },
          {
            "label": "목넓이",
            "value": 22
          },
          {
            "label": "소매기장",
            "value": 51
          },
          {
            "label": "소매통",
            "value": 18
          },
          {
            "label": "목깊이",
            "value": 4
          }
        ],
        "measurementNote": "점주 제공 수치입니다. 측정 단위는 확인 중입니다.",
        "measurementUnit": ""
      },
      "turntable": {
        "color": "스카이",
        "angles": [
          0,
          45,
          90,
          135,
          180,
          225,
          270,
          315
        ],
        "frames": [
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/000-4efe3ce4.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/045-657f4e2b.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/090-890013dc.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/135-9d9310a2.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/180-e45b29de.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/225-e7c0b623.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/270-55d86e1d.webp",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/honey-correction-20261004-v4/turntable/sky/315-fff49875.webp"
        ]
      },
      "defaultColor": "스카이",
      "cropHasAiLabel": false
    },
    "manufactureDate": "2026년 10월",
    "measurementUnit": ""
  },
  {
    "id": "off-duty-vneck-knit-vest",
    "eta": "",
    "fit": "",
    "sku": "RM495",
    "sub": "V넥 · 골지 마감 · 총기장 46cm",
    "care": "세탁 전 제품의 케어라벨을 확인해 주세요. 첫 세탁은 전문 세탁업체와 상담을 권장합니다. 소재별 세탁법 확인 전에는 고온 세탁·기계 건조·강한 비틀기를 피하고, 니트의 늘어짐에 주의해 주세요.",
    "desc": "표면의 짜임이 드러나는 V넥 니트 베스트. 넓은 어깨와 크롭 길이, 골지 네크라인과 밑단이 실루엣을 정리합니다.",
    "line": "basic",
    "name": "오프듀티 V넥 니트 베스트",
    "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/thumbnail-0d2cb6ee.webp",
    "price": 12900,
    "sheer": "",
    "sizes": [
      "미정"
    ],
    "stock": 100,
    "badges": [
      "NEW"
    ],
    "colors": [
      "스카이",
      "차콜",
      "크림",
      "카멜",
      "회색"
    ],
    "length": "",
    "origin": "대한민국",
    "rating": 0,
    "season": "",
    "status": "active",
    "measure": {
      "목넓이": 25,
      "총기장": 46,
      "가슴넓이": 55,
      "앞목깊이": 14,
      "어깨넓이": 41
    },
    "reviews": [],
    "stretch": "",
    "category": "조끼",
    "material": "아크릴 72% · 나일론 13% · 울 9% · 알파카 3% · 스판 3%",
    "storeUrl": "https://smartstore.naver.com/girlsrami/products/13795688981",
    "variants": [
      {
        "sku": "RM495-SKY",
        "color": "스카이",
        "stock": 20
      },
      {
        "sku": "RM495-CHARCOAL",
        "color": "차콜",
        "stock": 20
      },
      {
        "sku": "RM495-CREAM",
        "color": "크림",
        "stock": 20
      },
      {
        "sku": "RM495-CAMEL",
        "color": "카멜",
        "stock": 20
      },
      {
        "sku": "RM495-GRAY",
        "color": "회색",
        "stock": 20
      }
    ],
    "listPrice": 0,
    "styleCode": "RM495",
    "thickness": "",
    "newRelease": true,
    "photoColor": "회색",
    "releasedAt": "2026-10-03",
    "smartstore": "https://smartstore.naver.com/girlsrami/products/13795688981",
    "colorPhotos": {
      "회색": {
        "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/october-2026/off-duty-vneck-knit-vest/front.jpg",
        "verified": true
      }
    },
    "reviewCount": 0,
    "sizePending": true,
    "detailImages": [],
    "manufacturer": "걸스라미",
    "pricePending": false,
    "photoVerified": false,
    "aiPresentation": {
      "model": {
        "hip": 90,
        "chest": 82,
        "label": "가상 모델 설정",
        "waist": 64,
        "height": 165,
        "weight": 50
      },
      "colors": {
        "차콜": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-charcoal-a0a4bd05.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/charcoal-201336e3.webp"
        },
        "카멜": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-camel-a2f0f3c7.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/camel-a570f2d1.webp"
        },
        "크림": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-cream-8cfffee1.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/cream-660e69d1.webp"
        },
        "회색": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-gray-979a3c86.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/gray-52bce39b.webp"
        },
        "스카이": {
          "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-sky-4b338869.webp",
          "fullBody": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/sky-54519f0f.webp"
        }
      },
      "editorial": {
        "looks": [
          {
            "id": "city-denim",
            "note": "화이트 티셔츠 위에 베스트를 겹치고 라이트 워시 데님, 아이보리 레트로 스니커즈, 초콜릿 숄더백을 매치합니다.",
            "items": [
              "화이트 티셔츠",
              "라이트 워시 데님",
              "아이보리 레트로 스니커즈",
              "초콜릿 숄더백"
            ],
            "label": "화이트 티 · 라이트 데님",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/charcoal-201336e3.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/camel-a570f2d1.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/cream-660e69d1.webp",
              "회색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/gray-52bce39b.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-denim/sky-54519f0f.webp"
            },
            "occasion": "산책 · 카페"
          },
          {
            "id": "soft-skirt",
            "note": "화이트 셔츠 위에 베스트를 겹치고 아이보리 새틴 롱스커트, 블랙 발레리나 플랫, 미니 토트백을 매치합니다.",
            "items": [
              "화이트 셔츠",
              "아이보리 새틴 롱스커트",
              "블랙 발레리나 플랫",
              "미니 토트백"
            ],
            "label": "화이트 셔츠 · 새틴 롱스커트",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/charcoal-6a4748f8.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/camel-9c46c383.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/cream-d514cf71.webp",
              "회색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/gray-31e62952.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/soft-skirt/sky-82ee5a0e.webp"
            },
            "occasion": "전시 · 주말 약속"
          },
          {
            "id": "city-mini",
            "note": "블루 스트라이프 셔츠 위에 베스트를 겹치고 차콜 A라인 미니스커트, 블랙 로퍼, 블랙 숄더백을 매치합니다.",
            "items": [
              "블루 스트라이프 셔츠",
              "차콜 A라인 미니스커트",
              "블랙 로퍼",
              "블랙 숄더백"
            ],
            "label": "스트라이프 셔츠 · 미니스커트",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/charcoal-6a7578e3.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/camel-7c591911.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/cream-85eaa509.webp",
              "회색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/gray-5f9b8593.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/city-mini/sky-64daf3af.webp"
            },
            "occasion": "쇼핑 · 친구와 브런치"
          },
          {
            "id": "tailored",
            "note": "화이트 셔츠 위에 베스트를 겹치고 크림 와이드 슬랙스, 블랙 포인티드 슬링백, 미니 토트백을 매치합니다.",
            "items": [
              "화이트 셔츠",
              "크림 와이드 슬랙스",
              "블랙 포인티드 슬링백",
              "구조적인 미니 토트"
            ],
            "label": "화이트 셔츠 · 크림 와이드 슬랙스",
            "images": {
              "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/charcoal-8fb11d8a.webp",
              "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/camel-7a2e4b2a.webp",
              "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/cream-94955b6b.webp",
              "회색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/gray-b7cfde19.webp",
              "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/looks/off-duty-vneck-knit-vest/tailored/sky-3d1fae49.webp"
            },
            "occasion": "출근 · 저녁 약속"
          }
        ],
        "details": [
          {
            "image": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/real-macro-1-9f18d696.webp",
            "caption": "회색 · 실물 짜임"
          }
        ],
        "colorStory": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/boards/off-duty-vneck-knit-vest-e6d5971d.webp",
        "turntables": {
          "차콜": {
            "color": "차콜",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/000-154c8c69.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/045-defbdda1.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/090-0d6b8040.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/135-480e1765.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/180-2b2447f4.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/225-b150d47c.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/270-4ca55b3b.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/charcoal/315-be72e55d.webp"
            ]
          },
          "카멜": {
            "color": "카멜",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/000-3ccf1e6a.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/045-159e39a3.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/090-fe56028e.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/135-5e940ebd.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/180-2e9deef5.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/225-981e222c.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/270-713c24fa.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/camel/315-d3d61ee6.webp"
            ]
          },
          "크림": {
            "color": "크림",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/000-a514c90b.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/045-5f96005c.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/090-1bd2644c.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/135-2910db37.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/180-ba3f9cc1.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/225-186e94a3.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/270-0d5b86dd.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/cream/315-5d8e0063.webp"
            ]
          },
          "회색": {
            "color": "회색",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/000-bebc1d0f.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/045-01d83f04.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/090-bd858355.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/135-209e4565.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/180-88e414d5.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/225-fd023797.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/270-0a405f12.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/ai-fitting-v2/assets/off-duty-vneck-knit-vest/315-dc176a67.webp"
            ]
          },
          "스카이": {
            "color": "스카이",
            "angles": [
              0,
              45,
              90,
              135,
              180,
              225,
              270,
              315
            ],
            "frames": [
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/000-0a5d91d4.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/045-8f503092.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/090-2bd40414.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/135-df6dd4ff.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/180-ac665a4f.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/225-5c2fb002.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/270-42e6aefc.webp",
              "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/assets/turntable/off-duty-vneck-knit-vest/sky/315-56f0e493.webp"
            ]
          }
        },
        "heroByColor": {
          "차콜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-charcoal-a0a4bd05.webp",
          "카멜": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-camel-a2f0f3c7.webp",
          "크림": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-cream-8cfffee1.webp",
          "회색": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-gray-979a3c86.webp",
          "스카이": "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/editorial-20261003-v3/exports/off-duty-vneck-knit-vest/hero-sky-4b338869.webp"
        },
        "measurements": [
          {
            "label": "총기장",
            "value": 46
          },
          {
            "label": "가슴넓이",
            "value": 55
          },
          {
            "label": "어깨넓이",
            "value": 41
          },
          {
            "label": "목넓이",
            "value": 25
          },
          {
            "label": "앞목깊이",
            "value": 14
          }
        ],
        "measurementNote": "점주 제공 수치입니다. 측정 단위는 확인 중입니다.",
        "measurementUnit": ""
      },
      "turntable": {
        "color": "회색",
        "angles": [
          0,
          45,
          90,
          135,
          180,
          225,
          270,
          315
        ],
        "frames": [
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/000.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/045.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/090.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/135.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/180.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/225.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/270.png",
          "https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/ai-fitting-20261003-v2/assets/off-duty-vneck-knit-vest/315.png"
        ]
      },
      "defaultColor": "회색",
      "cropHasAiLabel": false
    },
    "manufactureDate": "2026년 10월",
    "measurementUnit": ""
  }
];

GR.CATEGORIES = ['전체','니트','가디건','조끼','원피스','세트','액세서리'];

GR.fmt = n => n.toLocaleString('ko-KR') + '원';
GR.byId = id => GR.PRODUCTS.find(p => p.id === id);
GR.discount = p => p.listPrice ? Math.round((1 - p.price / p.listPrice) * 100) : 0;

