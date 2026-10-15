import {mkdir,copyFile,readdir,rm,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {validateDetailContent} from './validate-detail-content.mjs';

const root=new URL('../',import.meta.url);
const out=new URL('../dist/',import.meta.url);
const siteUrl='https://girlslami.com/';
const seo=JSON.parse(await readFile(new URL('seo-products.json',root),'utf8'));
const detailContext={window:{}};
vm.runInNewContext(await readFile(new URL('detail-catalog.js',root),'utf8'),detailContext,{timeout:1000});
const details=detailContext.window.GR_DETAIL;
if (!details || JSON.stringify(Object.keys(details).sort()) !== JSON.stringify(seo.products.map(product=>product.id).sort())) {
  throw new Error('Detail manifest must contain exactly the approved sale catalog.');
}
validateDetailContent(seo.products,details);
const dataContext={window:{GR:{}}};dataContext.GR=dataContext.window.GR;
vm.runInNewContext(await readFile(new URL('data.js',root),'utf8'),dataContext,{timeout:1000});
dataContext.window.GR_DETAIL=details;
dataContext.document={body:{dataset:{}},addEventListener(){}};
for(const file of ['smartstore-reviews.js','standard-detail.js','app.js'])vm.runInNewContext(await readFile(new URL(file,root),'utf8'),dataContext,{timeout:1000});
const GR=dataContext.GR, presentation=dataContext.window.GRStandardDetail;
const catalogById=new Map(GR.PRODUCTS.map(product=>[product.id,product]));
const detailHelpers={...GR.storefront,card:GR.card};
const maxAssetBytes=25*1024*1024;
const draftProductImages=new Set([
  'p-wool-cable-regular.jpg','p-cashmere-turtle.jpg','p-alpaca-long-cardigan.jpg','p-knit-dress.jpg',
  'p-vest-long-boucle.jpg','p-knit-set.jpg','p-wool-muffler.jpg','p-halfzip.jpg'
]);

const htmlEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const xmlEscape=value=>htmlEscape(value);
const productPath=product=>`product-${product.id}.html`;
const thumbnailFor=product=>details[product.id].thumbnail||product.realImage;
const absoluteImage=path=>new URL(path,siteUrl).href;
const leadFor=product=>details[product.id].lead||product.name;
const descriptionFor=product=>{
  const colors=product.colors?.length?`판매 색상 ${product.colors.join(', ')}. `:'';
  return `${product.name}. ${leadFor(product)} ${colors}현재 구매 가능한 옵션과 배송 조건은 스마트스토어에서 확인하세요.`;
};
const productJsonLd=product=>({
  '@context':'https://schema.org','@type':'Product',name:product.name,
  description:descriptionFor(product),image:[...new Set([absoluteImage(thumbnailFor(product)),absoluteImage(product.realImage)])],
  sku:product.styleCode||product.sku,category:product.category,
  brand:{'@type':'Brand',name:'걸스라미'},
  offers:{'@type':'Offer',url:product.storeUrl,priceCurrency:'KRW',price:product.price,
    availability:Number(product.stock)>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',seller:{'@type':'Organization',name:'걸스라미'}}
});

async function copyDetailAssets(relative='assets/detail/') {
  const source=new URL(relative,root),destination=new URL(relative,out);
  await mkdir(destination,{recursive:true});
  for (const entry of await readdir(source,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const child=relative+entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Detail assets cannot contain symlinks: ${child}`);
    if (entry.isDirectory()) { await copyDetailAssets(child+'/'); continue; }
    if (!entry.isFile() || !/\.(?:jpe?g|png|webp|avif|gif|svg)$/i.test(entry.name)) continue;
    if ((await stat(new URL(child,root))).size>maxAssetBytes) throw new Error(`Asset exceeds the 25 MiB upload limit: ${child}`);
    await copyFile(new URL(child,root),new URL(child,out));
  }
}

function localDetailAssets(value,result=new Set()) {
  if (typeof value==='string' && value.startsWith('assets/detail/')) result.add(value);
  else if (value && typeof value==='object') for (const child of Object.values(value)) localDetailAssets(child,result);
  return result;
}

await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of await readdir(root)) {
  if(['story-machine.jpg','story-yarn.jpg','story-hands.jpg'].includes(name)) continue;
  if(draftProductImages.has(name)) continue;
  if(/(?:^|[-_])(?:review|preview)(?:[-_.]|$).*\.html$/i.test(name)) continue;
  if(/\.(html|css|jpg|png|svg|js|txt|xml)$/.test(name) || ['config.json','_headers','_redirects'].includes(name)) {
    await copyFile(new URL(name,root),new URL(name,out));
  }
}
await mkdir(new URL('fonts/',out),{recursive:true});
for(const name of ['GirlsramiSans-Regular.woff2','GirlsramiSans-Bold.woff2','LICENSE.txt','LICENSE_OFL.txt','source-receipt.json']) {
  await copyFile(new URL(`fonts/${name}`,root),new URL(`fonts/${name}`,out));
}
await copyDetailAssets();
for (const asset of localDetailAssets(details)) {
  if (!(await stat(new URL(asset,out))).isFile()) throw new Error(`Missing detail asset: ${asset}`);
}

const template=await readFile(new URL('product.html',out),'utf8');
for(const product of seo.products) {
  const canonical=siteUrl+productPath(product);
  const description=descriptionFor(product);
  const jsonLd=JSON.stringify(productJsonLd(product)).replaceAll('<','\\u003c');
  const head=`<title>${htmlEscape(product.name)} | 걸스라미</title>\n<meta name="description" content="${htmlEscape(description)}">\n<link rel="canonical" href="${canonical}">\n<meta property="og:type" content="product">\n<meta property="og:site_name" content="걸스라미">\n<meta property="og:title" content="${htmlEscape(product.name)} | 걸스라미">\n<meta property="og:description" content="${htmlEscape(description)}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${htmlEscape(absoluteImage(thumbnailFor(product)))}">\n<script type="application/ld+json" data-product-json-ld>${jsonLd}</script>`;
  const view=presentation.markup(catalogById.get(product.id),detailHelpers);
  const html=template
    .replace('<title>상품 | 걸스라미 GIRLSRAMI</title>\n<meta name="robots" content="noindex,follow">',head)
    .replace('<body data-page="product">',`<body data-page="product" data-product-id="${htmlEscape(product.id)}" class="grsd-page">`)
    .replace('<div class="pd" id="pd"></div>',`<div class="grsd" id="pd" data-render-key="${view.key}">${view.hero}</div>`)
    .replace(/<div class="pd-tabs">[\s\S]*?<\/div>/,`<div class="grsd-section-nav">${view.nav}</div>`)
    .replace('<div class="pd-panel pd-desc" id="pd-desc"></div>',`<div class="grsd grsd-detail" id="pd-desc">${view.detail}</div>`)
    .replace('<div class="pd-panel" id="pd-reviews" hidden></div>',`<div class="grsd grsd-lower grsd-reviews" id="pd-reviews">${view.reviews}</div>`)
    .replace('<div class="pd-panel" id="pd-notice" hidden></div>',`<div class="grsd grsd-lower" id="pd-notice">${view.notice}</div>`)
    .replace('<div class="grid" id="related-grid"></div>',`<div class="grid" id="related-grid">${view.related}</div>`);
  await writeFile(new URL(productPath(product),out),html);
}

for(const name of ['index.html','shop.html']) {
  const path=new URL(name,out);
  let html=await readFile(path,'utf8');
  const home=name==='index.html',id=home?'best-grid':'shop-grid';
  const selected=home?GR.pageMarkup.homeProducts():GR.pageMarkup.shopProducts();
  html=html.replace(`<div class="grid" id="${id}"></div>`,`<div class="grid" id="${id}">${selected.map(GR.card).join('')}</div>`);
  if(home)html=html.replace('<div class="reviews" id="home-reviews"></div>',`<div class="reviews" id="home-reviews">${GR.pageMarkup.homeReviews()}</div>`);
  else html=html.replace('<div class="chips" id="cat-chips"></div>',`<div class="chips" id="cat-chips">${GR.pageMarkup.categoryChips()}</div>`).replace('<span class="count" id="shop-count"></span>',`<span class="count" id="shop-count">${selected.length}개 상품</span>`);
  await writeFile(path,html);
}
// Navigation dimensions must exist in the first document on every public page.
for(const name of await readdir(out)){
  if(!name.endsWith('.html'))continue;
  const path=new URL(name,out),html=await readFile(path,'utf8'),page=html.match(/data-page="([^"]+)"/)?.[1]||'';
  const chrome=GR.pageMarkup.chrome(page);
  await writeFile(path,html.replace('<div id="site-header"></div>',`<div id="site-header">${chrome.header}</div>`).replace('<div id="site-footer"></div>',`<div id="site-footer">${chrome.footer}</div>`));
}

const sitemapPages=['','shop.html','story.html','guide.html',...seo.products.map(productPath)];
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages.map(path=>`  <url><loc>${xmlEscape(siteUrl+path)}</loc><lastmod>${seo.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml',out),sitemap);

// Version dynamically imported admin modules from the leaves upward.
for (const [name, dependency] of [['admin-product-editor.js','admin-inventory.js'],['member.js','admin-product-editor.js']]) {
  const depHash = createHash('sha256').update(await readFile(new URL(dependency,out))).digest('hex').slice(0,12);
  const path = new URL(name,out);
  const source = await readFile(path,'utf8');
  await writeFile(path,source.replaceAll(`'./${dependency}'`,`'./${dependency}?v=${depHash}'`));
}
const versions = new Map();
for (const name of await readdir(out)) {
  if (/\.(js|css)$/.test(name)) versions.set(name, createHash('sha256').update(await readFile(new URL(name,out))).digest('hex').slice(0,12));
}
for (const name of await readdir(out)) {
  if (!name.endsWith('.html')) continue;
  const path = new URL(name,out);
  const html = await readFile(path,'utf8');
  await writeFile(path,html.replace(/(src|href)="([^"?]+\.(?:js|css))(?:\?v=[a-f0-9]+)?"/g,(match,attribute,asset)=>versions.has(asset)?`${attribute}="${asset}?v=${versions.get(asset)}"`:match));
}
async function validateUploadSizes(directory=out) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const path=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
    if (entry.isDirectory()) await validateUploadSizes(path);
    else if ((await stat(path)).size>maxAssetBytes) throw new Error(`File exceeds the 25 MiB upload limit: ${path.pathname}`);
  }
}
await validateUploadSizes();
console.log(`Static storefront built with ${seo.products.length} indexable sale products; private backend and GPU code excluded.`);
