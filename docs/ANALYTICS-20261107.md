# 걸스라미 방문·구매 이동 측정

운영 기준 소스: `anthonykim3197/girlsrami`의 `d633b730a91189dd6c99a86fd515aff920bd1ac4`. 작업은 별도 `codex/analytics-mobile-20261107` worktree에서 수행했다. 기존 `site-fix`의 별도 미배포 커밋 및 원본 dirty 파일은 포함하지 않았다.

## 측정과 해석

| 이벤트 | 기록 시점 | 의미 |
|---|---|---|
| `page_view` | 공개 페이지가 보일 때 문서당 1회 | 페이지 조회, 사람 수 아님 |
| `product_detail_view` | 실제 상품 렌더러 바인딩 후 문서·상품당 1회 | 상품 상세 조회 |
| `option_select` | 상품 색상 버튼을 눌렀을 때 | 자사몰에서 색상 확인·선택 |
| `size_select` | 사이즈 버튼을 눌렀을 때 | 자사몰 사이즈 버튼 사용 |
| `buy_cta_click` | 명시적 구매 CTA 클릭 | 구매 의도를 나타내는 클릭 |
| `smartstore_outbound_click` | 허용된 걸스라미 스마트스토어 링크 클릭 | 외부 페이지를 열려는 시도, 도착/결제 보장 아님 |

구매 CTA 클릭에는 상세, 모바일 하단, 장바구니 위치가 붙는다. 후기·안내·헤더 링크는 구매 CTA로 취급하지 않는다. 구매 클릭 1회는 외부 이동에도 포함되므로 두 수치를 합산하지 않는다. 최종 주문과 매출은 연결이 없으므로 항상 `unknown`, `count: null`이며 구매 이벤트를 생성하지 않는다. 자사몰 선택 옵션은 스마트스토어에 자동 전달되지 않는다.

브라우저 세션은 탭의 `sessionStorage`에 만든 임시 난수이며 마지막 행동으로부터 30분 뒤 새 세션이 된다. 별도 탭·저장 차단·재방문 등으로 실제 사람 수와 다르다. JavaScript를 실행하지 않는 봇/차단 브라우저는 누락되며, JavaScript 자동화·위조 이벤트를 완전히 배제할 수 없다. 알려진 bot/crawler/spider/headless UA는 수집 서버에서 버리지만 이 필터만으로 사람이 확인됐다고 말하지 않는다.

## 데이터와 접근

- `analytics.js` → 동일 출처 `/api/analytics` → 독립 Cloudflare D1 `analytics_events`.
- 세션 첫 진입의 referrer **호스트만**, `utm_source`, `utm_medium`, `utm_campaign`을 저장. 캠페인 값은 영문·숫자·`_ . -` 최대 80자 코드만 허용하며 나머지 값은 버린다.
- 원문 URL, 쿼리, 검색어, 이름, 이메일, IP, 로그인 ID, 신체 정보, 주문·결제 정보는 분석 테이블에 저장하지 않는다. 상품 옵션도 제한된 문자열 형식만 허용한다.
- 관리자/계정/비밀번호 재설정 화면은 제외. DNT, Global Privacy Control, 개인정보 페이지의 행동분석 제외 설정을 따른다.
- 서버가 타임스탬프를 부여하고 UUID 이벤트 ID를 unique 처리. 동일 이벤트 재전송은 1건. 세션당 최근 하루 500건 제한.
- 새 이벤트를 받을 때 90일보다 오래된 원시 행을 삭제한다. 서비스가 중단되어 수집이 없으면 다음 수집 때 정리된다. 화면은 최근 1/7/30일만 집계한다.
- 통계 API는 `Bearer`를 기존 Supabase `is_admin` RPC에 전달해 **서버에서** 관리자 여부를 확인한다. 공개 집계나 브라우저 주장에 근거한 권한 우회가 없다. 응답은 `Cache-Control: no-store`.
- 상품·계정·장바구니 DB 스키마와 데이터는 변경하지 않는다. Supabase 관리용 비밀 키는 필요 없다.

## 확인 화면

