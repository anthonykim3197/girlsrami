import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {catalogInfo,catalogSummary,sortAdminProducts,serializeCatalogFields} from '../admin-catalog.js';
import {createProductInventoryAdmin} from '../admin-product-editor.js';

test('intake uses the first request date, never a later publication or update date', () => {
  assert.equal(catalogInfo({id:'jo31-raglan-roundneck-knit',releasedAt:'2026-10-16',updated_at:'2026-10-20'}).intakeDate,'2026-10-13');
  assert.equal(catalogInfo({id:'honey-loop-crop-knit',releasedAt:'2026-10-07'}).intakeDate,'2026-10-03');
  assert.equal(catalogInfo({id:'off-duty-vneck-knit-vest'}).intakeDate,'2026-10-03');
  assert.equal(catalogInfo({id:'stripe-cable-half',releasedAt:'2026-10-15'}).intakeDate,null);
});

test('sample identity is independent of sale status and unknown products are not guessed', () => {
  assert.equal(catalogInfo({id:'wool-rib-muffler',status:'coming'}).group,'sample');
  assert.equal(catalogInfo({id:'qa-emerald-cardigan-20261001',status:'hidden'}).group,'test');
  assert.equal(catalogInfo({id:'stripe-cable-half',status:'hidden'}).group,'legacy');
  assert.equal(catalogInfo({id:'unrecognized',status:'active',storeUrl:'https://smartstore.naver.com/girlsrami/products/123'}).group,'unclassified');
});

test('explicit admin metadata overrides baseline and an intentionally empty date stays empty', () => {
  assert.equal(catalogInfo({id:'jo31-raglan-roundneck-knit',intakeDate:'2026-10-12'}).intakeDate,'2026-10-12');
  assert.equal(catalogInfo({id:'jo31-raglan-roundneck-knit',intakeDate:null}).intakeDate,null);
  assert.equal(catalogInfo({id:'wool-rib-muffler',catalogGroup:'new',intakeDate:'2026-11-01'}).group,'new');
});

test('newest intake sorts first, unknown dates last, and ties are stable without mutation', () => {
  const products=[{id:'stripe-cable-half',styleCode:'RM401'},{id:'honey-loop-crop-knit',styleCode:'RM382'},{id:'jo31-raglan-roundneck-knit',styleCode:'JO31'},{id:'jo23-oversized-vneck-knit',styleCode:'JO23'}];
  const before=structuredClone(products);
  assert.deepEqual(sortAdminProducts(products).map(p=>p.id),['jo23-oversized-vneck-knit','jo31-raglan-roundneck-knit','honey-loop-crop-knit','stripe-cable-half']);
  assert.deepEqual(products,before);
});

test('real catalog groups preserve the established, initial and verified intake batches', async () => {
  const context={window:{GR:{}}}; context.GR=context.window.GR;
  vm.runInNewContext(await readFile(new URL('../data.js',import.meta.url),'utf8'),context);
  const summary=catalogSummary(JSON.parse(JSON.stringify(context.GR.PRODUCTS)));
  const launch=JSON.parse(await readFile(new URL('fixtures/new2-launch-20261104.json',import.meta.url),'utf8'));
  const activeIds=launch.map(p=>p.id).filter(id=>context.GR.PRODUCTS.some(product=>product.id===id));
  assert.equal(summary.real.length,21+activeIds.length);
  assert.equal(summary.legacy.length,10);
  const newBatches=activeIds.length?[['2026-11-04',activeIds.length]]:[];
  assert.deepEqual(summary.newBatches.map(b=>[b.date,b.products.length]),[...newBatches,['2026-10-13',9],['2026-10-03',2]]);
  if(activeIds.length) assert.deepEqual(summary.newBatches[0].products.map(p=>p.id).sort(),activeIds.sort());
  assert.equal(summary.unclassified.length,0);
});

test('duplicates do not inflate counts and archive rows stay outside the real catalog', () => {
  const summary=catalogSummary([{id:'wool-rib-muffler'},{id:'qa-studio-ai-blue-stripe-half'},{id:'honey-loop-crop-knit'},{id:'honey-loop-crop-knit'},{id:'future'}]);
  assert.equal(summary.real.length,1);
  assert.equal(summary.samples.length,1);
  assert.equal(summary.tests.length,1);
  assert.equal(summary.unclassified.length,1);
});

test('metadata accepts calendar dates and rejects impossible or ambiguous dates', () => {
  assert.deepEqual(serializeCatalogFields({catalogGroup:'new',intakeDate:'2026-10-13'}),{catalogGroup:'new',intakeDate:'2026-10-13'});
  assert.deepEqual(serializeCatalogFields({catalogGroup:'legacy',intakeDate:''}),{catalogGroup:'legacy',intakeDate:null});
  assert.deepEqual(serializeCatalogFields({catalogGroup:'new',intakeDate:'2028-02-29'}),{catalogGroup:'new',intakeDate:'2028-02-29'});
  for (const intakeDate of ['2026-02-29','2026-13-01','10/13/2026','2026-10-32']) assert.throws(()=>serializeCatalogFields({catalogGroup:'new',intakeDate}),/입고일/);
  assert.throws(()=>serializeCatalogFields({catalogGroup:'guess',intakeDate:''}),/구분/);
});

test('admin list pairs public representative thumbnails with the photographed front for every sale product', async () => {
  const context={window:{GR:{}},document:{body:{dataset:{}},addEventListener(){}}};
  context.GR=context.window.GR;
  for (const file of ['data.js','detail-catalog.js','app.js']) {
    vm.runInNewContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),context);
  }
  const products=context.GR.PRODUCTS;
  const elements=new Map();
  const find=selector => {
    if (!elements.has(selector)) elements.set(selector,{innerHTML:'',value:selector==='#admin-sort'?'newest':'',querySelectorAll:()=>[]});
    return elements.get(selector);
  };
  const client={
    rpc:()=>true,
    from:table=>({select(){return this;},order(){return table==='products'?products.map(payload=>({id:payload.id,payload,version:1})):[];}})
  };
  const previousWindow=globalThis.window;
  globalThis.window=context.window;
  try {
    await createProductInventoryAdmin({
      getClient:()=>client,getUser:()=>({id:'admin'}),query:async value=>value,requireUser(){},
      escape:value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;'),priceLabel:String,find
    })({innerHTML:''},products);
  } finally {
    if (previousWindow===undefined) delete globalThis.window;
    else globalThis.window=previousWindow;
  }
  const html=find('#admin-list').innerHTML;
  const rows=[...html.matchAll(/<tr class="[^"]*">([\s\S]*?)<\/tr>/g)].map(match=>match[1]);
  assert.equal(rows.length,products.length);
  for (const product of products) {
    const row=rows.find(row=>row.includes(`data-product="${product.id}"`));
    const detail=context.window.GR_DETAIL[product.id];
    const front=product.detailImages?.find(photo=>photo.verified&&photo.angle===0)?.url
      || Object.values(detail.originals||{}).flat().find(photo=>photo.angle===0)?.src;
    assert.ok(front,product.id+' photographed front');
    assert.deepEqual([...row.matchAll(/<img src="([^"]+)"/g)].map(match=>match[1]),[
      detail.cardThumbnail||detail.thumbnail,front
    ],product.id);
    assert.match(row,/<figcaption>판매 대표<\/figcaption>/);
    assert.match(row,/<figcaption>마네킹 정면<\/figcaption>/);
  }
  const adminPage=await readFile(new URL('../admin.html',import.meta.url),'utf8');
  assert.ok(adminPage.indexOf('src="detail-catalog.js')<adminPage.indexOf('src="app.js'));
});
