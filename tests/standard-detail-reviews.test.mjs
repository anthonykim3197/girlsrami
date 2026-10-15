import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const context={window:{}};
vm.runInNewContext(readFileSync(new URL('../standard-detail.js',import.meta.url),'utf8'),context);
vm.runInNewContext(readFileSync(new URL('../smartstore-reviews.js',import.meta.url),'utf8'),context);
const product={id:'stripe-cable-half',reviews:[],rating:0,reviewCount:0};
const store='https://smartstore.naver.com/girlsrami/products/8424655623';
const render=(p=product)=>context.window.GRStandardDetail.reviewContent(p,store);

test('the source snapshot survives catalog hydration that clears product reviews and counts',()=>{
  assert.equal(typeof context.window.GRStandardDetail.reviewContent,'function');
  const {summary,html}=render();
  assert.match(summary,/href="#pd-reviews"/);
  assert.match(summary,/4\.75/);
  assert.match(summary,/4건/);
  assert.equal((html.match(/class="grsd-review-card"/g)||[]).length,4);
  assert.match(html,/2026-10-15/);
  assert.match(html,/스마트스토어/);
  assert.ok(html.indexOf('grsd-review-grid')<html.indexOf('<details'));
  assert.match(html,/★★★★☆/);
  assert.match(html,/5점 만점에 4점/);
  assert.equal((html.match(/data-review-image=/g)||[]).length,3);
  assert.equal((html.match(/일부 발췌/g)||[]).length,1);
});

test('products without a source snapshot have no invented rating or customer reviews',()=>{
  const {summary,html}=render({id:'no-import',reviews:[{text:'not imported',stars:5}],rating:5,reviewCount:900});
  assert.equal(summary,'');
  assert.doesNotMatch(html,/not imported|900|grsd-review-card/);
  assert.match(html,/구매확정/);
  assert.match(html,/Npay 결제내역/);
  assert.match(html,/help\.pay\.naver\.com/);
  assert.doesNotMatch(html,/<form|<textarea|type="submit"/);
});

test('external review strings stay text and unsafe photo URLs never become clickable images',()=>{
  context.window.GR_SMARTSTORE_REVIEWS['untrusted']={source:'naver-smartstore',url:store,checkedAt:'2026-10-15',rating:4,totalCount:1,reviews:[{id:'1',rating:4,author:'<img onerror="bad">',date:'2026-10-15',option:'<script>bad</script>',text:'<svg onload="bad"> & "quoted"',image:'javascript:alert(1)',kind:'일반'}]};
  const {html}=render({id:'untrusted'});
  assert.doesNotMatch(html,/<svg onload|<img onerror|<script>|javascript:|data-review-image=/);
  assert.match(html,/&lt;svg onload=&quot;bad&quot;&gt; &amp; &quot;quoted&quot;/);
  assert.match(html,/&lt;script&gt;bad&lt;\/script&gt;/);
});
