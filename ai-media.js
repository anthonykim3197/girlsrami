/* Shared, explicitly labelled AI styling media; no physical fit simulation. */
(function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const presentation = p => p.aiPresentation?.colors ? p.aiPresentation : null;
  const colorFor = p => {
    const ai = presentation(p);
    return ai && ai.colors[ai.defaultColor] ? ai.defaultColor : p.colors[0];
  };
  const mediaFor = (p, color) => presentation(p)?.colors[color] || null;
  const editorialFor = p => presentation(p)?.editorial || null;
  const turntableFor = (p, color = colorFor(p)) => {
    const turn = editorialFor(p) ? editorialFor(p).turntables?.[color] : presentation(p)?.turntable;
    return turn && Array.isArray(turn.frames) && turn.frames.length === 8 && turn.frames.every(x => typeof x === 'string' && x.trim()) && Array.isArray(turn.angles) && turn.angles.every((x, i) => x === i * 45) && turn.angles.length === 8 ? {...turn,color:turn.color || color} : null;
  };
  const swatches = (p, color) => `<div class="ai-swatches" aria-label="선택 가능한 색상">${p.colors.map(c => `<span title="${esc(c)}" aria-label="${esc(c)}${c === color ? ' 선택됨' : ''}" class="ai-swatch${c === color ? ' selected' : ''}" style="background:${esc(p.colorHex?.[c] || GR.COLORS[c] || GR.COLORS[{'스카이':'스카이블루','회색':'그레이'}[c]] || '#ccc')}"></span>`).join('')}</div>`;
  const marker = '<span class="ai-marker">AI 코디</span>';
  function modelCaption(p) {
    const m = presentation(p)?.model;
    if (!m) return '';
    const values = [['height','키','cm'],['weight','몸무게','kg'],['chest','가슴','cm'],['waist','허리','cm'],['hip','힙','cm']].filter(([k]) => Number.isFinite(m[k])).map(([k,l,u]) => `${l} ${m[k]}${u}`).join(' · ');
    return `<figcaption class="ai-model-caption"><b>가상 모델 설정</b><span>${esc(values)}</span><small>AI로 만든 가상 인물의 설정값입니다. 실제 신체 측정값이나 상품 실측·착용 보장이 아닙니다.</small></figcaption>`;
  }
  function care(p) {
    const icons = [
      ['wash','세탁','M3 7l2 13h14l2-13M6 5v5m6-5v5m6-5v5M4 12q4-3 8 0t8 0'],
      ['bleach','표백','M12 3L2 21h20L12 3Z'],
      ['dry','건조','M3 3h18v18H3ZM7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0'],
      ['iron','다림질','M5 5h10l5 14H3l3-8h12']
    ];
    return `<section class="ai-care" aria-label="세탁 및 관리"><h3>세탁 · 관리</h3><div>${icons.map(([key,label,path])=>`<dl><dt><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="${path}"/></svg>${label}</dt><dd>${esc(p.careDetails?.[key] || '')}</dd></dl>`).join('')}</div></section>`;
  }
  function gallery(p, color) {
    const media = mediaFor(p, color);
    if (!media) return '';
    if (media.kind === 'photo') return `<div class="ai-product-media"><div class="ai-representative"><span class="ai-marker">실물 사진</span><img src="${esc(media.image)}" alt="${esc(p.name)} ${esc(color)} 실제 상품 사진" id="pd-img" fetchpriority="high">${swatches(p,color)}</div><p class="media-source-note">${esc(color)} · 직접 촬영한 상품 사진</p></div>`;
    if (editorialFor(p)) return `<div class="ai-product-media editorial-hero"><div class="ai-representative">${marker}<img src="${esc(editorialFor(p).heroByColor?.[color] || media.image)}" alt="${esc(p.name)} ${esc(color)} AI 코디" id="pd-img" fetchpriority="high" width="1024" height="1024">${swatches(p,color)}</div><div class="ai-gallery-nav"><a href="#editorial-studio">나의 코디 찾아보기 ↗</a></div></div>`;
    return `<div class="ai-product-media"><div class="ai-representative">${presentation(p).cropHasAiLabel ? '' : marker}<img src="${esc(media.image)}" alt="${esc(p.name)} ${esc(color)} AI 코디 대표 이미지" id="pd-img" fetchpriority="high">${swatches(p,color)}</div><div class="ai-gallery-nav"><a href="#ai-full-body">전신 코디 보기 ↓</a>${turntableFor(p) ? '<a href="#ai-fitting-room">8방향 피팅룸 둘러보기 ↗</a>' : ''}</div><figure id="ai-full-body"><img src="${esc(media.fullBody || media.image)}" alt="${esc(p.name)} ${esc(color)} AI 전신 코디" loading="lazy" class="ai-full-body">${modelCaption(p)}</figure></div>`;
  }
  function room(p, color = colorFor(p)) {
    const turn = turntableFor(p, color);
    if (!turn) return '';
    return `<section class="ai-room" id="ai-fitting-room" aria-labelledby="ai-room-title"><div class="ai-room-heading"><div><div class="eyebrow">VIRTUAL STYLING ROOM</div><h2 id="ai-room-title">AI 8방향 코디</h2></div><span>대표 색상 · ${esc(turn.color)}</span></div><div class="ai-room-layout"><div class="ai-room-stage" tabindex="0" role="group" aria-label="AI 코디 방향 보기. 좌우 방향키로 회전" aria-describedby="ai-room-help"><div class="ai-room-floor"></div><img class="ai-room-frame visible" src="${esc(turn.frames[0])}" alt="${esc(p.name)} ${esc(turn.color)} AI 코디 0도" draggable="false"><img class="ai-room-frame" alt="" aria-hidden="true" draggable="false"><span class="ai-room-angle">0° / 360°</span></div><div class="ai-room-controls"><p id="ai-room-help">좌우로 드래그하거나 방향키를 눌러<br>앞 · 옆 · 뒤 코디를 둘러보세요.</p><p class="ai-room-color">${esc(turn.color)} 전용 8방향 이미지입니다.<br>상품 옵션의 색상 선택과 별도로 보여드려요.</p><div class="ai-direction-buttons">${turn.angles.map((a,i)=>`<button type="button" data-angle="${i}" aria-label="${a}도 보기" aria-pressed="${i===0}">${a}°</button>`).join('')}</div><div class="ai-room-actions"><button type="button" data-prev aria-label="이전 방향">←</button><button type="button" data-play aria-pressed="false">천천히 둘러보기</button><button type="button" data-next aria-label="다음 방향">→</button></div><label class="ai-zoom">확대 <input type="range" min="1" max="1.5" step="0.1" value="1" aria-label="코디 이미지 확대"></label><p class="ai-room-status" role="status" aria-live="polite"></p><p class="ai-room-disclosure">AI가 생성한 8장의 방향별 코디 이미지입니다. 실제 3D 의상이나 체형별 핏 시뮬레이션이 아니며, 뒷면·옆면 구조는 실제 상품과 다를 수 있습니다.</p></div></div></section>`;
  }
  function bindRoom(p) {
    let turn = turntableFor(p);
    const root = document.querySelector('#ai-fitting-room');
    if (!turn || !root) return;
    const stage = root.querySelector('.ai-room-stage'), images = [...root.querySelectorAll('.ai-room-frame')], status = root.querySelector('.ai-room-status'), play = root.querySelector('[data-play]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, visible = 0, timer = null, request = 0, pointer = null;
    function stop() { clearInterval(timer); timer = null; play.textContent = '천천히 둘러보기'; play.setAttribute('aria-pressed','false'); }
    function show(next) {
      index = (next + 8) % 8;
      const targetIndex = index, token = ++request, nextImage = images[1-visible];
      status.textContent = `${turn.angles[index]}° 이미지 불러오는 중`;
      nextImage.onload = () => {
        if (token !== request) return;
        images[visible].classList.remove('visible'); images[visible].setAttribute('aria-hidden','true');
        nextImage.alt = `${p.name} ${turn.color} AI 코디 ${turn.angles[targetIndex]}도`;
        nextImage.removeAttribute('aria-hidden'); nextImage.classList.add('visible'); visible = 1-visible;
        root.querySelector('.ai-room-angle').textContent = `${turn.angles[targetIndex]}° / 360°`;
        status.textContent = '';
        root.querySelectorAll('[data-angle]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.angle)===targetIndex)));
      };
      nextImage.onerror = () => { if(token===request) { stop(); status.textContent = '이미지를 불러오지 못했어요. 방향을 다시 선택해 주세요.'; } };
      nextImage.src = turn.frames[index];
    }
    root.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>{stop();show(Number(b.dataset.angle));}));
    root.querySelector('[data-prev]').addEventListener('click',()=>{stop();show(index-1);});
    root.querySelector('[data-next]').addEventListener('click',()=>{stop();show(index+1);});
    play.addEventListener('click',()=>{if(timer) return stop();if(reduced.matches) { status.textContent='동작 줄이기 설정이 켜져 있어요. 방향 버튼으로 둘러보세요.';return;}play.textContent='일시 정지';play.setAttribute('aria-pressed','true');timer=setInterval(()=>show(index+1),1800);});
    stage.addEventListener('keydown',e=>{const next={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:7}[e.key];if(next!==undefined){e.preventDefault();stop();show(next);}});
    stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;stop();pointer={id:e.pointerId,x:e.clientX};stage.setPointerCapture(e.pointerId);});
    stage.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const delta=e.clientX-pointer.x;if(Math.abs(delta)>=32){show(index+(delta>0?1:-1));pointer.x=e.clientX;}});
    const release=()=>{pointer=null;}; stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
    root.querySelector('input').addEventListener('input',e=>stage.style.setProperty('--ai-zoom',e.target.value));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
    if('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(stage);
    images[0].addEventListener('error',()=>{status.textContent='이미지를 불러오지 못했어요. 방향을 선택해 다시 시도해 주세요.';});
    return {setColor(color) { const next = turntableFor(p,color); if (!next) return; stop(); turn = {...next,color}; show(index); root.querySelector('.ai-room-heading>span').textContent = `선택 색상 · ${color}`; root.querySelector('.ai-room-color').textContent = `${color} · 기본 코디의 앞·옆·뒤를 둘러보세요.`; },stop};
  }
  function colorControls(p, color) {
    return `<div class="editorial-colors" aria-label="코디 색상">${p.colors.map(c=>`<button type="button" data-editorial-color="${esc(c)}" aria-pressed="${c===color}"><span style="background:${esc(p.colorHex?.[c] || GR.COLORS[c] || GR.COLORS[{'스카이':'스카이블루','회색':'그레이'}[c]] || '#ccc')}"></span>${esc(c)}</button>`).join('')}</div>`;
  }
  function editorial(p,color) {
    const e=editorialFor(p); if(!e?.looks?.length) return '';
    const look=e.looks[0];
    return `<div class="editorial-product"><section class="editorial-studio" id="editorial-studio" aria-labelledby="styling-title"><header class="editorial-heading"><span class="editorial-index">01 / THE STYLING EDIT</span><h2 id="styling-title">한 벌, 다른 하루.</h2><p>오늘의 약속에 맞춰 코디를 골라보세요.</p></header><div class="editorial-mode" role="tablist" aria-label="코디 보기 방식"><button type="button" role="tab" id="look-tab" aria-controls="editorial-look" aria-selected="true" data-studio-mode="look">스타일링</button>${turntableFor(p,color)?'<button type="button" role="tab" id="room-tab" aria-controls="editorial-room" aria-selected="false" tabindex="-1" data-studio-mode="room">8방향 둘러보기</button>':''}</div><div id="editorial-look" role="tabpanel" aria-labelledby="look-tab" class="editorial-look"><figure class="editorial-outfit"><img id="editorial-look-image" src="${esc(look.images[color])}" alt="${esc(p.name)} ${esc(color)} · ${esc(look.label)} AI 코디" loading="lazy" width="1024" height="1536"><figcaption>AI STYLING / <span data-current-color>${esc(color)}</span></figcaption></figure><div class="editorial-look-controls"><div class="editorial-look-list" aria-label="코디 선택">${e.looks.map((l,i)=>`<button type="button" data-look="${esc(l.id)}" aria-pressed="${i===0}"><small>LOOK ${String(i+1).padStart(2,'0')}</small><span>${esc(l.label)}</span><em>${esc(l.occasion || '')}</em></button>`).join('')}</div><div class="editorial-look-copy"><h3 data-look-title>${esc(look.label)}</h3><p data-look-note>${esc(look.note)}</p><ul data-look-items>${(look.items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>${colorControls(p,color)}<p class="editorial-image-status" role="status" aria-live="polite"></p><details class="editorial-model"><summary>가상 모델 · 코디 안내</summary>${modelCaption(p)}<p>상의 외 코디 아이템은 연출용입니다.</p></details></div></div><div id="editorial-room" role="tabpanel" aria-labelledby="room-tab" hidden>${room(p,color)}</div></section><section class="editorial-color-story" aria-labelledby="color-story-title"><header class="editorial-heading"><span class="editorial-index">02 / COLOR PALETTE</span><h2 id="color-story-title">취향이 머무는 색.</h2><p>${p.colors.map(esc).join(' · ')}</p></header><figure><img src="${esc(e.colorStory)}" alt="${esc(p.name)} ${p.colors.map(esc).join(', ')} 컬러 구성 AI 연출컷" width="1536" height="1024" loading="lazy"><figcaption>컬러 구성 연출 이미지 · 실제 색상은 실물 디테일을 함께 참고해 주세요.</figcaption></figure></section></div>`;
  }
  function proof(p) {
    const e=editorialFor(p); if(!e)return '';
    const measures=e.measurements || Object.entries(p.measure||{}).map(([label,value])=>({label,value}));
    return `<div class="editorial-proof"><header class="editorial-heading"><span class="editorial-index">03 / CLOSE & PERSONAL</span><h2>가까이 보면, 더 분명한 것.</h2><p>직접 촬영한 소재와 마감, 그리고 상품 정보.</p></header><div class="editorial-proof-grid">${(e.details||[]).map(d=>`<figure><img src="${esc(d.image)}" alt="${esc(d.caption)}" loading="lazy" width="800" height="800"><figcaption>${esc(d.caption)}</figcaption></figure>`).join('')}${(e.details||[]).length===1?`<aside><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><small>직접 촬영한 실물 부분 확대</small></aside>`:''}</div><details class="editorial-facts" open><summary>실측 사이즈${e.measurementUnit?' · '+esc(e.measurementUnit):''}</summary><dl>${measures.map(m=>`<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl>${e.measurementNote?`<p>${esc(e.measurementNote)}</p>`:''}</details>${care(p)}</div>`;
  }
  function bindEditorial(p,onColor) {
    const e=editorialFor(p), root=document.querySelector('.editorial-product'); if(!e||!root)return;
    let color=colorFor(p),look=e.looks[0],request=0;
    root.querySelector('#editorial-room').insertAdjacentHTML('afterbegin',colorControls(p,color));
    const roomControl=bindRoom(p),img=root.querySelector('#editorial-look-image'),status=root.querySelector('.editorial-image-status');
    function update() {
      const token=++request;
      status.textContent='코디를 불러오는 중';img.setAttribute('aria-busy','true');
      img.onload=()=>{if(token!==request)return;img.removeAttribute('aria-busy');status.textContent=`${color} · ${look.label}`;};
      img.onerror=()=>{if(token!==request)return;img.removeAttribute('aria-busy');status.textContent='이미지를 불러오지 못했어요. 코디나 색상을 다시 선택해 주세요.';};
      img.src=look.images[color];img.alt=`${p.name} ${color} · ${look.label} AI 코디`;
      root.querySelector('[data-current-color]').textContent=color;
      root.querySelector('[data-look-title]').textContent=look.label;
      root.querySelector('[data-look-note]').textContent=look.note||'';
      root.querySelector('[data-look-items]').innerHTML=(look.items||[]).map(item=>`<li>${esc(item)}</li>`).join('');
      root.querySelectorAll('[data-look]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.look===look.id)));
      root.querySelectorAll('[data-editorial-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.editorialColor===color)));
    }
    root.querySelectorAll('[data-look]').forEach(b=>b.addEventListener('click',()=>{look=e.looks.find(l=>l.id===b.dataset.look);update();}));
    root.querySelectorAll('[data-editorial-color]').forEach(b=>b.addEventListener('click',()=>onColor(b.dataset.editorialColor)));
    const tabs=[...root.querySelectorAll('[data-studio-mode]')];
    function selectTab(b){tabs.forEach(x=>{x.setAttribute('aria-selected',String(x===b));x.tabIndex=x===b?0:-1;});root.querySelector('#editorial-look').hidden=b.dataset.studioMode!=='look';root.querySelector('#editorial-room').hidden=b.dataset.studioMode!=='room';roomControl?.stop();}
    tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectTab(b));b.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}});});
    roomControl?.setColor(color);
    const model=root.querySelector('.editorial-model .ai-model-caption');
    if(model){const content=document.createElement('div');content.className=model.className;content.innerHTML=model.innerHTML;model.replaceWith(content);}
    if(location.hash==='#ai-fitting-room'&&tabs[1]){selectTab(tabs[1]);requestAnimationFrame(()=>root.querySelector('#ai-fitting-room').scrollIntoView({block:'start',behavior:'instant'}));}
    return {setColor(next){if(!p.colors.includes(next))return;color=next;update();roomControl?.setColor(color);}};
  }
  window.GR_AI = {presentation,colorFor,mediaFor,turntableFor,swatches,marker,gallery,care,room,bindRoom,editorialFor,editorial,proof,bindEditorial};
})();
