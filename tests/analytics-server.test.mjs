import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const source = new URL('../analytics/server.mjs', import.meta.url);
const mod = existsSync(source) ? await import(source) : {};
const event = (overrides={}) => ({id:crypto.randomUUID(),session_id:crypto.randomUUID(),name:'product_detail_view',path:'/product-demo',product_id:'demo',color:'아이보리',size:'FREE',placement:'detail',referrer:'search.naver.com',utm_source:'naver',utm_medium:'social',utm_campaign:'november',...overrides});
function db(){
 const sql = new DatabaseSync(':memory:'); sql.exec(readFileSync(new URL('../analytics/schema.sql',import.meta.url),'utf8'));
 return {prepare(text){return {bind(...params){return {async run(){return sql.prepare(text).run(...params)},async all(){return {results:sql.prepare(text).all(...params)}}}}}},async batch(statements){return Promise.all(statements.map(s=>s.run()))},sql};
}
test('only known shopping events enter the contract; purchase and arbitrary data are rejected',()=>{
 assert.equal(typeof mod.validateEvent,'function');
 assert.equal(mod.validateEvent(event()).name,'product_detail_view');
 for(const value of [event({name:'purchase'}),event({email:'me@example.com'}),event({path:'/account?email=a'}),event({product_id:'<script>'}),event({utm_source:'name@example.com'}),event({referrer:'https://search.naver.com/private?query=secret'})])assert.equal(mod.validateEvent(value),null);
});
test('recording is idempotent, aggregates by product and attribution, and never returns invented orders',async()=>{
 assert.equal(typeof mod.recordEvent,'function');const store=db(),session=crypto.randomUUID(),one=event({session_id:session});
 await mod.recordEvent(store,one);await mod.recordEvent(store,one);
 await mod.recordEvent(store,event({session_id:session,name:'buy_cta_click'}));await mod.recordEvent(store,event({session_id:session,name:'smartstore_outbound_click'}));
 await mod.recordEvent(store,event({name:'page_view',product_id:'',path:'/shop'}));
 const result=await mod.summary(store,7);
 assert.equal(result.totals.product_detail_view,1);assert.equal(result.totals.buy_cta_click,1);assert.equal(result.totals.smartstore_outbound_click,1);assert.equal(result.totals.browser_sessions,2);assert.equal(result.purchase.status,'unknown');assert.equal(result.purchase.count,null);
 assert.equal(result.products[0].product_id,'demo');assert.equal(result.attribution[0].utm_source,'naver');
 assert.equal(JSON.stringify(result).includes(session),false);
});
test('old events do not appear in the selected period and expired events are deleted',async()=>{
 assert.equal(typeof mod.recordEvent,'function');const store=db();
 await mod.recordEvent(store,event());store.sql.exec("UPDATE analytics_events SET created_at=datetime('now','-100 days')");
 await mod.recordEvent(store,event());
 assert.equal(store.sql.prepare('SELECT COUNT(*) AS n FROM analytics_events').get().n,1);
 assert.equal((await mod.summary(store,1)).totals.product_detail_view,1);
});
test('collector rejects other origins, bots, malformed input and unconfigured storage',async()=>{
 assert.equal(typeof mod.collect,'function');
 const request=(body=event(),headers={})=>new Request('https://girlslami.com/api/analytics',{method:'POST',headers:{origin:'https://girlslami.com','content-type':'application/json',...headers},body:JSON.stringify(body)});
 assert.equal((await mod.collect(request(),{})).status,503);
 assert.equal((await mod.collect(request(event(),{origin:'https://evil.example'}),{})).status,403);
 assert.equal((await mod.collect(request(event(),{'user-agent':'Googlebot'}),{})).status,204);
 const store=db();assert.equal((await mod.collect(request(event({name:'purchase'})),{ANALYTICS:store})).status,400);
 assert.equal((await mod.collect(request(),{ANALYTICS:store})).status,204);
});
test('summary endpoint requires a server-verified administrator and hides raw events',async()=>{
 assert.equal(typeof mod.readSummary,'function');const store=db();
 const request=new Request('https://girlslami.com/api/analytics-summary?days=999');
 assert.equal((await mod.readSummary(request,{ANALYTICS:store},async()=>true)).status,401);
 const auth=new Request(request,{headers:{authorization:'Bearer test-token'}});
 assert.equal((await mod.readSummary(auth,{ANALYTICS:store},async()=>false)).status,403);
 const response=await mod.readSummary(auth,{ANALYTICS:store},async()=>true);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');assert.equal((await response.json()).days,30);
});
