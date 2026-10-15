# 이전 F/W 테스트 이미지 배포 후 확인 — 2026-10-15

아래 8개 URL은 삭제된 테스트 이미지다. 배포 후 각 URL의 **최종 HTTP 상태가 404**인지 확인한다. `200 text/html` 홈 화면이나 관련 없는 판매 상품으로의 리디렉션은 정상 결과가 아니다. 404 본문에는 판매 상품 바로가기가 있어야 한다. 이 목록은 확인 대상이며 배포 후 성공 기록을 대신하지 않는다.

| URL | 기대 상태 |
|---|---|
| https://girlslami.com/p-wool-cable-regular.jpg | 404 |
| https://girlslami.com/p-cashmere-turtle.jpg | 404 |
| https://girlslami.com/p-alpaca-long-cardigan.jpg | 404 |
| https://girlslami.com/p-knit-dress.jpg | 404 |
| https://girlslami.com/p-vest-long-boucle.jpg | 404 |
| https://girlslami.com/p-knit-set.jpg | 404 |
| https://girlslami.com/p-wool-muffler.jpg | 404 |
| https://girlslami.com/p-halfzip.jpg | 404 |

기존 `product.html?id=wool-rib-muffler` 같은 query URL은 실제 존재하는 공통 상품 파일이다. 해당 페이지의 판매 종료 안내·`noindex,follow,noimageindex`·현재 판매 상품 링크를 별도로 확인하며, 위 이미지 404 검사와 섞지 않는다. 옛 가상상품의 동일한 판매 대체품은 확인되지 않아 임의의 상품으로 301을 연결하지 않는다.
