# 걸스라미 자사몰

운영 주소는 https://girlslami.com 입니다. GitHub `anthonykim3197/girlsrami`와 연결된 Cloudflare Pages에서 정적 HTML/CSS/JavaScript를 제공합니다. 결제는 각 상품의 스마트스토어 페이지로 연결합니다.

## 빌드

`npm run build`는 공개 파일만 `dist/`에 복사하고, 실제 판매 12종의 정적 상품 페이지와 sitemap을 생성합니다. `assets/detail/`은 재귀 복사하며 파일 크기와 누락된 로컬 참조를 검사합니다. 비밀값, 촬영 작업폴더, 테스트 자료는 배포하지 않습니다.

## 상품 상세페이지

- `detail-catalog.js`: 상품별 카피, 코디, 색상, 사진과 검증된 실측 정보.
- `standard-detail.js`, `standard-detail.css`: 승인된 공통 상세페이지와 확대·색상·회전 동작.
- `app.js`, `catalog.css`: 홈·목록·상품 카드와 공통 화면.
- `seo-products.json`, `scripts/build.mjs`: 판매 상품의 정적 검색 정보.
- `member.js`: 기존 회원·관리·장바구니 기능. 운영 상품은 Supabase에서 읽습니다.
- `docs/STOREFRONT-CONTENT-STANDARD.md`: 썸네일·카피·이미지·실측 제작 기준.

이번 적용은 기존 판매 12종입니다. 대표 이미지는 새로 만든 8종과 기존 승인본을 유지한 4종으로 구성하며, 모든 코디·색상·회전 프레임을 새 얼굴로 교체한 것은 아닙니다. 모델 360도는 RM382 4색과 RM495 5색, 제품 단독 360도는 RM495 5색에 준비되어 있습니다.

RM382와 RM495는 각각 점주가 FREE / cm를 확인했습니다. 확인된 표시는 상세 매니페스트에 반영하며, 운영 장바구니의 사이즈 옵션 갱신 여부는 별도로 확인합니다. 신규 JO23·JO24·JO31·JO32·RM542·RM543·RM567·RM576·RM582는 로컬 시안으로만 유지하고 이번 공개 목록·상품 페이지·sitemap에 넣지 않습니다. JO23은 이전 등록 후 판매·전시 중지 상태이고 나머지 8종은 검증된 구매 URL이 없습니다.

새 상품은 실제 판매 상태와 구매 URL을 확인한 뒤 카탈로그에 추가합니다. 없는 코디·회전·색상 이미지를 다른 자료로 가장하지 않습니다. 실물 원본은 필요할 때 불러오고 모델 연출 안내는 상세 하단에 한 번 표시합니다.

## 검색 및 오류 페이지

가상 F/W 상품은 공개 목록과 sitemap에 포함하지 않습니다. 루트 `404.html`은 없는 URL을 홈 화면으로 반환하던 Cloudflare Pages의 SPA fallback을 방지합니다. 삭제한 이미지도 실제 404로 응답해야 합니다. 배포 후 확인할 8개 경로는 `docs/LEGACY-IMAGE-404-CHECK-20261015.md`에 정리했습니다.

## 검증

`npm run build` 후 `node --test tests/storefront-seo.test.mjs tests/catalog-presentation.test.mjs tests/ai-media.test.mjs tests/personal-fitting-removal.test.mjs tests/admin-inventory.test.mjs`를 실행합니다. 배포 전 PC·모바일에서 색상, 코디, 회전, 확대, 문의, 공유 및 구매 링크를 확인합니다.

현재 미디어 범위와 배포 근거는 `docs/STOREFRONT-DETAIL-COVERAGE-20261015.md`, `docs/DEPLOYMENT-AUDIT-20261015.md`를 참고하세요.
