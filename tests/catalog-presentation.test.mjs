import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const appSource=readFileSync(new URL('../app.js',import.meta.url),'utf8');

function loadApp(detailCatalog={}){
  const GR={COLORS:{},fmt:n=>`${Number(n).toLocaleString('ko-KR')}원`,discount:p=>Math.round((1-p.price/p.listPrice)*100)};
  const document={body:{dataset:{}},addEventListener(){}};
  vm.runInNewContext(appSource,{window:{GR,GR_DETAIL:detailCatalog},GR,document});
  return GR;
}

test('verified design history overrides stale NEW flags while new designs retain the stamp',()=>{
  const GR=loadApp({'honey-loop-crop-knit':{isNewDesign:false},'new-design':{isNewDesign:true}});
  assert.doesNotMatch(GR.card(product({newRelease:true,badges:['NEW']})),/badge-new/);
  assert.match(GR.card(product({id:'new-design',newRelease:false})),/badge-new[^>]*>NEW/);
});

function product(overrides={}){
  return {
    id:'honey-loop-crop-knit',name:'허니루프 라운드 니트 (RM382)',sku:'RM382',styleCode:'',
    stock:10,status:'active',badges:[],category:'니트',line:'basic',sub:'작은 벌집 짜임',
    price:19900,channelPrice:{naver:16800},listPrice:0,pricePending:false,
    storeUrl:'https://smartstore.naver.com/girlsrami/products/8087805239',
    colors:['크림'],sizes:['FREE'],rating:0,reviewCount:0,image:'honey',newRelease:true,
    ...overrides
  };
}

function pageElement(classState){
  return {
    innerHTML:'',textContent:'',hidden:false,dataset:{},
    classList:{
      add(){},remove(){},
      toggle(name,value){if(classState) classState.set(name,Boolean(value));}
    },
    addEventListener(){},insertAdjacentHTML(){},setAttribute(){},remove(){}
  };
}

test('a sample photograph without an option match does not select or imply the first sale color',()=>{
  const GR=loadApp();
  const sample=product({colors:['아이보리','그레이'],photoSampleOnly:true});
  assert.equal(GR.storefront.startingColorFor(sample,null),null);
  assert.equal(GR.storefront.startingColorFor(product({colors:['아이보리','그레이'],photoColor:'그레이'}),null),'그레이');
  assert.equal(GR.storefront.startingColorFor(sample,'그레이'),'그레이');
});

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

test('customer cards show the product name without adding or preserving a brand prefix',()=>{
  const GR=loadApp();
  for(const name of ['허니루프 라운드 니트','  걸스라미 허니루프 라운드 니트 (RM382)  ']){
    const item=product({name});
    assert.equal(GR.catalogPresentation.nameFor(item),'허니루프 라운드 니트');
    const html=GR.card(item);
    assert.match(html,/<div class="name">허니루프 라운드 니트<small>/);
    assert.doesNotMatch(html,/걸스라미 허니루프/);
  }
});

