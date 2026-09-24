/* 걸스라미 자동상담 위젯
   - 룰 엔진(chat-rules.js)이 먼저 즉답 → 안 걸리면 GR.CHAT_ENDPOINT 서버(AI)로 전달
   - 대화는 이 브라우저(sessionStorage)에만 저장. 서버는 일 100회 제한.
*/
(function () {
  if (!window.GR || !GR.rules) return;
  const ENDPOINT = (GR.CHAT_ENDPOINT || '').replace(/\/$/, '');
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'gr_chat_v1';
  const state = { open: false, msgs: [], busy: false, ai: null, seenIntro: false };
  try { const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (saved && Array.isArray(saved.msgs)) { state.msgs = saved.msgs.slice(-40); state.seenIntro = !!saved.seenIntro; } } catch {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ msgs: state.msgs.slice(-40), seenIntro: state.seenIntro })); } catch {} };
  const inHours = () => {
    const kst = new Date(Date.now() + (9 * 60 + new Date().getTimezoneOffset()) * 60000);
    const d = kst.getDay(), h = kst.getHours() + kst.getMinutes() / 60;
    return d >= 1 && d <= 5 && h >= 10 && h < 18 && !(h >= 12.5 && h < 13.5);
  };

  /* ---------- DOM ---------- */
  const root = document.createElement('div');
  root.id = 'gr-chat';
  root.innerHTML = `
    <button class="gr-chat-fab" id="gr-chat-fab" aria-label="상담 열기" aria-expanded="false">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 1 1 21 12z"/></svg>
      <span>상담</span>
      <i class="gr-chat-dot" id="gr-chat-dot"></i>
    </button>
    <section class="gr-chat-panel" id="gr-chat-panel" role="dialog" aria-label="걸스라미 자동상담" hidden>
      <header class="gr-chat-head">
        <div class="gr-chat-avatar">GR</div>
        <div class="gr-chat-title">
          <b>걸스라미 상담</b>
          <small id="gr-chat-status">24시간 자동응답</small>
        </div>
        <button class="gr-chat-close" id="gr-chat-close" aria-label="닫기">×</button>
      </header>
      <div class="gr-chat-body" id="gr-chat-body" aria-live="polite"></div>
      <div class="gr-chat-quick" id="gr-chat-quick"></div>
      <form class="gr-chat-form" id="gr-chat-form" autocomplete="off">
        <input id="gr-chat-input" type="text" maxlength="300" placeholder="배송, 사이즈, 교환 등 무엇이든 물어보세요" aria-label="메시지 입력">
        <button type="submit" id="gr-chat-send" aria-label="보내기">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
        </button>
      </form>
      <footer class="gr-chat-foot">
        <span id="gr-chat-foot-text">자주 묻는 질문은 바로 답하고, 그 외 질문은 AI 상담원이 답해요.</span>
        <a href="${esc(GR.TALK_URL)}" target="_blank" rel="noopener">톡톡 상담</a>
      </footer>
    </section>`;
  document.body.appendChild(root);

  const fab = $('#gr-chat-fab'), panel = $('#gr-chat-panel'), body = $('#gr-chat-body'), quick = $('#gr-chat-quick');
  const form = $('#gr-chat-form'), input = $('#gr-chat-input'), sendBtn = $('#gr-chat-send'), status = $('#gr-chat-status'), dot = $('#gr-chat-dot');

  function render() {
    body.innerHTML = state.msgs.map(m => {
      if (m.role === 'user') return `<div class="gr-msg gr-user"><div class="gr-bubble">${esc(m.text)}</div></div>`;
      const tag = m.source === 'ai' ? '<span class="gr-tag gr-tag-ai">AI 답변</span>' : m.source === 'rule' ? '<span class="gr-tag">안내</span>' : m.source === 'sys' ? '<span class="gr-tag gr-tag-sys">알림</span>' : '';
      const link = m.link ? `<a class="gr-link" href="${esc(m.link)}">${esc(m.linkText || '자세히 보기')} →</a>` : '';
      return `<div class="gr-msg gr-bot"><div class="gr-bubble">${esc(m.text)}${link}</div>${tag}</div>`;
    }).join('') + (state.busy ? '<div class="gr-msg gr-bot"><div class="gr-bubble gr-typing"><i></i><i></i><i></i></div></div>' : '');
    body.scrollTop = body.scrollHeight;
  }
  function push(m) { state.msgs.push(m); save(); render(); }
  function setBusy(b) { state.busy = b; input.disabled = b; sendBtn.disabled = b; render(); }
  function renderQuick() {
    quick.innerHTML = GR.rules.QUICK.map(q => `<button type="button" data-msg="${esc(q.msg)}">${esc(q.label)}</button>`).join('');
  }
  quick.addEventListener('click', e => { const b = e.target.closest('button[data-msg]'); if (b) ask(b.dataset.msg); });

  async function health() {
    if (!ENDPOINT) { state.ai = { ok: false }; return; }
    try {
      const r = await fetch(ENDPOINT + '/health', { cache: 'no-store' });
      state.ai = r.ok ? await r.json() : { ok: false };
    } catch { state.ai = { ok: false }; }
    const ok = state.ai && state.ai.ok && state.ai.remaining > 0;
    dot.classList.toggle('on', ok);
    status.textContent = ok ? `24시간 자동응답 · AI 상담 오늘 ${state.ai.remaining}회 남음` : (inHours() ? '자동응답 · 상담원은 톡톡에서 연결' : '자동응답 (상담원 평일 10~18시)');
  }

  function intro() {
    if (state.seenIntro) return;
    state.seenIntro = true;
    push({ role: 'bot', source: 'rule', text: inHours()
      ? '안녕하세요, 걸스라미 상담입니다. 배송, 교환·반품, 사이즈, 사은품, 입고 일정을 바로 안내드려요. 주문 관련 문의는 톡톡에서 상담원이 도와드려요.'
      : '안녕하세요, 걸스라미 상담입니다. 지금은 상담원 근무 시간이 아니지만 배송, 교환·반품, 사이즈, 입고 일정 등은 여기서 바로 답해드릴 수 있어요.' });
  }

  async function ask(text) {
    text = String(text || '').trim();
    if (!text || state.busy) return;
    push({ role: 'user', text });
    input.value = '';
    // 1) 룰 엔진 즉답
    const hit = GR.rules.match(text, GR.PRODUCTS);
    if (hit) { await new Promise(r => setTimeout(r, 350)); push({ role: 'bot', source: 'rule', text: hit.text, link: hit.link, linkText: hit.linkText }); return; }
    // 2) AI 서버
    if (!ENDPOINT || (state.ai && state.ai.ok === false)) {
      push({ role: 'bot', source: 'sys', text: '이 질문은 상담원 확인이 필요해요. 네이버 톡톡(평일 10~18시)으로 남겨주시면 영업시간에 답변드릴게요.', link: GR.TALK_URL, linkText: '톡톡으로 문의' });
      return;
    }
    setBusy(true);
    try {
      const history = state.msgs.filter(m => m.source !== 'sys').slice(-13, -1).map(m => ({ role: m.role === 'user' ? 'user' : 'bot', text: m.text }));
      const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 60000);
      const r = await fetch(ENDPOINT + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history }), signal: ctrl.signal });
      clearTimeout(to);
      const d = await r.json().catch(() => ({}));
      setBusy(false);
      if (r.ok && d.reply) {
        push({ role: 'bot', source: d.source || 'ai', text: d.reply, link: d.link, linkText: d.linkText });
        if (typeof d.remaining === 'number') { state.ai.remaining = d.remaining; status.textContent = `24시간 자동응답 · AI 상담 오늘 ${d.remaining}회 남음`; dot.classList.toggle('on', d.remaining > 0); }
      } else {
        push({ role: 'bot', source: 'sys', text: d.reply || '지금은 AI 상담 연결이 어려워요. 톡톡으로 문의해 주세요.', link: GR.TALK_URL, linkText: '톡톡으로 문의' });
        if (d.error === 'daily_limit') { state.ai.remaining = 0; dot.classList.remove('on'); status.textContent = '오늘 AI 상담 한도 소진 · 자동응답만 가능'; }
      }
    } catch {
      setBusy(false);
      push({ role: 'bot', source: 'sys', text: '응답이 늦어지고 있어요. 잠시 후 다시 시도하시거나 톡톡으로 문의해 주세요.', link: GR.TALK_URL, linkText: '톡톡으로 문의' });
    }
  }

  function open() {
    state.open = true; panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); root.classList.add('open');
    renderQuick(); intro(); render(); health(); setTimeout(() => input.focus(), 120);
  }
  function close() { state.open = false; panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); root.classList.remove('open'); }
  fab.addEventListener('click', () => state.open ? close() : open());
  $('#gr-chat-close').addEventListener('click', close);
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.open) close(); });
  // 페이지 내 "자동상담" 링크에서 열기
  document.addEventListener('click', e => { const a = e.target.closest('[data-open-chat]'); if (a) { e.preventDefault(); open(); } });
  if (location.hash === '#chat') setTimeout(open, 300);

  health();
  window.GR.chat = { open, close, ask };
})();
