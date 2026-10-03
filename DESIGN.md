# Girlsrami member, fitting and administration design

## Editorial product revision (2026-10-03, supersedes AI media extension)
Three editorial products share one selected color across the natural hero,
styling look and eight-direction room. A look selection survives color changes.
Content jobs: natural neck-down hero hooks; purchase information converts;
one interactive outfit editor inspires; one styled color story compares;
real textile macros and native measurements prove. Repeated all-color model
grids, mannequin body shots and exported long-form detail composites do not
appear on these product pages. Other catalog products retain their layout.
The warm cream/ink palette and serif headings stay. Editorial media uses square
corners, asymmetrical 1.2:1 image/control columns, 64/48px section separation,
32px section titles, 12px letter-spaced index labels, 13/14px supporting captions,
15/16px body, 20px measurement values and 24/28px subordinate/mobile titles.
Controls are at least 44px tall (48px for color and view controls); outfit choices
are 96px tall, 88px on mobile. Full-body images cap at 780px height with contain;
the room caps at 720px, preserving heads and shoes. Mobile stacks controls
before the outfit image and uses a compact square hero above purchase details.
Reusable primitives: editorial-section, look-selector, shared-color-selector,
outfit-stage, color-story, proof-grid and model-disclosure. Selected controls
use ink wash; image loading retains the stage size and exposes adjacent status.
The beui tabs mechanism uses a controlled shared value and roving keyboard focus;
adapted to vanilla buttons with 120ms opacity, no new runtime or scroll hijack.
Room direction and zoom persist through color changes, autoplay pauses on edits,
reduced motion and offscreen/hidden state. Every color needs its own eight frames.
Synthetic body settings are a native disclosure, never fit guarantees. Missing
measurement units and care values remain blank. No fabricated reviews or prices.
Personas: mobile shopper comparing colors; keyboard shopper exploring outfits;
motion-sensitive shopper choosing directions manually. Required checks include
color/preset continuity, image failures, keyboard paths and 375/768/1280 layouts.
Real fashion reference research and production asset QA are owned by root.

Extend the existing storefront and ../preparation/DESIGN.md. Cream surfaces,
dark brown text and terracotta primary actions remain the brand contract.

Tokens: bg #F7F3EC, bg-2 #EFE8DD, surface #FFFDFA, ink #1E1A16,
ink-2 #4A443D, accent #C2603F, accent-hover #A94E31, line #E4DCD0.
Use ink-2 for small text, radius 14/8px and spacing 4/8/12/16/20/24/32/40px.
System Korean sans, headings 28/20px, body 15px, form/help 14px.

One document owns vertical scrolling. Maximum width 1200px, administration
1440px. Fitting uses a stage and controls in two columns; admin uses list/detail.
At 1024px they become one column; below 720px use 16px page padding.
All controls have labels, 44px touch targets and visible focus. Results use
aria-live and errors remain next to their form. Motion is 120ms opacity only;
reduced-motion disables it. A 375px page must have no horizontal overflow.

Fitting imagery is labelled as a styling illustration, never a physical fit
guarantee. Verified dimensions and customer chest circumference determine
recommendations. Missing or unverified measurements produce an honest pending
state. Customer photos are not collected. Body measurements are used only for recommendations.
Unavailable cloud services disable dependent actions with a visible reason.
No invented analytics, customer reviews, save confirmations or generated photos.

Reusable primitives: stack, cluster, panel, field, status, notice, item-row,
stage, action-row. Admin edit and publish are distinct actions. Changes use a
version check to prevent overwriting another editor. Customers own profile,
cart and private images; normal administrators edit catalog content only.

The archived administrator fitting studio extends the existing panel/field/action-row
primitives. A two-column selector pairs a labelled synthetic model with a
labelled knit; a responsive three/two/one-column result grid compares the six
models for one design. Model height and build are historical prompt settings,
never measured bodies or a garment-size simulation. Each knit retains its
image source (AI sample or store original) and source product link. Test
fixtures cannot become sale products or verified measurements. Only the
provisioned owner can see the library and results. Generated inputs use a
separate private test-assets bucket; customer photos keep their existing
retention and permissions. Result images retain the existing 24-hour expiry.
Single-pair and six-model requests share pending/busy/error states; queued
work can be cancelled and selected test results deleted. A two-hour GPU test
session and a separate 72-result daily test allowance (60 combinations plus
12 retries) leave customer limits
unchanged. Polling renews private image URLs without repainting form controls;
images never stretch or crop faces. Input previews use a 360px contain stage;
result previews keep a 3:4 frame. No new motion or color tokens are needed.

