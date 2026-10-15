import {mkdir,copyFile,readdir,rm,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

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
const dataContext={window:{GR:{}}};dataContext.GR=dataContext.window.GR;
vm.runInNewContext(await readFile(new URL('data.js',root),'utf8'),dataContext,{timeout:1000});
const catalogById=new Map(dataContext.window.GR.PRODUCTS.map(product=>[product.id,product]));
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
const imageAlt=product=>`${product.name}${details[product.id].thumbnailColor ? ` ${details[product.id].thumbnailColor}` : ''} 스타일링`;
const newBadge=product=>catalogById.get(product.id)?.newRelease ? '<div class="badges"><span class="badge badge-new">NEW</span></div>' : '';
const won=value=>`${Number(value).toLocaleString('ko-KR')}원`;
const descriptionFor=product=>{
  const colors=product.colors?.length?`판매 색상 ${product.colors.join(', ')}. `:'';
  return `${product.name}. ${leadFor(product)} ${colors}현재 구매 가능한 옵션과 배송 조건은 스마트스토어에서 확인하세요.`;
};
const staticCard=product=>`<a class="card reveal in" href="${productPath(product)}">
  <div class="thumb">${newBadge(product)}<img src="${htmlEscape(thumbnailFor(product))}" alt="${htmlEscape(imageAlt(product))}" loading="lazy" decoding="async"></div>
  <div class="card-body"><div class="cat">${htmlEscape(product.category)}</div><div class="name">걸스라미 ${htmlEscape(product.name)}<small>${htmlEscape(leadFor(product))}</small></div><div class="price"><span class="price-label">스마트스토어 판매가</span><span class="now">${won(product.price)}</span></div></div>
</a>`;
const staticProductSummary=product=>`<div class="pd" id="pd">
  <div class="pd-media"><img src="${htmlEscape(thumbnailFor(product))}" alt="${htmlEscape(imageAlt(product))}" fetchpriority="high"></div>
  <div class="pd-info"><div class="crumb"><a href="index.html">홈</a> › <a href="shop.html">판매 상품</a> › ${htmlEscape(product.category)}</div><h1 class="name">걸스라미 ${htmlEscape(product.name)}</h1><p class="sub">${htmlEscape(leadFor(product))}</p><div class="price"><span class="price-label">스마트스토어 판매가</span><span class="now">${won(product.price)}</span></div><div class="pd-ship"><span>현재 옵션과 배송 조건은 스마트스토어에서 확인해 주세요.</span></div><div class="pd-cta"><a class="btn btn-accent btn-lg btn-block" href="${htmlEscape(product.storeUrl)}" target="_blank" rel="noopener">스마트스토어에서 구매하기 →</a></div></div>
</div>`;
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
  const html=template
    .replace('<title>상품 | 걸스라미 GIRLSRAMI</title>\n<meta name="robots" content="noindex,follow">',head)
    .replace('<body data-page="product">',`<body data-page="product" data-product-id="${htmlEscape(product.id)}">`)
    .replace('<div class="pd" id="pd"></div>',staticProductSummary(product));
  await writeFile(new URL(productPath(product),out),html);
}

for(const [name,count] of [['index.html',4],['shop.html',seo.products.length]]) {
  const path=new URL(name,out);
  const html=await readFile(path,'utf8');
  const id=name==='index.html'?'best-grid':'shop-grid';
  const cards=seo.products.slice(0,count).map(staticCard).join('\n');
  await writeFile(path,html.replace(`<div class="grid" id="${id}"></div>`,`<div class="grid" id="${id}">\n${cards}\n</div>`));
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
