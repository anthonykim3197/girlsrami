import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../ai-media.js',import.meta.url),'utf8');
const product={name:'니트',colors:['스카이','블랙'],aiPresentation:{defaultColor:'스카이',colors:{'스카이':{image:'sky-crop.png',fullBody:'sky-full.png'},'블랙':{image:'black-crop.png',fullBody:'black-full.png'}},model:{height:165,weight:50,chest:82,waist:64,hip:90},turntable:{color:'스카이',frames:Array.from({length:8},(_,i)=>`${i}.png`),angles:[0,45,90,135,180,225,270,315]}}};
function node(dataset={}){return {dataset,textContent:'',attrs:{},listeners:{},style:{setProperty(k,v){this[k]=v;}},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(k,v){this.listeners[k]=v;},setPointerCapture(){},fire(k,e={}){this.listeners[k]?.(e);}};}
function setup(){
 const stage=node(), images=[node(),node()], status=node(),play=node(),prev=node(),next=node(),input=node(),angles=Array.from({length:8},(_,i)=>node({angle:String(i)})),angle=node(),reduced={matches:false,addEventListener(){}};
 const map={'.ai-room-stage':stage,'.ai-room-status':status,'[data-play]':play,'[data-prev]':prev,'[data-next]':next,'input':input,'.ai-room-angle':angle,'.ai-room-heading>span':node(),'.ai-room-color':node()};
 const root={querySelector:s=>map[s],querySelectorAll:s=>({'.ai-room-frame':images,'[data-angle]':angles}[s])};
 const document={querySelector:()=>root,addEventListener(){}};let interval=null;
 const context={window:{},GR:{COLORS:{}},document,matchMedia:()=>reduced,setInterval:f=>(interval=f,1),clearInterval:()=>{interval=null;}};
 vm.runInNewContext(source,context);
 return {api:context.window.GR_AI,stage,images,status,play,prev,next,input,angles,angle,reduced,tick:()=>interval?.()};
}
test('AI gallery swaps only matching color and keeps full-body second; no metadata leaves legacy alone',()=>{
 const {api}=setup(); assert.equal(api.presentation({}),null);assert.equal(api.colorFor(product),'스카이');
 const sky=api.gallery(product,'스카이'),black=api.gallery(product,'블랙');
 const baked=structuredClone(product);baked.aiPresentation.cropHasAiLabel=true;assert.doesNotMatch(api.gallery(baked,'스카이'),/class="ai-marker"/);assert.match(sky,/class="ai-marker"/);
 assert.ok(sky.indexOf('sky-crop.png')<sky.indexOf('sky-full.png'));assert.match(black,/black-crop.png/);assert.doesNotMatch(black,/sky-crop/);assert.match(black,/가상 모델 설정/);assert.match(black,/키 165cm/);assert.match(black,/몸무게 50kg/);assert.match(black,/AI 코디/);
});
test('Only complete eight-direction metadata enables room; room names fixed color',()=>{
 const {api}=setup();assert.match(api.room(product),/스카이 전용 8방향/);assert.match(api.room(product),/실제 3D 의상이나 체형별 핏 시뮬레이션이 아니며/);
 const invalid=structuredClone(product);invalid.aiPresentation.turntable.frames.pop();assert.equal(api.room(invalid),'');
 const room=api.room(product);assert.doesNotMatch(room,/data-light|내추럴 룸|웜 룸/);assert.match(room,/<p class="ai-room-status" role="status" aria-live="polite"><\/p>/);
 assert.match(api.care(product),/<dd><\/dd>/);assert.equal((api.care(product).match(/<svg/g)||[]).length,4);
});
test('Direction buttons, arrow wrapping, zoom, autoplay and accessible load feedback',()=>{
 const h=setup();h.api.bindRoom(product);
 h.next.fire('click');assert.equal(h.images[1].src,'1.png');h.images[1].onload();assert.equal(h.angle.textContent,'45° / 360°');assert.equal(h.angles[1].attrs['aria-pressed'],'true');
 h.stage.fire('keydown',{key:'End',preventDefault(){}});h.images[0].onload();assert.equal(h.images[0].src,'7.png');
 h.next.fire('click');h.images[1].onload();assert.equal(h.images[1].src,'0.png');
 h.input.fire('input',{target:{value:'1.5'}});assert.equal(h.stage.style['--ai-zoom'],'1.5');
 h.play.fire('click');assert.equal(h.play.attrs['aria-pressed'],'true');h.tick();assert.equal(h.images[0].src,'1.png');assert.match(h.status.textContent,/불러오는 중/);h.images[0].onerror();assert.match(h.status.textContent,/불러오지 못/);assert.equal(h.play.attrs['aria-pressed'],'false');
 h.next.fire('click');h.images[0].onload();assert.equal(h.status.textContent,'');assert.equal(h.angle.textContent,'90° / 360°');
 h.reduced.matches=true;h.play.fire('click');assert.match(h.status.textContent,/동작 줄이기/);assert.equal(h.play.attrs['aria-pressed'],'false');
});
test('Horizontal drag follows next/previous direction, wraps both ends and ignores sub-threshold movement',()=>{
 const h=setup();h.api.bindRoom(product);
 const drag=(to,image,frame)=>{h.stage.fire('pointerdown',{button:0,pointerId:1,clientX:100});h.stage.fire('pointermove',{pointerId:1,clientX:to});assert.equal(h.images[image].src,frame+'.png');h.images[image].onload();h.stage.fire('pointerup');assert.equal(h.status.textContent,'');};
 h.stage.fire('pointerdown',{button:0,pointerId:1,clientX:100});h.stage.fire('pointermove',{pointerId:1,clientX:120});assert.equal(h.images[1].src,undefined);h.stage.fire('pointerup');
 drag(140,1,1);assert.equal(h.angle.textContent,'45° / 360°');
 drag(60,0,0);assert.equal(h.angle.textContent,'0° / 360°');
 drag(60,1,7);assert.equal(h.angle.textContent,'315° / 360°');
 drag(140,0,0);assert.equal(h.angle.textContent,'0° / 360°');
});
test('Cards use AI for active cardigan while preserving pending prices and legacy imagery',()=>{
 const {api}=setup();const GR={COLORS:{},fmt:n=>String(n),discount:()=>10};
 const document={body:{dataset:{}},addEventListener(){}};const context={window:{GR,GR_AI:api},GR,GR_AI:api,document};
 vm.runInNewContext(readFileSync(new URL('../app.js',import.meta.url),'utf8'),context);
 const p={...product,id:'cardigan',stock:4,status:'active',badges:[],category:'니트',line:'basic',sub:'',price:12900,listPrice:0,rating:0,reviewCount:0,image:'old',newRelease:false};
 assert.match(GR.card(p),/sky-crop.png/);assert.match(GR.card(p),/12900/);
 const pending={...p,stock:0,status:'coming',pricePending:true,newRelease:true};assert.doesNotMatch(GR.card(pending),/12900/);assert.match(GR.card(pending),/판매 예정/);
 const legacy={...p};delete legacy.aiPresentation;assert.match(GR.card(legacy),/old.jpg/);assert.doesNotMatch(GR.card(legacy),/ai-marker/);
});
test('Build includes shared AI script before app with content hashes',()=>{
 for(const page of ['index','shop','product']){
  const html=readFileSync(new URL(`../dist/${page}.html`,import.meta.url),'utf8');assert.match(html,/ai-media.js\?v=[a-f0-9]{12}/);assert.ok(html.indexOf('ai-media.js')<html.indexOf('app.js'));
 }
});

