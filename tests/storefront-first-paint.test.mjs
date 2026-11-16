import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url), read=p=>readFileSync(new URL(p,root),'utf8');
const context={window:{GR:{}},document:{body:{dataset:{}},addEventListener(){}}};context.GR=context.window.GR;
for(const file of ['data.js','detail-catalog.js','smartstore-reviews.js','standard-detail.js','app.js'])vm.runInNewContext(read(file),context);
test('all sale pages ship the finished gallery, size guide, reviews and navigation before JavaScript',()=>{
  for(const p of context.GR.PRODUCTS){
    const html=read(`dist/product-${p.id}.html`);
    assert.match(html,/<body[^>]*class="grsd-page"/,p.id);
    assert.match(html,/<div class="grsd" id="pd" data-render-key="[^"]+">/,p.id);
    assert.match(html,/<img id="pd-img" src="[^"]+"/,p.id);
    assert.ok(html.includes('aria-label="판매 색상"'),p.id);
    assert.ok(html.includes('id="size"'),p.id);
    const sections=['id="styling"','id="colors"','id="fabric"','id="size"','id="care"','id="pd-reviews"','id="related-grid"'];
    const positions=sections.map(section=>html.indexOf(section));
    assert.ok(positions.every((position,i)=>position>=0 && (!i || position>positions[i-1])),`${p.id}: detail section order`);
    const detail=context.window.GR_DETAIL[p.id];
    assert.ok(html.includes('<h2>Product Detail</h2>'),p.id);
    assert.ok(html.includes('<h2>Care &amp; Info</h2>') || html.includes('<h2>Care & Info</h2>'),p.id);
    if(detail.productPhotos?.length){
      for(const photo of detail.productPhotos) assert.ok(html.includes('data-full-image="'+(photo.fullSrc || photo.src)+'"'),p.id+' cutout zoom');
      assert.doesNotMatch(html,/촬영 원본 확인|후면 참고 · AI 추정 연출/,p.id);
    }
    assert.equal((html.match(/data-look="/g)||[]).length,4,`${p.id}: initial four styling choices`);
    assert.ok(html.includes('grsd-review-guide'),p.id);
    assert.ok(html.includes('<nav class="nav">'),p.id);
    assert.doesNotMatch(html,/<div class="pd" id="pd">/,p.id);
  }
});
test('initial gallery has a selected outfit, selected mode and complete color-specific thumbnails',()=>{
 const p=context.GR.byId('stripe-cable-half'),view=context.window.GRStandardDetail.markup(p,{...context.GR.storefront,card:context.GR.card});
 assert.ok(view.hero.includes('data-mode="model" aria-pressed="true"'));
 assert.ok(view.hero.includes('data-look="'));
 assert.ok(view.hero.includes('하늘 ·'));
 assert.ok(view.hero.includes('src="'+view.d.looks[0].images[view.state.color]+'"'));
 assert.equal(view.key,context.window.GRStandardDetail.markup(p,{...context.GR.storefront,card:context.GR.card}).key);
});