`/analytics.html`을 열면 관리자 로그인 후 최근 24시간/7일/30일의 상품별·유입별·한국 날짜별 집계를 볼 수 있다. 기존 상품 관리 화면 하단에 진입 링크가 있다.

확인 모드에서는 실제 화면을 클릭하되 이벤트를 해당 탭 안에만 저장한다.

1. `/analytics.html`에서 **확인 모드 시작**.
2. **상품 목록 열기** → 원하는 상품 → 색상/사이즈 선택 → 구매 버튼.
3. 새 탭의 목적지가 상품에 맞는지 확인하고 원래 탭으로 돌아온다.
4. 원래 탭에서 `/analytics.html` → **확인 기록 새로고침**.
5. 상품 상세 1회, 색상·사이즈 버튼 횟수, 구매 클릭 및 외부 이동의 위치를 확인한다.
6. **확인 모드 종료**. 확인 모드 기록은 운영 D1에 보내지 않는다.

공개 상품 URL에 `?analytics_debug=1`을 붙여도 확인 모드를 시작한다. 일반 방문의 과거 데이터나 다른 이용자의 행동을 되살리는 도구는 아니다.

## 기존 Cloudflare 지표

2026-11-07 운영 브라우저에서 자동 주입된 `static.cloudflareinsights.com/beacon.min.js`를 발견했지만, 기존 `script-src 'self'` CSP가 실행을 차단했다. 콘솔 보안 오류와 resource `status: 0`을 확인했다. 이번 변경은 기존 자동 주입을 유지하고 그 스크립트 도메인 및 `cloudflareinsights.com` 연결만 CSP에 추가한다. 별도 beacon 태그를 중복 삽입하지 않는다.

과거 14,850 페이지뷰의 정확한 원천·집계 설정·시점과 봇 비중은 이번 소스 검사로 확정할 수 없다. 새 행동 통계의 수집 시작 이전 값은 소급해 만들지 않는다.

## 재현

Node.js 22 이상(검증 환경 26.5.0), Wrangler 4.149.0을 사용했다. 일반 storefront 빌드는 패키지 설치가 필요 없는 정적 빌드다.

```sh
npm run build
npm run test:storefront
npm run test:admin
npm run test:analytics
npm run test:links
npx wrangler@4.149.0 d1 execute ANALYTICS --local --file analytics/schema.sql
npx wrangler@4.149.0 pages dev dist --port 8895
```

`test:analytics`는 실제 SQLite로 저장·중복제거·집계를 검증한다. `test:links`는 빌드 후 실행한다. 로컬 개발은 `--remote`를 쓰지 않는다.

## 모바일 변경

640px 이하에서 구매 버튼과 옵션으로 돌아가는 링크를 고정했다. 선택한 색상·사이즈를 표시하며 스마트스토어에서 다시 골라야 함을 명시한다. safe-area 공간과 바닥 여백을 두고 상담 버튼과 겹치지 않게 이동했다. 색상·사이즈 버튼은 최소 44px 터치 영역이다. 구매 안내 화면의 ‘톡톡 상담하기’ 목적지를 실제 톡톡으로 수정했다.

## 운영 반영 및 롤백

운영 반영 절차와 실제 상태는 배포 기록을 확인한다. 새 D1만 만들고 기존 상품 데이터에는 접근하지 않는다. 먼저 DB 스키마를 적용한 다음 코드와 D1 binding을 함께 배포한다. 원격 DB ID가 `00000000-0000-4000-8000-000000000000`인 개발 자리표시 상태로는 배포하지 않는다.

복구 시 Cloudflare Pages에서 직전 `d633b73`에 연결된 성공 배포로 rollback하거나 이 기능 커밋을 `git revert`하여 Git 배포를 실행한다. 원본 리포지터리에 `reset --hard`를 하지 않는다. 신규 D1은 복구 후에도 보존해 자료 손실을 피한다. 수집 API가 없어져도 이벤트 전송 실패가 구매 이동을 막지 않는다. 이전 버전으로 롤백하면 기존 Cloudflare CSP 차단도 돌아온다.

참고: [Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [D1 CLI](https://developers.cloudflare.com/d1/wrangler-commands/), [Cloudflare 자동 Web Analytics 설정](https://developers.cloudflare.com/web-analytics/get-started/).
