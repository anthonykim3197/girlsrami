import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('seo-products.json',root),'utf8'));
const readDist=name=>readFileSync(new URL(`dist/${name}`,root),'utf8');

test('the public fallback catalog contains the same twelve sale products and no draft concepts',()=>{
  const context={window:{GR:{}}};context.GR=context.window.GR;
  vm.runInNewContext(readFileSync(new URL('data.js',root),'utf8'),context);
  const products=context.window.GR.PRODUCTS;
  assert.equal(products.length,manifest.products.length);
  assert.deepEqual([...products.map(product=>product.id)].sort(),[...manifest.products.map(product=>product.id)].sort());
  assert.ok(products.every(product=>product.status==='active'&&/^https:\/\/smartstore\.naver\.com\/girlsrami\/products\/\d+\/?$/.test(product.storeUrl||product.smartstore)));
  assert.doesNotMatch(readFileSync(new URL('data.js',root),'utf8'),/GR-FW26-|wool-cable-regular|cashmere-touch-turtle/);
});

test('the sitemap and static product pages expose only the verified sale catalog',()=>{
  const sitemap=readDist('sitemap.xml');
  assert.equal(manifest.products.length,12);
  assert.equal((sitemap.match(/<loc>https:\/\/girlslami\.com\/product-/g)||[]).length,manifest.products.length);
  for(const product of manifest.products){
    const path=`product-${product.id}.html`;
    const html=readDist(path);
    assert.match(sitemap,new RegExp(`<loc>https://girlslami\\.com/${path}</loc>`));
    assert.match(html,new RegExp(`<body data-page="product" data-product-id="${product.id}">`));
    assert.match(html,new RegExp(`<link rel="canonical" href="https://girlslami\\.com/${path}">`));
    assert.match(html,new RegExp(`<h1 class="name">걸스라미 ${product.name}</h1>`));
    assert.match(html,new RegExp(`<span class="now">${Number(product.price).toLocaleString('ko-KR')}원</span>`));
    assert.doesNotMatch(html,/name="robots" content="noindex/i);
    const raw=html.match(/<script type="application\/ld\+json" data-product-json-ld>(.*?)<\/script>/s)?.[1];
    assert.ok(raw,`${product.id} Product JSON-LD`);
    const json=JSON.parse(raw);
    assert.equal(json['@type'],'Product');
    assert.deepEqual(json.image,[product.realImage]);
    assert.equal(json.offers.price,product.price);
    assert.equal(json.offers.url,product.storeUrl);
    assert.equal(json.offers.availability,product.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock');
    assert.equal(json.aggregateRating,undefined);
  }
  for(const conceptId of ['wool-cable-regular','cashmere-touch-turtle','alpaca-long-cardigan','ribbed-knit-dress']){
    assert.doesNotMatch(sitemap,new RegExp(conceptId));
  }
  assert.equal((readDist('shop.html').match(/<a class="card reveal in" href="product-/g)||[]).length,manifest.products.length);
  assert.equal((readDist('index.html').match(/<a class="card reveal in" href="product-/g)||[]).length,4);
});

test('the generic product shell stays out of search and crawl controls are real files',()=>{
  assert.match(readDist('product.html'),/name="robots" content="noindex,follow"/);
  assert.match(readDist('_headers'),/\/product\.html\n\s+X-Robots-Tag: noindex, follow, noimageindex/);
  assert.match(readDist('robots.txt'),/^User-agent: \*\nAllow: \/\nSitemap: https:\/\/girlslami\.com\/sitemap\.xml\n$/);
  assert.match(readDist('sitemap.xml'),/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
});

test('the storefront self-hosts the licensed Korean webfont subset and uses a static GR favicon',()=>{
  const css=readDist('style.css');
  assert.match(css,/font-family:\s*"Girlsrami Sans"/);
  assert.match(css,/GirlsramiSans-Regular\.woff2/);
  assert.match(css,/GirlsramiSans-Bold\.woff2/);
  assert.doesNotMatch(readDist('index.html'),/fonts\.googleapis|Pretendard|data:image\/svg\+xml/);
  assert.match(readDist('favicon.svg'),/<circle[^>]+fill="#c2603f"/);
  for(const file of ['p-wool-cable-regular.jpg','p-cashmere-turtle.jpg','p-alpaca-long-cardigan.jpg','p-knit-dress.jpg','p-vest-long-boucle.jpg','p-knit-set.jpg','p-wool-muffler.jpg','p-halfzip.jpg']){
    assert.throws(()=>readDist(file));
  }
});

test('the font receipt matches the distributed subsets and keeps each file below one megabyte',()=>{
  const receipt=JSON.parse(readFileSync(new URL('fonts/source-receipt.json',root),'utf8'));
  assert.match(receipt.webfont_subset.unicode_ranges,/U\+AC00-D7A3/);
  assert.match(receipt.webfont_subset.reserved_font_name_compliance,/Girlsrami Sans/);
  for(const output of receipt.webfont_subset.outputs){
    const bytes=readFileSync(new URL(`fonts/${output.file}`,root));
    assert.ok(bytes.byteLength<1024*1024,`${output.file} should remain below 1 MiB`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),output.sha256);
    assert.equal(bytes.byteLength,output.output_size_bytes);
    assert.equal(output.hangul_syllables,11172);
    assert.equal(output.cjk_unified_ideographs,0);
  }
});
