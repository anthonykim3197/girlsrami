(() => {
 const $=s=>document.querySelector(s),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels={page_view:'페이지 조회',browser_sessions:'브라우저 세션',interaction_sessions:'옵션·구매 행동 세션',product_detail_view:'상품 상세 조회',option_select:'색상 선택',size_select:'사이즈 선택',buy_cta_click:'구매 버튼 클릭',smartstore_outbound_click:'스마트스토어 이동'};
 let days=7;
 let summaryRequest=0;
 function table(root,headers,rows){root.innerHTML=`<table><thead><tr>${headers.map(x=>`<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(x=>`<td>${escape(x)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">아직 기록이 없습니다.</td></tr>`}</tbody></table>`}
 async function load(){
  const request=++summaryRequest;
  const status=$('#analytics-status'),button=$('#load-summary');button.disabled=true;status.textContent='집계를 불러오는 중…';
  try{
   const data=await GR.loadAnalyticsSummary(days);if(request!==summaryRequest)return;$('#analytics-results').hidden=false;$('#analytics-login').hidden=true;
   status.textContent=`최근 ${data.days}일 · ${new Date(data.generated_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} 기준`;
   $('#analytics-totals').innerHTML=['page_view','browser_sessions','product_detail_view','option_select','buy_cta_click','smartstore_outbound_click'].map(k=>`<article class="gr-stats-card"><span>${labels[k]}</span><strong>${Number(data.totals[k]||0).toLocaleString('ko-KR')}</strong></article>`).join('');
   table($('#analytics-products'),['상품','상세 조회','색상','사이즈','구매 버튼','외부 이동'],data.products.map(r=>[GR.byId(r.product_id)?.name||r.product_id,r.product_detail_view,r.option_select,r.size_select,r.buy_cta_click,r.smartstore_outbound_click]));
   table($('#analytics-attribution'),['유입 도메인','UTM 소스','매체','캠페인','세션','구매 버튼','외부 이동'],data.attribution.map(r=>[r.referrer||'직접 / 확인 불가',r.utm_source||'—',r.utm_medium||'—',r.utm_campaign||'—',r.browser_sessions,r.buy_cta_click,r.smartstore_outbound_click]));
   table($('#analytics-daily'),['날짜 (한국)','페이지 조회','세션','상세 조회','구매 버튼','외부 이동'],data.daily.map(r=>[r.day,r.page_view,r.browser_sessions,r.product_detail_view,r.buy_cta_click,r.smartstore_outbound_click]));
   void loadSmartstore(request);
  }catch(error){if(request===summaryRequest){status.textContent=error.message;$('#analytics-results').hidden=true}}finally{if(request===summaryRequest)button.disabled=false}
 }
 document.querySelectorAll('[data-days]').forEach(b=>b.onclick=()=>{days=Number(b.dataset.days);document.querySelectorAll('[data-days]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));load()});$('#load-summary').onclick=load;
 const salesFile = $('#sales-file');
 const salesStatus = $('#sales-status');
 const salesResults = $('#sales-results');
 const number = value => value.toLocaleString('ko-KR');
 const money = value => number(value) + '원';
 const cards = totals => totals.map(([label, value]) =>
  `<article class="gr-stats-card"><span>${escape(label)}</span><strong>${escape(value)}</strong></article>`).join('');
 const smartstoreStatus = $('#smartstore-status');
 const smartstoreResults = $('#smartstore-results');

 async function loadSmartstore(request) {
  smartstoreStatus.textContent = '스마트스토어 집계를 불러오는 중…';
  try {
   const { snapshot } = await GR.loadSmartstoreSummary();
   if (request !== summaryRequest) return;
   smartstoreResults.hidden = !snapshot;
   if (!snapshot) {
    smartstoreStatus.textContent = '아직 수집된 스마트스토어 집계가 없습니다.';
    return;
   }
   const time = new Date(snapshot.collectedAt);
   const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
   const outdated = snapshot.date !== today || Date.now() - time.getTime() > 30 * 60 * 1000;
   const updated = time.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
   smartstoreStatus.textContent = `${snapshot.date} 결제 주문 · 마지막 수집 ${updated}${outdated ? ' · 갱신 지연' : ''}`;
   const { sales, orderStatus, claims } = snapshot;
   $('#smartstore-totals').innerHTML = cards([
    ['결제 주문 수', number(sales.orders)],
    ['최초 상품결제금액', money(sales.initialProductPayment)],
    ['발주 미확인 상품주문', number(orderStatus.awaitingConfirmation)],
    ['발송 대기 상품주문', number(orderStatus.awaitingShipment)],
    ['배송 중 상품주문', number(orderStatus.shipping)],
    ['진행 중 취소 / 반품 / 교환', [claims.CANCEL, claims.RETURN, claims.EXCHANGE].map(number).join(' / ')],
    ['미답변 상품 문의 (해당일 등록)', number(snapshot.unansweredProductInquiries)]
   ]);
   table($('#smartstore-settlement'), ['정산 예정일', '정산 완료일', '정산 금액', '수수료'],
    snapshot.settlement.map(row => [row.expectedDate ?? '—', row.completedDate ?? '—',
     row.amount === null ? '—' : money(row.amount), row.commission === null ? '—' : money(row.commission)]));
  } catch {
   if (request !== summaryRequest) return;
   smartstoreResults.hidden = true;
   smartstoreStatus.textContent = '스마트스토어 집계를 불러오지 못했습니다.';
  }
 }
 let salesImport = 0;

 salesFile.onchange = async () => {
  const file = salesFile.files[0];
  if (!file) return;
  salesFile.value = '';
  const currentImport = ++salesImport;
  salesResults.hidden = true;
  salesStatus.textContent = '판매 파일을 읽는 중…';
  try {
   if (file.size > 10 * 1024 * 1024) throw new Error('10 MB 이하의 CSV 파일을 선택해 주세요.');
   const summary = GRSales.summarize(await file.text());
   if (currentImport !== salesImport) return;
   const totals = [['주문 수', number(summary.orders)], ['판매 수량', number(summary.quantity)],
    ['상품결제금액', money(summary.amount)]];
   $('#sales-totals').innerHTML = cards(totals);
   table($('#sales-daily'), ['결제일', '주문 수', '판매 수량', '상품결제금액'],
    summary.daily.map(([date, day]) => [date, number(day.orders), number(day.quantity), money(day.amount)]));
   table($('#sales-products'), ['상품', '판매 수량', '상품결제금액'],
    summary.products.map(([product, sales]) => [product, number(sales.quantity), money(sales.amount)]));
   salesStatus.textContent = summary.daily.length
    ? `파일의 결제일 범위 · ${summary.daily[0][0]} ~ ${summary.daily.at(-1)[0]}`
    : '파일에 판매 기록이 없습니다.';
   salesResults.hidden = false;
  } catch (error) {
   if (currentImport === salesImport) salesStatus.textContent = error.message;
  }
 };

 $('#sales-clear').onclick = () => {
  salesImport++;
  for (const id of ['sales-totals', 'sales-daily', 'sales-products']) document.getElementById(id).replaceChildren();
  salesResults.hidden = true;
  salesStatus.textContent = '판매 파일을 선택하면 이 탭에서 집계합니다.';
 };
 function debug(){const d=window.GRAnalytics.diagnostics();$('#debug-status').textContent=d.disabled?'분석 제외 설정이 켜져 있어 기록하지 않습니다.':d.debug?'확인 모드 · 이 탭에만 기록 중 · 운영 집계에는 미전송':'확인 모드 꺼짐 · 이전 확인 기록만 표시';table($('#debug-events'),['시간','이벤트','상품','색상 / 사이즈','버튼 위치'],d.events.slice().reverse().map(e=>[new Date(e.recorded_at).toLocaleTimeString('ko-KR'),labels[e.name]||e.name,GR.byId(e.product_id)?.name||e.product_id||'—',[e.color,e.size].filter(Boolean).join(' / ')||'—',({detail:'상품 상세',mobile_sticky:'모바일 하단',cart:'장바구니',review:'후기 링크',guide:'구매 안내',store:'스토어 링크'})[e.placement]||'—']))}
 $('#debug-start').onclick=()=>{window.GRAnalytics.setDebug(true);debug()};$('#debug-stop').onclick=()=>{window.GRAnalytics.setDebug(false);debug()};$('#debug-refresh').onclick=debug;debug();
})();