test('Editorial products use natural hero and only one outfit stage; color-specific rotation never falls back',()=>{
 const {api}=setup(),p=structuredClone(product);
 p.aiPresentation.editorial={heroByColor:{'스카이':'natural-sky.png','블랙':'natural-black.png'},colorStory:'styled-colors.png',looks:[{id:'weekend',label:'주말 산책',occasion:'Coffee walk',note:'가벼운 데님과 스니커즈',items:['라이트 데님','스니커즈'],images:{'스카이':'walk-sky.png','블랙':'walk-black.png'}},{id:'dinner',label:'저녁 약속',images:{'스카이':'dinner-sky.png','블랙':'dinner-black.png'}}],turntables:{'스카이':{frames:Array.from({length:8},(_,i)=>`sky-${i}.png`),angles:[0,45,90,135,180,225,270,315]},'블랙':{frames:Array.from({length:8},(_,i)=>`black-${i}.png`),angles:[0,45,90,135,180,225,270,315]}},details:[{image:'real-macro.png',caption:'실물 짜임'}],measurements:[{label:'총기장',value:50}],measurementUnit:''};
 assert.match(api.gallery(p,'블랙'),/natural-black.png/);assert.doesNotMatch(api.gallery(p,'블랙'),/ai-full-body/);
 assert.equal(api.turntableFor(p,'블랙').frames[7],'black-7.png');assert.equal(api.turntableFor(p,'missing'),null);
 const html=api.editorial(p,'스카이');assert.equal((html.match(/id="editorial-look-image"/g)||[]).length,1);assert.match(html,/styled-colors.png/);assert.doesNotMatch(html,/dinner-sky.png/);assert.match(html,/data-look="dinner"/);
 const proof=api.proof(p);assert.match(proof,/real-macro.png/);assert.match(proof,/<dd>50<\/dd>/);assert.doesNotMatch(proof,/cm/);
});

test('Global color update preserves room angle and pauses autoplay before loading matching frames',()=>{
 const h=setup(),p=structuredClone(product);
 p.aiPresentation.editorial={turntables:Object.fromEntries(p.colors.map(color=>[color,{frames:Array.from({length:8},(_,i)=>`${color}-${i}.png`),angles:[0,45,90,135,180,225,270,315]}]))};
 const controller=h.api.bindRoom(p);h.angles[3].fire('click');h.images[1].onload();h.play.fire('click');
 controller.setColor('블랙');assert.equal(h.play.attrs['aria-pressed'],'false');assert.equal(h.images[0].src,'블랙-3.png');h.images[0].onload();assert.equal(h.status.textContent,'');assert.equal(h.angle.textContent,'135° / 360°');assert.equal(h.angles[3].attrs['aria-pressed'],'true');
});
