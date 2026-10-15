import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(readFileSync(new URL('../standard-detail.js',import.meta.url),'utf8'),context);
const normalize=(product,detail)=>JSON.parse(JSON.stringify(context.window.GRStandardDetail.normalize(product,detail)));
const colors=['곤색','보라','초록','베이지','블랙'];
const product={id:'rm401-fixture',name:'단가라 반팔 니트',colors};
const frames=prefix=>Array.from({length:8},(_,i)=>`${prefix}/${i*45}.webp`);

test('all five colors keep their own portrait model sheets and independent product sheets',()=>{
  const detail={model360:{},product360:{},looks:[{id:'daily',label:'데일리',images:{}}]};
  for(const [i,c] of colors.entries()){
    detail.model360[c]={sheets:[`model/${i}-front.webp`,`model/${i}-back.webp`],cellWidth:600,cellHeight:900};
    detail.product360[c]={sheets:[`product/${i}-front.webp`,`product/${i}-back.webp`]};
    detail.looks[0].images[c]=`hero/${i}.webp`;
  }
  const d=normalize(product,detail);
  assert.deepEqual(Object.keys(d.model360),colors);
  assert.deepEqual(Object.keys(d.product360),colors);
  for(const [i,c] of colors.entries()){
    assert.deepEqual(d.model360[c],{sheets:[`model/${i}-front.webp`,`model/${i}-back.webp`],cellWidth:600,cellHeight:900});
    assert.deepEqual(d.product360[c],{sheets:[`product/${i}-front.webp`,`product/${i}-back.webp`]});
    assert.equal(d.looks[0].images[c],`hero/${i}.webp`);
  }
});
test('existing eight-image model data and 627px square product cells remain valid',()=>{
  const d=normalize(product,{model360:{곤색:frames('model')},product360:{곤색:{sheets:['front.png','back.png'],cellSize:627},보라:{frames:frames('product')}}});
  assert.deepEqual(d.model360.곤색,frames('model'));
  assert.deepEqual(d.product360.곤색,{sheets:['front.png','back.png'],cellWidth:627,cellHeight:627});
  assert.deepEqual(d.product360.보라,{frames:frames('product')});
});
test('eight-image object data also works for models without changing editorial fallback',()=>{
  const p={...product,aiPresentation:{editorial:{turntables:{보라:{frames:frames('editorial')}}}}};
  const d=normalize(p,{model360:{곤색:{frames:frames('manifest')}}});
  assert.deepEqual(d.model360.곤색,{frames:frames('manifest')});
  assert.deepEqual(d.model360.보라,{frames:frames('editorial')});
});
test('incomplete rotations and unsafe sheet URLs are unavailable, never expanded into eight angles',()=>{
  const bad={곤색:{sheets:['front.png']},보라:{frames:frames('seven').slice(0,7)},초록:{sheets:['javascript:alert(1)','back.png']}};
  const d=normalize(product,{model360:bad,product360:bad});
  assert.deepEqual(d.model360,{});assert.deepEqual(d.product360,{});
});
test('omitted or invalid dimensions remain automatic and undeclared colors are not exposed',()=>{
  const d=normalize(product,{model360:{곤색:{sheets:['front.webp','back.webp'],cellWidth:-1,cellHeight:0},미판매:{sheets:['other.webp','other-back.webp']}}});
  assert.deepEqual(d.model360,{곤색:{sheets:['front.webp','back.webp']}});
});

test('color-specific outfit labels and item lists survive normalization',()=>{
  const d=normalize(product,{looks:[{id:'daily',label:'스타일링',images:{곤색:'navy.webp',보라:'purple.webp'},labelsByColor:{곤색:'셔츠와 스커트',보라:'데님과 로퍼'},itemsByColor:{곤색:['화이트 셔츠','미디 스커트'],보라:['인디고 데님','로퍼']}}]});
  assert.equal(d.looks[0].labelsByColor.곤색,'셔츠와 스커트');
  assert.deepEqual(d.looks[0].itemsByColor.보라,['인디고 데님','로퍼']);
});
