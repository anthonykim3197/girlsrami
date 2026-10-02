import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../ai-media.js',import.meta.url),'utf8');
const product={name:'니트',colors:['스카이','블랙'],aiPresentation:{defaultColor:'스카이',colors:{'스카이':{image:'sky-crop.png',fullBody:'sky-full.png'},'블랙':{image:'black-crop.png',fullBody:'black-full.png'}},model:{height:165,weight:50,chest:82,waist:64,hip:90},turntable:{color:'스카이',frames:Array.from({length:8},(_,i)=>`${i}.png`),angles:[0,45,90,135,180,225,270,315]}}};
function node(dataset={}){return {dataset,attrs:{},listeners:{},style:{setProperty(k,v){this[k]=v;}},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(k,v){this.listeners[k]=v;},setPointerCapture(){},fire(k,e={}){this.listeners[k]?.(e);}};}
function setup(){
 const stage=node(), images=[node(),node()], status=node(),play=node(),prev=node(),next=node(),input=node(),angles=Array.from({length:8},(_,i)=>node({angle:String(i)})),lights=['day','warm'].map(light=>node({light})),angle=node(),reduced={matches:false,addEventListener(){}};
 const map={'.ai-room-stage':stage,'.ai-room-status':status,'[data-play]':play,'[data-prev]':prev,'[data-next]':next,'input':input,'.ai-room-angle':angle};
 const root={querySelector:s=>map[s],querySelectorAll:s=>({'.ai-room-frame':images,'[data-angle]':angles,'[data-light]':lights}[s])};
 const document={querySelector:()=>root,addEventListener(){}};let interval=null;
 const context={window:{},GR:{COLORS:{}},document,matchMedia:()=>reduced,setInterval:f=>(interval=f,1),clearInterval:()=>{interval=null;}};
 vm.runInNewContext(source,context);
 return {api:context.window.GR_AI,stage,images,status,play,prev,next,input,angles,lights,angle,reduced,tick:()=>interval?.()};
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
 assert.match(api.care(product),/<dd><\/dd>/);assert.equal((api.care(product).match(/<svg/g)||[]).length,4);
});
test('Direction buttons, arrow wrapping, drag, zoom, room lighting, autoplay and load error',()=>{
 const h=setup();h.api.bindRoom(product);
 h.next.fire('click');assert.equal(h.images[1].src,'1.png');h.images[1].onload();assert.equal(h.angle.textContent,'45° / 360°');assert.equal(h.angles[1].attrs['aria-pressed'],'true');
 h.stage.fire('keydown',{key:'End',preventDefault(){}});h.images[0].onload();assert.equal(h.images[0].src,'7.png');
 h.next.fire('click');h.images[1].onload();assert.equal(h.images[1].src,'0.png');
 h.stage.fire('pointerdown',{button:0,pointerId:1,clientX:100});h.stage.fire('pointermove',{pointerId:1,clientX:60});assert.equal(h.images[0].src,'1.png');h.images[0].onload();h.stage.fire('pointerup');
 h.input.fire('input',{target:{value:'1.5'}});assert.equal(h.stage.style['--ai-zoom'],'1.5');
 h.lights[1].fire('click');assert.equal(h.lights[1].attrs['aria-pressed'],'true');
 h.play.fire('click');assert.equal(h.play.attrs['aria-pressed'],'true');h.tick();assert.equal(h.images[1].src,'2.png');h.images[1].onerror();assert.match(h.status.textContent,/불러오지 못/);assert.equal(h.play.attrs['aria-pressed'],'false');
 h.reduced.matches=true;h.play.fire('click');assert.match(h.status.textContent,/동작 줄이기/);assert.equal(h.play.attrs['aria-pressed'],'false');
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
test('Build includes shared AI script before app with content hashes; compiled member unchanged',()=>{
 assert.equal(readFileSync(new URL('../member.js',import.meta.url),'utf8'),execFileSync('git',['show','HEAD:member.js'],{cwd:new URL('../',import.meta.url),encoding:'utf8'}));
 for(const page of ['index','shop','product']){
  const html=readFileSync(new URL(`../dist/${page}.html`,import.meta.url),'utf8');assert.match(html,/ai-media.js\?v=[a-f0-9]{12}/);assert.ok(html.indexOf('ai-media.js')<html.indexOf('app.js'));
 }
});
