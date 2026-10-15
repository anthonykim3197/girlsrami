import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('seo-products.json',root),'utf8'));
const readDist=name=>readFileSync(new URL(`dist/${name}`,root),'utf8');
const detailContext={window:{}};
vm.runInNewContext(readFileSync(new URL('detail-catalog.js',root),'utf8'),detailContext);
const details=detailContext.window.GR_DETAIL;

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
    const hero=new URL(details[product.id].thumbnail,'https://girlslami.com/').href;
    assert.deepEqual(json.image,[...new Set([hero,product.realImage])]);
    assert.ok(html.includes(`<meta property="og:image" content="${hero}">`));
    assert.ok(html.includes(details[product.id].lead));
    assert.ok(html.includes(`src="${details[product.id].thumbnail}"`));
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
  assert.equal(manifest.lastmod,'2026-10-15');
  assert.deepEqual(Object.keys(details).sort(),manifest.products.map(product=>product.id).sort());
  for(const name of ['index.html','shop.html','product.html']){
    const html=readDist(name);
    assert.ok(html.indexOf('detail-catalog.js')<html.indexOf('src="app.js'),`${name} loads presentation before app`);
    assert.match(html,/href="catalog\.css\?v=/);
  }
});

test('the generic product shell stays out of search and crawl controls are real files',()=>{
  assert.match(readDist('product.html'),/name="robots" content="noindex,follow"/);
  assert.match(readDist('_headers'),/\/product\.html\n\s+X-Robots-Tag: noindex, follow, noimageindex/);
  assert.match(readDist('robots.txt'),/^User-agent: \*\nAllow: \/\nSitemap: https:\/\/girlslami\.com\/sitemap\.xml\n$/);
  assert.match(readDist('sitemap.xml'),/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(readDist('404.html'),/name="robots" content="noindex,follow,noimageindex"/);
  assert.match(readDist('404.html'),/href="\/shop"/);
  assert.doesNotMatch(readDist('sitemap.xml'),/404\.html/);
});

test('detail media is packaged without private working folders or oversized uploads',()=>{
  const files=[];
  function walk(relative){
    for(const entry of readdirSync(new URL(`dist/${relative}`,root),{withFileTypes:true})){
      const child=relative+entry.name;
      if(entry.isDirectory()) walk(child+'/');
      else files.push(child);
    }
  }
  walk('assets/');
  assert.ok(files.length>0);
  assert.ok(files.every(file=>file.startsWith('assets/detail/')));
  for(const file of files){
    assert.match(file,/\.(?:jpe?g|png|webp|avif|gif|svg)$/i);
    assert.ok(statSync(new URL(`dist/${file}`,root)).size<=25*1024*1024,file);
  }
  function checkReferences(value){
    if(typeof value==='string'&&value.startsWith('assets/detail/')) assert.ok(existsSync(new URL(`dist/${value}`,root)),value);
    else if(value&&typeof value==='object') Object.values(value).forEach(checkReferences);
  }
  checkReferences(details);
  for(const privateFolder of ['supabase','node_modules','model-character-sheet','new_goods','audit']){
    assert.equal(existsSync(new URL(`dist/${privateFolder}/`,root)),false);
  }
  assert.equal(existsSync(new URL('dist/standard-detail-review-mobile.html',root)),false);
});

test('runtime cards use the approved hero and copy while preserving prices and real-photo fallback',()=>{
  const GR={COLORS:{},fmt:n=>`${n}원`,discount:()=>0};
  const document={body:{dataset:{}},addEventListener(){}};
  const presentation={thumbnail:'assets/detail/example/hero-reference-v1.webp',lead:'흰 티와 데님 위에 가볍게.'};
  vm.runInNewContext(readFileSync(new URL('app.js',root),'utf8'),{window:{GR,GR_DETAIL:{example:presentation}},GR,document});
  const product={id:'example',name:'베스트',category:'조끼',newRelease:true,status:'active',storeUrl:'https://smartstore.naver.com/girlsrami/products/1234',colors:[],price:12900,listPrice:0,rating:0,image:'actual',photoVerified:true};
  const html=GR.card(product);
  assert.ok(html.includes(presentation.thumbnail));
  assert.ok(html.includes(presentation.lead));
  assert.match(html,/badge-new">NEW/);
  assert.doesNotMatch(html,/신상|AI 코디|실물 사진/);
  assert.match(html,/12900원/);
  assert.match(GR.card({...product,id:'other'}),/src="actual"[^>]+실물 사진/);
  assert.match(readDist('data.js'),/https:\/\/talk\.naver\.com\/ct\/w4j7l2#nafullscreen/);
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
