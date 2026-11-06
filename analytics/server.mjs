// First-party shopping signals. A recorded click is never an order or proof of a human.
export const eventNames = ['page_view','product_detail_view','option_select','size_select','buy_cta_click','smartstore_outbound_click'];
const fields=['id','session_id','name','path','product_id','color','size','placement','referrer','utm_source','utm_medium','utm_campaign'];
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const token=/^[a-zA-Z0-9_.-]{0,80}$/;
const publicPath=/^\/(?:index|shop|story|guide|cart|privacy|terms|product-[a-z0-9-]{1,80})?$/;
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export function validateEvent(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!fields.includes(k)))return null;
  if(!uuid.test(input.id)||!uuid.test(input.session_id)||!eventNames.includes(input.name)||!publicPath.test(input.path))return null;
  const out=Object.fromEntries(fields.map(k=>[k,input[k]??'']));
  if(fields.some(k=>typeof out[k]!=='string'))return null;
  if(!/^[a-z0-9-]{0,80}$/.test(out.product_id)||!['','detail','mobile_sticky','cart','header','footer','review','guide','store'].includes(out.placement))return null;
  if(!/^[\p{L}\p{N} ()/_.-]{0,40}$/u.test(out.color)||!/^[\p{L}\p{N} ()/_.-]{0,40}$/u.test(out.size))return null;
  if(!/^(?:[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?)?$/.test(out.referrer))return null;
  if(['utm_source','utm_medium','utm_campaign'].some(k=>!token.test(out[k])))return null;
  if(['product_detail_view','option_select','size_select','buy_cta_click'].includes(out.name)&&!out.product_id)return null;
  return out;
}
export async function recordEvent(db,input){
  const event=validateEvent(input);if(!event)throw new Error('Invalid shopping event');
  await db.batch([
    db.prepare("DELETE FROM analytics_events WHERE created_at < datetime('now','-90 days')").bind(),
    db.prepare(`INSERT OR IGNORE INTO analytics_events (${fields.join(',')}) SELECT ${fields.map(()=>'?').join(',')} WHERE (SELECT COUNT(*) FROM analytics_events WHERE session_id=? AND created_at>=datetime('now','-1 day'))<500`).bind(...fields.map(k=>event[k]),event.session_id)
  ]);
}
export async function summary(db,days){
  const bounded=[1,7,30].includes(Number(days))?Number(days):30;
  const period=`-${bounded} days`,where="created_at >= datetime('now',?)";
  const counts=eventNames.map(n=>`SUM(CASE WHEN name='${n}' THEN 1 ELSE 0 END) AS ${n}`).join(',');
  const [total,products,attribution,daily]=await Promise.all([
    db.prepare(`SELECT COUNT(DISTINCT session_id) AS browser_sessions, COUNT(DISTINCT CASE WHEN name IN ('option_select','size_select','buy_cta_click') THEN session_id END) AS interaction_sessions, ${counts} FROM analytics_events WHERE ${where}`).bind(period).all(),
    db.prepare(`SELECT product_id,${counts} FROM analytics_events WHERE ${where} AND product_id<>'' GROUP BY product_id ORDER BY product_detail_view DESC LIMIT 100`).bind(period).all(),
    db.prepare(`SELECT referrer,utm_source,utm_medium,utm_campaign,COUNT(DISTINCT session_id) AS browser_sessions,${counts} FROM analytics_events WHERE ${where} GROUP BY referrer,utm_source,utm_medium,utm_campaign ORDER BY browser_sessions DESC LIMIT 100`).bind(period).all(),
    db.prepare(`SELECT date(created_at,'+9 hours') AS day,COUNT(DISTINCT session_id) AS browser_sessions,${counts} FROM analytics_events WHERE ${where} GROUP BY day ORDER BY day`).bind(period).all()
  ]);
  const normalize=rows=>rows.map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,v??0])));
  return {days:bounded,generated_at:new Date().toISOString(),timezone:'Asia/Seoul',retention_days:90,totals:normalize(total.results)[0],products:normalize(products.results),attribution:normalize(attribution.results),daily:normalize(daily.results),purchase:{status:'unknown',count:null,reason:'SmartStore order data is not connected'},notes:['Browser sessions are not unique people.','Client-side events can be blocked, automated or forged.','Buy CTA clicks and SmartStore outbound clicks overlap; do not sum them.']};
}
export async function collect(request,env){
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  const origin=request.headers.get('origin');
  if(origin!==new URL(request.url).origin)return json({error:'origin_not_allowed'},403);
  if(/bot|crawler|spider|headless|facebookexternalhit|slurp/i.test(request.headers.get('user-agent')||''))return new Response(null,{status:204});
  if(!env.ANALYTICS)return json({error:'analytics_not_configured'},503);
  if(Number(request.headers.get('content-length'))>2048)return json({error:'payload_too_large'},413);
  let input;
  const reader=request.body?.getReader();
  if(!reader)return json({error:'invalid_json'},400);
  try{
    const decoder=new TextDecoder('utf-8',{fatal:true});let bytes=0,raw='';
    while(true){
      const {done,value}=await reader.read();if(done)break;
      bytes+=value.byteLength;
      if(bytes>2048){await reader.cancel();return json({error:'payload_too_large'},413)}
      raw+=decoder.decode(value,{stream:true});
    }
    input=JSON.parse(raw+decoder.decode());
  }catch{await reader.cancel().catch(()=>{});return json({error:'invalid_json'},400)}
  finally{reader.releaseLock()}
  const event=validateEvent(input);if(!event)return json({error:'invalid_event'},400);
  try{await recordEvent(env.ANALYTICS,event);return new Response(null,{status:204,headers:{'cache-control':'no-store'}})}catch{return json({error:'temporarily_unavailable'},503)}
}
export async function readSummary(request,env,verifyAdmin){
  if(request.method!=='GET')return json({error:'method_not_allowed'},405);
  const authorization=request.headers.get('authorization')||'';
  if(!/^Bearer [A-Za-z0-9._-]+$/.test(authorization))return json({error:'login_required'},401);
  try{if(!await verifyAdmin(authorization))return json({error:'admin_required'},403)}catch{return json({error:'auth_unavailable'},503)}
  if(!env.ANALYTICS)return json({error:'analytics_not_configured'},503);
  try{return json(await summary(env.ANALYTICS,new URL(request.url).searchParams.get('days')))}catch{return json({error:'temporarily_unavailable'},503)}
}
