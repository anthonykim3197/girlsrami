/* First-party, cookie-free shopping telemetry. No order or human-visitor inference. */
(() => {
  'use strict';
  if(window.GRAnalytics)return;
  const keys={session:'gr_analytics_session_v1',debug:'gr_analytics_debug_v1',events:'gr_analytics_debug_events_v1',optout:'gr_analytics_disabled'};
  const read=(storage,key)=>{try{return storage.getItem(key)}catch{return null}};
  const write=(storage,key,value)=>{try{storage.setItem(key,value)}catch{}};
  const parse=value=>{try{return JSON.parse(value)}catch{return null}};
  const query=new URLSearchParams(location.search);
  if(query.get('analytics_debug')==='1')write(sessionStorage,keys.debug,'1');
  const cleanToken=value=>/^[a-zA-Z0-9_.-]{1,80}$/.test(value||'')?value:'';
  const productId=()=>/^\/product(?:-|\.|$)/.test(location.pathname)&&(document.body?.dataset.productId||(/^\/product-([a-z0-9-]+)(?:\.html)?$/.exec(location.pathname)?.[1])||(/^product(?:\.html)?$/.test(location.pathname.slice(1))?query.get('id'):'')||'')||'';
  const path=()=>{
    const id=productId();if(/^[a-z0-9-]{1,80}$/.test(id))return '/product-'+id;
    const value=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
    return /^\/(?:index|shop|story|guide|cart|privacy|terms)?$/.test(value)?value:null;
  };
  const referrer=()=>{try{const u=new URL(document.referrer);return u.origin===location.origin?'':u.hostname}catch{return ''}};
  let currentSession,localEvents=parse(read(sessionStorage,keys.events))||[];
  if(!Array.isArray(localEvents))localEvents=[];
  const session=()=>{
    const now=Date.now(),saved=currentSession||parse(read(sessionStorage,keys.session));
    if(!saved||now-saved.last>30*60*1000){currentSession={id:crypto.randomUUID(),last:now,referrer:referrer(),utm_source:cleanToken(query.get('utm_source')),utm_medium:cleanToken(query.get('utm_medium')),utm_campaign:cleanToken(query.get('utm_campaign'))}}
    else currentSession=saved;
    currentSession.last=now;write(sessionStorage,keys.session,JSON.stringify(currentSession));return currentSession;
  };
  const debug=()=>read(sessionStorage,keys.debug)==='1';
  const disabled=()=>navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true||read(localStorage,keys.optout)==='1';
  let transport='not_sent';
  const selected=()=>({color:document.querySelector('#color-opts .active')?.dataset.c||'',size:document.querySelector('#size-opts .active')?.dataset.s||''});
  function emit(name,details={}){
    const page=path();if(!page||disabled())return;
    try{
      const s=session(),event={id:crypto.randomUUID(),session_id:s.id,name,path:page,product_id:details.product_id||'',color:details.color||'',size:details.size||'',placement:details.placement||'',referrer:s.referrer,utm_source:s.utm_source,utm_medium:s.utm_medium,utm_campaign:s.utm_campaign};
      if(debug()){
        localEvents=[...localEvents,{...event,recorded_at:new Date().toISOString()}].slice(-200);write(sessionStorage,keys.events,JSON.stringify(localEvents));transport='debug_local_only';return;
      }
      const body=JSON.stringify(event);
      if(navigator.sendBeacon?.('/api/analytics',new Blob([body],{type:'application/json'}))){transport='queued';return;}
      transport='pending';fetch('/api/analytics',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true,credentials:'omit'}).then(r=>{transport=r.ok?'accepted':'rejected'}).catch(()=>{transport='failed'});
    }catch{transport='unavailable'}
  }
  const viewed=new Set();let counted=false,pendingProduct=null;
  function pageView(){if(document.visibilityState==='hidden')return;if(!counted){counted=true;emit('page_view',{product_id:productId()})}if(pendingProduct){const product=pendingProduct;pendingProduct=null;api.viewProduct(product)}}
  const api={
    viewProduct(product){if(!product?.id||viewed.has(product.id))return;if(document.visibilityState==='hidden'){pendingProduct=product;return}viewed.add(product.id);emit('product_detail_view',{product_id:product.id,placement:'detail'})},
    diagnostics(){return {debug:debug(),disabled:disabled(),transport,events:localEvents.slice(),purchase:{status:'unknown',count:null}}},
    setDebug(enabled){write(sessionStorage,keys.debug,enabled?'1':'0');if(enabled){localEvents=[];write(sessionStorage,keys.events,'[]')}},
    setOptOut(value){write(localStorage,keys.optout,value?'1':'0')}
  };
  window.GRAnalytics=Object.freeze(api);
  document.addEventListener('visibilitychange',pageView);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pageView,{once:true});else pageView();
  function click(event){
    if(event.defaultPrevented||(event.type==='auxclick'&&event.button!==1)||event.button>1)return;
    const option=event.target.closest?.('[data-c],[data-gallery-color],[data-s]');
    if(option&&!option.disabled&&productId()){
      const size=option.dataset.s;emit(size?'size_select':'option_select',{product_id:productId(),...selected(),...(size?{size}:{color:option.dataset.c||option.dataset.galleryColor}),placement:'detail'});
    }
    const anchor=event.target.closest?.('a[href]');if(!anchor||anchor.getAttribute('aria-disabled')==='true')return;
    let target;try{target=new URL(anchor.href)}catch{return}
    if(target.protocol!=='https:'||target.hostname!=='smartstore.naver.com'||!/^\/girlsrami(?:\/products\/\d+)?\/?$/.test(target.pathname))return;
    const isBuy=Object.hasOwn(anchor.dataset,'grBuy');
    const context={product_id:anchor.dataset.grProduct||productId(),...selected(),placement:anchor.dataset.grPlacement||'store'};
    if(isBuy&&context.product_id)emit('buy_cta_click',context);
    emit('smartstore_outbound_click',context);
  }
  document.addEventListener('click',click);
  document.addEventListener('auxclick',click);
})();
