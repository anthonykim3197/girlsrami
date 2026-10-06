import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const appSource=readFileSync(new URL('../app.js',import.meta.url),'utf8');

function loadApp(){
  const GR={COLORS:{},fmt:n=>`${Number(n).toLocaleString('ko-KR')}원`,discount:p=>Math.round((1-p.price/p.listPrice)*100)};
  const document={body:{dataset:{}},addEventListener(){}};
  vm.runInNewContext(appSource,{window:{GR},GR,document});
  return GR;
}

function product(overrides={}){
  return {
    id:'honey-loop-crop-knit',name:'허니루프 라운드 니트 (RM382)',sku:'RM382',styleCode:'',
    stock:10,status:'active',badges:[],category:'니트',line:'basic',sub:'작은 벌집 짜임',
    price:19900,channelPrice:{naver:16800},listPrice:0,pricePending:false,
    colors:['크림'],sizes:['FREE'],rating:0,reviewCount:0,image:'honey',newRelease:true,
    ...overrides
  };
}

test('customer titles omit style codes while genuine RM codes remain available as product information',()=>{
  const GR=loadApp(),withLegacyName=product();
  assert.equal(GR.catalogPresentation.nameFor(withLegacyName),'허니루프 라운드 니트');
  assert.equal(GR.catalogPresentation.styleCodeFor(withLegacyName),'RM382');
  assert.doesNotMatch(GR.card(withLegacyName),/RM382/);

  const marketplaceSku=product({name:'케이블 브이넥 꽈배기 니트',sku:'8087805239'});
  assert.equal(GR.catalogPresentation.styleCodeFor(marketplaceSku),'');

  const canonical=product({name:'오프듀티 V넥 니트 베스트 (RM495)',sku:'1020304050',styleCode:'rm495'});
  assert.equal(GR.catalogPresentation.nameFor(canonical),'오프듀티 V넥 니트 베스트');
  assert.equal(GR.catalogPresentation.styleCodeFor(canonical),'RM495');
});

test('cards show an explicit Naver checkout price without inventing a discount',()=>{
  const GR=loadApp();
  const html=GR.card(product());
  assert.match(html,/자사몰 판매가/);
  assert.match(html,/19,900원/);
  assert.match(html,/네이버 결제가/);
  assert.match(html,/16,800원/);
  assert.doesNotMatch(html,/class="off"/);

  const scalar=product({channelPrice:16800});
  assert.equal(GR.catalogPresentation.channelPriceFor(scalar),16800);

  const same=GR.card(product({channelPrice:{naver:19900}}));
  assert.doesNotMatch(same,/네이버 결제가/);
});

test('comparison discounts render only when list price is genuinely higher than the own-site price',()=>{
  const GR=loadApp();
  assert.doesNotMatch(GR.card(product({listPrice:19000,channelPrice:null})),/class="off"/);
  assert.match(GR.card(product({listPrice:23000,channelPrice:null})),/class="off">13%/);
});

test('source-only SmartStore products receive standard editorial detail without a fabricated 360 view',()=>{
  const GR=loadApp();
  const sourceOnly=product({
    name:'케이블 브이넥 꽈배기 니트',sku:'8087805239',styleCode:'RM210',
    smartstore:'https://smartstore.naver.com/girlsrami/products/8087805239',
    desc:'쇄골이 은은하게 드러나는 브이넥 니트.',
    detailImages:[{url:'source-detail.jpg',alt:'실물 앞면'}]
  });
  assert.equal(GR.catalogPresentation.usesStandardEditorial(sourceOnly),true);
  const details=GR.catalogPresentation.sourceEditorialFor(sourceOnly);
  assert.match(details,/THE PRODUCT EDIT/);
  assert.match(details,/source-detail\.jpg/);
  assert.match(details,/실물 앞면/);
  assert.doesNotMatch(details,/360|8방향|가상 모델|cm/);

  const facts=GR.catalogPresentation.factsFor(sourceOnly);
  assert.match(facts,/<dt>품번<\/dt><dd>RM210<\/dd>/);
  assert.doesNotMatch(facts,/8087805239/);
});
