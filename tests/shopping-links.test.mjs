import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
const root=new URL('../dist/',import.meta.url),catalog=JSON.parse(readFileSync(new URL('../seo-products.json',import.meta.url),'utf8'));
test('all 23 sale pages keep exact approved purchase destinations and distinguish CTA positions',()=>{
 for(const p of catalog.products){const html=readFileSync(new URL(`product-${p.id}.html`,root),'utf8');const links=[...html.matchAll(/<a\b([^>]*data-gr-buy[^>]*)>/g)].map(x=>x[1]);assert.equal(links.length,2,p.id);assert.ok(links.every(a=>a.includes(`href="${p.storeUrl}"`)&&a.includes(`data-gr-product="${p.id}"`)),p.id);assert.ok(links.some(a=>a.includes('data-gr-placement="mobile_sticky"')));assert.match(html,/색상·사이즈는 스마트스토어에서 다시 선택해 주세요/)}
});
test('all generated local navigation links resolve to pages or actual anchors',()=>{
 const pages=new Map(readdirSync(root).filter(n=>n.endsWith('.html')).map(n=>[n,readFileSync(new URL(n,root),'utf8')]));
 for(const [name,html] of pages){for(const [,attrs,href] of html.matchAll(/<a\b([^>]*?)href="([^"]*)"[^>]*>/g)){
  if(/^[a-z]+:|^\/\//i.test(href)||href==='#chat')continue;
  const u=new URL(href,`https://example.com/${name}`);let target=u.pathname.slice(1)||'index.html';if(!target.includes('.'))target+='.html';assert.ok(pages.has(target),`${name}: ${href}`);if(u.hash)assert.ok(new RegExp(`id=["']${u.hash.slice(1)}["']`).test(pages.get(target)),`${name}: ${href}`);
 }}
 const guide=pages.get('guide.html');assert.match(guide,/href="https:\/\/talk\.naver\.com\/ct\/w4j7l2#nafullscreen"[^>]*>톡톡 상담하기/);
});
test('built tracking is loaded once and existing Cloudflare beacon is allowed by CSP without a second injected tag',()=>{
 for(const page of ['index.html','shop.html','cart.html','product-jo27-round-puff-cardigan.html']){const html=readFileSync(new URL(page,root),'utf8');assert.equal((html.match(/src="analytics\.js(?:\?[^" ]*)?"/g)||[]).length,1);assert.ok(!html.includes('static.cloudflareinsights.com/beacon'))}
 const headers=readFileSync(new URL('_headers',root),'utf8');assert.match(headers,/script-src 'self' https:\/\/static\.cloudflareinsights\.com;/);assert.match(headers,/connect-src 'self' https:\/\/cloudflareinsights\.com/);
});