test('cards show an explicit Naver checkout price without inventing a discount',()=>{
  const GR=loadApp();
  const html=GR.card(product());
  assert.match(html,/자사몰 판매가/);
  assert.match(html,/19,900원/);
  assert.match(html,/네이버 결제가/);
  assert.match(html,/16,800원/);
  assert.doesNotMatch(html,/class="off"/);
  assert.equal(GR.storefront.offerPriceFor(product()),16800);
  assert.equal(GR.storefront.availabilityFor(product()),'https://schema.org/InStock');
  assert.equal(GR.storefront.availabilityFor(product({stock:0})),'https://schema.org/OutOfStock');

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

test('supported RM products receive responsive native detail with deliberate image loading',()=>{
  const GR=loadApp();
  const honey=GR.catalogPresentation.qualityEditorialHtml(product());
  assert.match(honey,/허니루프 라운드 니트/);
  assert.match(honey,/벌집 조직과 라운드넥, 총장 50cm/);
  assert.match(honey,/측정 단위는 확인 중/);
  assert.doesNotMatch(honey,/실측 사이즈 · cm/);

  const honeyImages=[...honey.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
  assert.equal(honeyImages.length,7);
  assert.match(honeyImages[0],/loading="eager"/);
  assert.match(honeyImages[0],/fetchpriority="high"/);
  assert.match(honeyImages[0],/width="1000" height="1000"/);
  for(const image of honeyImages.slice(1)){
    assert.match(image,/loading="lazy"/);
    assert.match(image,/width="\d+" height="\d+"/);
  }

  const offDuty=GR.catalogPresentation.qualityEditorialHtml(product({
    id:'off-duty-vneck-knit-vest',name:'오프듀티 V넥 니트 베스트',styleCode:'RM495',sku:'1020304050'
  }));
  assert.match(offDuty,/오프듀티 V넥 니트 베스트/);
  assert.match(offDuty,/V넥 입체 조직, 총장 46cm/);
  assert.match(offDuty,/앞목깊이<\/span><strong>14<\/strong>/);

  const muteLayer=GR.catalogPresentation.qualityEditorialHtml(product({
    id:'vneck-knit-vest',name:'뮤트레이어 V넥 니트 베스트',styleCode:'RM429',sku:'9721023441'
  }));
  assert.match(muteLayer,/보카시 조직과 깊은 V넥, 총장 54cm/);
  assert.match(muteLayer,/실물 사진 · 그레이 앞면/);
  assert.match(muteLayer,/ONE SIZE · 단면 기준 · 단위 cm/);
  assert.match(muteLayer,/<dt>사이즈<\/dt><dd>ONE SIZE<\/dd>.*<dt>제조자<\/dt><dd>걸스라미<\/dd>.*<dt>제조국<\/dt><dd>대한민국<\/dd>/s);
  assert.doesNotMatch(muteLayer,/제조연월|19,900|16,800/);
  const muteLayerImages=[...muteLayer.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
  assert.equal(muteLayerImages.length,10);
  assert.match(muteLayerImages[0],/loading="eager"/);
  for(const image of muteLayerImages.slice(1)) assert.match(image,/loading="lazy"/);

  const legacy=GR.catalogPresentation.qualityEditorialHtml(product({
    id:'vneck-knit-vest',name:'뮤트레이어 V넥 니트 베스트',styleCode:'',sku:'9721023441'
  }));
  assert.match(legacy,/RM429/);

  const ordinary=product({id:'ordinary',name:'일반 니트',styleCode:'RM999',sku:'RM999'});
  assert.equal(GR.catalogPresentation.qualityEditorialFor(ordinary),null);
  assert.equal(GR.catalogPresentation.qualityEditorialHtml(ordinary),'');
});

test('native detail ignores database-provided HTML for the supported products',()=>{
  const GR=loadApp();
  const html=GR.catalogPresentation.qualityEditorialHtml(product({
    detailHtml:'<script>window.compromised=true</script>',
    rawHTML:'<img src=x onerror=window.compromised=true>',
    desc:'DATABASE-INJECTED-COPY'
  }));
  assert.doesNotMatch(html,/script|onerror|DATABASE-INJECTED-COPY/);
  assert.match(html,/RM382/);
});

test('legacy RM429 without AI metadata still receives the native editorial layout',async()=>{
  const rootClasses=new Map(),detailClasses=new Map();
  const pd=pageElement(rootClasses),detail=pageElement(detailClasses);
  let giftRemoved=false,ready;
  const gift={...pageElement(),remove(){giftRemoved=true;}};
  const elements={
    '#site-header':pageElement(),'#site-footer':pageElement(),'#menu-btn':pageElement(),'#mobile-nav':pageElement(),
    '#pd':pd,'#pd-desc':detail,'#pd-reviews':pageElement(),'#pd-notice':pageElement(),'#related-grid':pageElement(),
    '#color-opts':pageElement(),'#size-opts':pageElement(),'.pd-info .gift':gift
  };
  const legacy=product({
    id:'vneck-knit-vest',name:'걸스라미 뮤트레이어 V넥 니트 베스트',styleCode:'',sku:'9721023441',
    catalogImage:'vest.jpg',newRelease:false,smartstore:'https://smartstore.naver.com/girlsrami/products/9721023441',storeUrl:'https://smartstore.naver.com/girlsrami/products/9721023441',
    material:'',fit:'',length:'',thickness:'',stretch:'',sheer:'',care:'',desc:'',detailImages:[],reviews:[]
  });
  const GR={
    bootPromise:Promise.resolve(),bootError:null,PRODUCTS:[legacy],CONTENT:null,CATEGORIES:[],COLORS:{그레이프:'#70445f'},
    STORE_URL:'https://example.com/store',TALK_URL:'https://example.com/talk',
    byId:id=>id===legacy.id?legacy:null,fmt:n=>`${Number(n).toLocaleString('ko-KR')}원`,discount:()=>0
  };
  const document={
    body:{dataset:{page:'product'}},title:'',
    querySelector:selector=>elements[selector]??null,querySelectorAll:()=>[],
    addEventListener:(type,handler)=>{if(type==='DOMContentLoaded') ready=handler;}
  };
  const location={search:'?id=vneck-knit-vest',href:'https://girlslami.com/product.html?id=vneck-knit-vest'};
  vm.runInNewContext(appSource,{
    window:{GR},GR,document,location,navigator:{clipboard:{writeText:async()=>{}}},
    URLSearchParams,encodeURIComponent,Intl,setTimeout,clearTimeout
  });

  await ready();

  assert.equal(rootClasses.get('pd-editorial'),true);
  assert.equal(detailClasses.get('pd-editorial-detail'),true);
  assert.match(detail.innerHTML,/class="quality-editorial/);
  assert.match(pd.innerHTML,/<h1 class="name">뮤트레이어 V넥 니트 베스트<\/h1>/);
  assert.doesNotMatch(pd.innerHTML,/걸스라미 뮤트레이어/);
  assert.equal(document.title,'뮤트레이어 V넥 니트 베스트 | 걸스라미');
  assert.equal(giftRemoved,true);
});


test('listing crops are separate from full-body detail looks',()=>{
  const presentation={thumbnail:'full-body.webp',cardThumbnail:'street-crop.webp',thumbnailColor:'크림',looks:[{id:'signature',label:'시그니처',images:{크림:'full-body.webp'}}]};
  const GR=loadApp({'honey-loop-crop-knit':presentation});
  const html=GR.card(product());
  assert.match(html,/src="street-crop.webp"/);
  assert.doesNotMatch(html,/src="full-body.webp"/);
  const context={window:{},GR};
  vm.runInNewContext(readFileSync(new URL('../standard-detail.js',import.meta.url),'utf8'),context);
  const detail=context.window.GRStandardDetail.normalize(product(),presentation);
  assert.equal(detail.looks[0].images['크림'],'full-body.webp');
});
