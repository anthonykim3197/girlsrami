import { db, user, result, privateUrl } from './backend.mjs';
import { escapeHtml as e } from './domain.mjs';
import { $, status } from './ui.mjs';

const labels = { queued: '생성 대기', running: 'GPU 생성 중', completed: '완료', failed: '생성 실패', cancelled: '취소됨' };
export async function syntheticFittingPage(root) {
  if (!user) {
    root.innerHTML = '<h1>가상 이미지 피팅 시험</h1><p>시험 계정으로 로그인해 주세요.</p><a class="btn btn-ghost" href="account.html">로그인</a>';
    return;
  }
  const session = await result(db.from('fitting_test_sessions').select('*').maybeSingle());
  if (!session || !session.enabled || Date.parse(session.expires_at) <= Date.now()) {
    root.innerHTML = '<h1>가상 이미지 피팅 시험</h1><p>활성 시험이 없어요. 고객용 사진 피팅은 준비 중이에요.</p>';
    return;
  }
  const product = await result(db.from('products').select('payload').eq('id', session.product_id).single());
  const garment = product.payload.colorPhotos[session.color].image;
  root.innerHTML = `<h1>가상 이미지 피팅 시험</h1><p>AI로 만든 성인과 니트로 시험해요. 실제 판매 상품이나 고객 사진이 아니에요.</p><p class="help">시험은 ${e(new Date(session.expires_at).toLocaleTimeString('ko-KR'))}까지 가능해요. 일반 고객의 사진 접수는 꺼져 있어요.</p>
    <div class="fitting-layout"><section class="panel stack"><h2>시험 이미지</h2><figure><img class="private-preview" id="test-person" alt="AI로 만든 가상 성인의 일상 사진"><figcaption>가상 성인 · 입력 이미지</figcaption></figure><figure><img class="private-preview" src="${e(garment)}" alt="AI로 만든 초록 케이블 가디건"><figcaption>가상 니트 · 실제 상품 검증 전</figcaption></figure></section>
    <section class="panel stack"><h2>GPU 피팅 결과</h2><div class="action-row"><button class="btn btn-accent" data-action id="test-create">시험 피팅 만들기</button><button class="btn btn-ghost" data-action id="test-refresh">결과 새로고침</button></div><p role="status" data-status></p><div id="test-jobs" class="stack"></div><button class="btn btn-ghost" data-action id="test-delete">시험 사진·결과 삭제</button><p class="help">삭제하면 시험이 종료돼요. 실제 상품의 색상·무늬·사이즈 정확도는 별도로 확인해야 해요.</p></section></div>`;
  $('#test-person', root).src = await privateUrl(session.input_path);
  let requestKey = null;
  let poll;
  let busy = false;
  let closed = false;
  let active = false;
  function controls() {
    root.querySelectorAll('button').forEach(button => button.disabled = busy);
    if ($('#test-create', root)) $('#test-create', root).disabled = busy || active;
  }
  async function run(task) {
    if (busy || closed) return;
    busy = true; controls(); status(root, '처리 중…');
    try { await task(); }
    catch (error) { closed = false; status(root, error.message || '처리하지 못했어요. 다시 시도해 주세요.', true); }
    finally { busy = false; controls(); }
  }
  async function refresh() {
    const jobs = await result(db.from('fitting_jobs').select('id,status,error_code,output_path').eq('is_synthetic_test', true).order('created_at', { ascending: false }).limit(3));
    if (closed) return;
    $('#test-jobs', root).innerHTML = jobs.map(job => `<article class="stack"><h3>${e(labels[job.status])}</h3>${job.status === 'failed' ? '<p>생성하지 못했어요. 운영 기록을 확인해 주세요.</p>' : ''}${job.output_path ? `<figure><img class="private-preview" data-result="${e(job.id)}" alt="가상 성인에게 초록 가디건을 입힌 AI 시험 결과"><figcaption>AI 피팅 시험 결과</figcaption></figure>` : ''}${['queued', 'running'].includes(job.status) ? `<button class="btn btn-ghost" data-cancel="${e(job.id)}">생성 취소</button>` : ''}</article>`).join('') || '<p>아직 시험 결과가 없어요.</p>';
    for (const job of jobs) if (job.output_path) {
      const url = await privateUrl(job.output_path);
      if (closed) return;
      const image = $(`[data-result="${job.id}"]`, root);
      if (image) image.src = url;
    }
    active = jobs.some(job => ['queued', 'running'].includes(job.status));
    controls();
    if (!active) requestKey = null;
    root.querySelectorAll('[data-cancel]').forEach(button => button.onclick = () => run(async () => {
      await result(db.rpc('cancel_fit_job', { job_id: button.dataset.cancel }));
      await refresh(); status(root, '생성을 취소했어요.');
    }));
    clearTimeout(poll);
    if (active && !closed) poll = setTimeout(() => refresh().catch(() => status(root, '결과를 불러오지 못했어요. 새로고침해 주세요.', true)), 5000);
  }
  $('#test-create', root).onclick = () => run(async () => {
    requestKey ??= crypto.randomUUID();
    await result(db.rpc('create_fitting_test_job', { request_key: requestKey }));
    await refresh(); status(root, '시험을 요청했어요. GPU가 준비되면 생성해요.');
  });
  $('#test-refresh', root).onclick = () => run(async () => {
    await refresh(); status(root, '결과를 확인했어요.');
  });
  $('#test-delete', root).onclick = () => run(async () => {
    clearTimeout(poll);
    closed = true;
    const paths = await result(db.rpc('begin_fitting_test_withdrawal'));
    if (paths.length) await result(db.storage.from('fitting-private').remove(paths));
    await result(db.rpc('erase_fitting_test_data'));
    root.innerHTML = '<h1>시험 종료</h1><p role="status">시험 사진과 결과를 삭제했어요. 일반 고객의 사진 접수는 계속 꺼져 있어요.</p>';
  });
  await refresh();
  window.addEventListener('pagehide', () => clearTimeout(poll), { once: true });
}
