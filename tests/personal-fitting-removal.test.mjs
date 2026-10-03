import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const appSource=readFileSync(new URL('app.js',root),'utf8');
const memberSource=readFileSync(new URL('member.js',root),'utf8');

function element(){
  return {innerHTML:'',textContent:'',disabled:false,dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},insertAdjacentHTML(){},append(){},querySelector(){return null;},querySelectorAll(){return [];}};
}

function compileMemberFunction(name,next,context){
  const start=memberSource.indexOf(`async function ${name}(`);
  const end=next ? memberSource.indexOf(next,start) : memberSource.length;
  assert.ok(start>=0&&end>start,`${name} function boundary`);
  const sandbox={...context};
  vm.runInNewContext(`${memberSource.slice(start,end)};this.subject=${name}`,sandbox);
  return sandbox.subject;
}

test('consumer chrome and product purchase area omit personal fitting while keeping cart',async()=>{
  const header=element(),footer=element(),menu=element(),mobile=element(),pd=element(),desc=element(),reviews=element(),notice=element(),related=element(),colorOpts=element(),sizeOpts=element(),share=element();
  const map={'#site-header':header,'#site-footer':footer,'#menu-btn':menu,'#mobile-nav':mobile,'#pd':pd,'#pd-desc':desc,'#pd-reviews':reviews,'#pd-notice':notice,'#related-grid':related,'#color-opts':colorOpts,'#size-opts':sizeOpts,'#share-btn':share};
  let ready;
  const document={body:{dataset:{page:'product'}},querySelector:s=>map[s]??null,querySelectorAll:()=>[],addEventListener:(type,handler)=>{if(type==='DOMContentLoaded')ready=handler;},title:''};
  const product={id:'knit',name:'니트',sub:'',sku:'K1',category:'니트',line:'basic',stock:2,status:'active',colors:['블랙'],sizes:['FREE'],catalogSizes:[{label:'FREE',chestHalf:50,length:60,verified:true}],badges:[],price:19000,listPrice:0,rating:0,reviewCount:0,reviews:[],image:'knit',catalogImage:'knit.jpg',smartstore:'https://example.com/product',storeUrl:'https://example.com/product',fit:'기본핏',length:'기본',material:'면',thickness:'보통',stretch:'보통',sheer:'없음',care:'손세탁',desc:'상품 설명'};
  const GR={bootPromise:Promise.resolve(),bootError:null,PRODUCTS:[product],CONTENT:null,byId:id=>id===product.id?product:null,COLORS:{블랙:'#000'},TALK_URL:'https://example.com/talk',STORE_URL:'https://example.com/store',fmt:n=>String(n),discount:()=>0};
  const window={GR};
  vm.runInNewContext(appSource,{window,GR,document,location:{search:'?id=knit',href:'https://example.com/product.html?id=knit'},navigator:{clipboard:{writeText:async()=>{}}},URLSearchParams,encodeURIComponent,Intl,setTimeout,clearTimeout});
  await ready();
  assert.doesNotMatch(header.innerHTML,/fitting\.html|나의 피팅룸|내 사이즈/);
  assert.match(header.innerHTML,/장바구니/);
  assert.match(header.innerHTML,/>로그인</);
  assert.match(pd.innerHTML,/id="add-cart"/);
  assert.doesNotMatch(pd.innerHTML,/fitting\.html|fit-shortcut|product-lookbook/);
});

test('signed-in account exposes no body inputs or fitting entry and keeps explicit data deletion controls',async()=>{
  const account=element(),rootNode=element(),controls=new Map([['#account-content',account],['#logout',element()],['#remove-profile',element()],['#remove-photos',element()]]);
  const f=(selector,scope)=>scope===rootNode&&selector==='#account-content'?account:controls.get(selector)??element();
  const subject=compileMemberFunction('Ys','function Xs',{f,S:{auth:{}},B:{id:'member-1',email:'member@example.com'},w:String,Q:String,N(){},Z(){},$(){},D(){return '<input>'},tr(){return '<input type="number">'},te(){return ''},le(){return {}},Js(){},Ws(){},zs(){},tt:async()=>({height:165,chest:90,fit:'regular'}),GR:{TALK_URL:'https://example.com/talk'},location:{reload(){},href:'https://example.com/account.html'},URL,FormData:class {}});
  await subject(rootNode);
  assert.doesNotMatch(account.innerHTML,/type="number"|id="profile"|fitting\.html|피팅룸/);
  assert.match(account.innerHTML,/cart\.html/);
  assert.match(account.innerHTML,/id="remove-profile"/);
  assert.match(account.innerHTML,/id="remove-photos"/);
  assert.equal(typeof controls.get('#logout').onclick,'function');
});

test('product enhancer creates no fitting panels and still binds the cart action',async()=>{
  const cart=element(),status=element(),created=[];let added;
  const product={id:'knit',colors:['블랙'],sizes:[{label:'FREE'}]};
  const f=selector=>({'#add-cart':cart,'#product-cart-status':status,'#color-opts .active':{dataset:{c:'블랙'}},'#size-opts .active':{dataset:{s:'FREE'}},'.pd-info':{append(){}}}[selector]??null);
  const document={createElement:tag=>{created.push(tag);return element();},querySelector:()=>({append(){}})};
  const subject=compileMemberFunction('Zi',null,{st:[product],location:{search:'?id=knit'},URLSearchParams,f,document,w:String,Q:String,et(){return {message:''}},tt:async()=>null,Me:async()=>({}),rt:async()=>{},er:async(...args)=>{added=args;}});
  await subject();
  assert.deepEqual(created,[]);
  assert.equal(typeof cart.onclick,'function');
  await cart.onclick();
  assert.deepEqual(added,[product,'블랙','FREE']);
  assert.match(status.textContent,/장바구니/);
});

test('built public pages route fitting visits to products and omit personal fitting promotions',()=>{
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root});
  const html=name=>readFileSync(new URL(`dist/${name}.html`,root),'utf8');
  assert.match(html('fitting'),/http-equiv="refresh"[^>]+shop\.html/i);
  assert.doesNotMatch(html('fitting'),/member\.js/);
  assert.doesNotMatch(html('index'),/href="fitting\.html"|MY SIZE|PHOTO FITTING|내 치수|본인 사진/);
  assert.doesNotMatch(html('guide'),/href="fitting\.html"|신체 치수 저장|내 사이즈/);
});