## Owner-reviewed content and lookbook (2026-10-02)
Use the existing-project redesign route; preserve storefront identity. New UI uses
the tokens above, border-only depth, 14/8px radii, and existing type scale plus
40px concept titles. Admin shell: 192px menu plus flexible workspace, single
document scroll. Below 1024px use one column and wrapping horizontal navigation.
Lookbook media: 2:3 contain frame (full head and shoes), controls beside it on
desktop and underneath below 720px. No stretched images or automatic rotation.
Native stepped range, angle buttons, keyboard and horizontal swipe select only
available photographed/generated frames. Current selection uses bg-2 wash.
Components: studio-shell/nav, editor-heading/document-state, view-editor,
publish-actions, lookbook-media/controls/empty, concept-reference/sections.
Approval attaches to a saved version and editing revokes it. Pending types show
“점주 협의 전”; height/build do not alter images. Weight is absent from forms
and example labels. Draft image URLs are signed; public content reads only
published documents. AI back views state that structure is inferred.
Structural references: https://github.com/changeroa/StyleGallery/blob/main/patterns/split-sidebar/sidebar.md
and https://github.com/changeroa/StyleGallery/blob/main/patterns/media-fit/frame.md.
Interaction reference: https://beui.dev/r/range-slider/raw (stepped range control;
adapted to accessible native input, without adding React or an animation runtime).

## Historical AI media extension (legacy products without editorial metadata only)
The editorial product revision at the beginning of this document takes precedence
for products with aiPresentation.editorial. The following rules remain only for
legacy AI metadata without that field; they do not describe the three revised pages.
The owner authorizes labelled AI styling imagery for three products. The existing
storefront tokens, document scroll, and reusable card remain the visual contract.
Representative media is a neck-down garment composition; full-body AI imagery is
the second gallery item. A right-hand vertical swatch rail communicates available
colors. Existing color option buttons select corresponding imagery.

### Reusable primitives and states
AI media (representative/full-body), marker, swatch rail, virtual-model caption,
and fitting-room (idle/loading/ready/error/playing/paused/zoomed) share radius 14,
spacing 8/12/16/24, ink, surface, bg-2 and line. Controls have minimum 44px targets;
selected states use ink wash and aria-pressed. Model settings are fictional,
165cm/50kg/82/64/90 only when supplied, never a real fit or size claim. Unknown
product sizes and care values remain empty. The room always names its own color.

### Motion and room
Adapt pointer capture, wrapped indices and explicit autoplay interruption from
https://beui.dev/r/cylinder-carousel/raw (source captured in evidence). Novel
mechanism: eight actual generated viewpoints crossfade in a stable lit studio;
there is no CSS rotation of a single image. Drag threshold 32px, crossfade 120ms,
user-started autoplay 1800ms, zoom 1–1.5. Reduced motion removes transitions and
autoplay; document-hidden and offscreen pauses prevent background work. Floor is
a static ellipse with neutral ink shadow and studio radial light; warm/daylight
lighting changes the room only, not garment color. Stage 2:3, max height 640px.
Final representative assets are square with an AI label inside the bitmap: use
square contain on the product page and contain within existing 3:4 cards to avoid
cutting sleeves or the embedded label. Optional aiPresentation.cropHasAiLabel=true
suppresses the native duplicate AI marker only; unlabelled future crops retain it.
Desktop room stage/control split,
mobile one column at 720px. No 3D dependency or React tooling (vanilla JS).

### Accessibility and verification ownership
Keyboard arrows, Home/End, native zoom range, named buttons, visible focus,
status announcements and a nearby image-load error support non-pointer use.
Root executor owns live browser / visual / performance QA and deployment; this
implementation records syntax, contract and build evidence. No visual pass is
claimed from static tests. Existing unrelated surfaces remain outside this change.
