# Storefront detail coverage — 2026-10-15

This release uses one storefront detail renderer and `detail-catalog.js` for the twelve real products whose public catalog status was `active` on 2026-10-15. New-product drafts and F/W demonstration items are excluded from the production detail content manifest.

## Current sale products

| Code | Product | Outfit images | Model 360° | Product-only 360° | Actual eight-angle photos |
|---|---|---|---|---|---|
| RM375 | 알파카 혼방 루즈 라운드 니트 | One reference color / one generated styling | — | — | — |
| RM277 | 부클 라운드 크롭 니트 가디건 | 4 outfits × 5 colors | — | — | — |
| RM274 | 부클 피셔 케이블 브이넥 베스트 | One reference color / one generated styling | — | — | — |
| RM279 | 부클 라운드 반팔 크롭 가디건 | One reference color / one generated styling | — | — | — |
| RM385 | 케이블 브이넥 꽈배기 니트 | One reference color / one generated styling | — | — | — |
| RM336 | 피셔맨 케이블 크롭 니트 뷔스티에 | One reference color / one generated styling | — | — | — |
| RM382 | 허니루프 라운드 니트 | 4 outfits × 4 colors | 4 colors × 8 frames | — | Local originals exist; production manifest uses public front photo |
| RM495 | 오프듀티 V넥 니트 베스트 | 4 outfits × 5 colors | 5 colors × 8 frames | 5 colors × 8 frames | Gray sample, 8 originals |
| RM471 | 슬라브 팝콘 브이넥 반팔 니트 | One reference color / one generated styling | — | — | — |
| RM418 | 리싸이클 무지 박시 라운드 니트 | One reference color / one generated styling | — | — | — |
| RM401 | 단가라 케이블 세미크롭 반팔 니트 | 1 outfit × all 5 colors | 5 colors × 8 views | 5 colors × 8 views | Separate actual front photos for all 5 colors |
| RM429 | 뮤트레이어 V넥 니트 베스트 | 4 outfits × 6 colors | — | — | — |

Every product has real-photo references and detail photographs, but these do not cover every sale color: RM382 has a public Sky front photo, and RM495 has the Gray eight-angle set. A source photo collection is not automatically a complete eight-angle set. Do not create a false rotation by repeating stills or mirroring opposite sides. Show controls only when the actual corresponding assets are available.

The RM495 product-only sheets are generated studio references based on actual photographs. Each sheet is 1254 × 1254 pixels containing four 627 × 627 cells. Front sheet order: 0°, 45°, 90°, 135°. Back sheet order: 180°, 225°, 270°, 315°. They are not pixel-preserving manual cutouts or a verified color calibration.

## Selected hero images for this release

### RM401 completion, 2026-10-15

The first rollout connected a Sky hero only and left four colors without model styling and all five colors without rotation media. This correction adds complete coverage for 곤색 / 베이지 / 초록 / 하늘 / 연핑: five standalone styling images, ten model rotation sheets and ten floating product rotation sheets. The existing Sky hero is retained; four matching color heroes and all twenty rotation sheets are newly generated from the actual product photographs and approved adult model reference.

Each rotation uses two 2×2 sheets, ordered 0° / 45° / 90° / 135° and 180° / 225° / 270° / 315°. The renderer measures actual sheet dimensions, preserves portrait model proportions, and limits zoom to native cell size. No frames are produced by mirroring. The real source collection has front and oblique photographs, not a photographed eight-angle set: generated back/side views are visual reconstructions, not new physical measurements or pixel-preserving cutouts. Actual source photos remain separately available via “실물 사진 보기”. The existing image notice covers generated model and studio images.

Runtime assets are versioned under `assets/detail/stripe-cable-half/v2/`. Full local prompts, source files and manifests are under `rm401-complete-20261015/`; the selected-file inventory is `docs/RM401-MEDIA-20261015.json`. Completing RM401 does not change the remaining gaps in other product rows above.

### Initial rollout selection

The approved selection is **eight newly generated hero images and four preserved existing hero images**. This count applies to the representative thumbnail/hero only; it does not mean every outfit, color or rotation frame was regenerated with one face.

- New reference-based hero: RM375, RM277, RM274, RM279, RM385, RM336, RM471, RM401 (`hero-reference-v1.webp`).
- Preserved garment-faithful hero: RM382, RM495, RM418, RM429 (`hero-preserved-v1.webp`). Their attempted new generations introduced unwanted garment texture and were not selected for public use.
- Existing outfit matrices and model rotation frames remain in use. The approved character sheet guided the new hero work; full identity replacement across all existing media is not claimed.

Selection evidence is the local `rollout-20261015/hero-generation-record.json`; the deployed selection is declared in `detail-catalog.js`.

## New nine products: local drafts

JO23, JO24, JO31, JO32, RM542, RM543, RM567, RM576 and RM582 have three model outfit images, an actual eight-angle set, a studio mannequin eight-angle set and a WebP rotation animation. These are sample-color images; they do not yet cover all eleven production colors or model/product-only 360° in every color.

Their approved prices are JO23/JO24/JO32 23,900 KRW, JO31 22,900 KRW, RM542 19,900 KRW, RM543 20,900 KRW, RM567 17,900 KRW, RM576 21,900 KRW and RM582 23,900 KRW. The user confirmed FREE and cm for these nine products.

JO23 has SmartStore product ID 13808633770, but the registration was withdrawn to stopped/hidden status on 2026-10-13. The other eight have no verified purchase URLs. All nine remain **local-only and unavailable for purchase in this rollout**. They are excluded from the production detail manifest, static product pages and sitemap. JO23 is not a completed new sale listing; the other eight have not been registered with verified purchase URLs. Adding them later requires actual registration and approval of their sale-ready detail content.

## Data boundaries

- RM495: FREE / cm confirmed by the user. The approved local detail data takes the confirmed value.
- RM382: FREE / cm separately confirmed by the user on 2026-10-15. The detail manifest now uses `size: "FREE"`, `sizeUnit: "cm"`, and `measurementVerified: true`; existing numeric measurements are unchanged. This confirmation supersedes the earlier pending note.
- The initial live-catalog snapshot had pending-size data for RM382/RM495. Display confirmation and a backend option update are separate: the cart stays disabled whenever the current backend size list does not contain the displayed size. Do not claim a backend update from the document or manifest alone.
- RM375: the source material text totals 91%. Preserve it; do not infer the missing 9% from another garment.
- RM418: fiber names are known, composition percentages are not. Do not claim a 100% verified blend.
- RM429: own-site catalog price is 19,900 KRW; its separately recorded Naver price is 16,800 KRW. Preserve channel-specific pricing.
- Production capacity is not independently verified physical inventory. This rollout does not change stock or register new products.

## Media and loading

The current local RM495 package contains 28 files, 77,339,442 bytes in total, including the selected preserved hero. This is the 2026-10-15 pre-deployment packaging snapshot, not a fixed future size limit. The actual eight-angle originals account for about 50.56 MiB and must load only when the customer explicitly opens a real-photo view. Product rotation sheets must load only for the selected product/color; no eager fetch of all colors. Existing public outfit/rotation photographs are reused.

New and future model imagery should use the approved model reference sheet as identity guidance, keeping hairstyle and left/right anatomy consistent. Use natural skin color and healthy-looking lighting without changing the actual garment's fit, texture or color. Generated model photographs remain styling references and are disclosed once in the page's image notice.
