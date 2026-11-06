(() => {
 const $=s=>document.querySelector(s),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels={page_view:'페이지 조회',browser_sessions:'브라우저 세션',interaction_sessions:'옵션·구매 행동 세션',product_detail_view:'상품 상세 조회',option_select:'색상 선택',size_select:'사이즈 선택',buy_cta_click:'구매 버튼 클릭',smartstore_outbound_click:'스마트스토어 이동'};
 let days=7;
 function table(root,headers,rows){root.innerHTML=`<table><thead><tr>${headers.map(x=>`<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(x=>`<td>${escape(x)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">아직 기록이 없습니다.</td></tr>`}</tbody></table>`}
 async function load(){
  const status=$('#analytics-status'),button=$('#load-summary');button.disabled=true;status.textContent='집계를 불러오는 중…';
  try{
   const data=await GR.loadAnalyticsSummary(days);$('#analytics-results').hidden=false;$('#analytics-login').hidden=true;
   status.textContent=`최근 ${data.days}일 · ${new Date(data.generated_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} 기준`;
   $('#analytics-totals').innerHTML=['page_view','browser_sessions','product_detail_view','option_select','buy_cta_click','smartstore_outbound_click'].map(k=>`<article class="gr-stats-card"><span>${labels[k]}</span><strong>${Number(data.totals[k]||0).toLocaleString('ko-KR')}</strong></article>`).join('');
   table($('#analytics-products'),['상품','상세 조회','색상','사이즈','구매 버튼','외부 이동'],data.products.map(r=>[GR.byId(r.product_id)?.name||r.product_id,r.product_detail_view,r.option_select,r.size_select,r.buy_cta_click,r.smartstore_outbound_click]));
   table($('#analytics-attribution'),['유입 도메인','UTM 소스','매체','캠페인','세션','구매 버튼','외부 이동'],data.attribution.map(r=>[r.referrer||'직접 / 확인 불가',r.utm_source||'—',r.utm_medium||'—',r.utm_campaign||'—',r.browser_sessions,r.buy_cta_click,r.smartstore_outbound_click]));
   table($('#analytics-daily'),['날짜 (한국)','페이지 조회','세션','상세 조회','구매 버튼','외부 이동'],data.daily.map(r=>[r.day,r.page_view,r.browser_sessions,r.product_detail_view,r.buy_cta_click,r.smartstore_outbound_click]));
  }catch(error){status.textContent=error.message;$('#analytics-results').hidden=true}finally{button.disabled=false}
 }
 document.querySelectorAll('[data-days]').forEach(b=>b.onclick=()=>{days=Number(b.dataset.days);document.querySelectorAll('[data-days]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));load()});$('#load-summary').onclick=load;
 function debug(){const d=window.GRAnalytics.diagnostics();$('#debug-status').textContent=d.disabled?'분석 제외 설정이 켜져 있어 기록하지 않습니다.':d.debug?'확인 모드 · 이 탭에만 기록 중 · 운영 집계에는 미전송':'확인 모드 꺼짐 · 이전 확인 기록만 표시';table($('#debug-events'),['시간','이벤트','상품','색상 / 사이즈','버튼 위치'],d.events.slice().reverse().map(e=>[new Date(e.recorded_at).toLocaleTimeString('ko-KR'),labels[e.name]||e.name,GR.byId(e.product_id)?.name||e.product_id||'—',[e.color,e.size].filter(Boolean).join(' / ')||'—',({detail:'상품 상세',mobile_sticky:'모바일 하단',cart:'장바구니',review:'후기 링크',guide:'구매 안내',store:'스토어 링크'})[e.placement]||'—']))}
 $('#debug-start').onclick=()=>{window.GRAnalytics.setDebug(true);debug()};$('#debug-stop').onclick=()=>{window.GRAnalytics.setDebug(false);debug()};$('#debug-refresh').onclick=debug;debug();
})();
