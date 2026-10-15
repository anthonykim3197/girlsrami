import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const context={window:{}};
vm.runInNewContext(readFileSync(new URL('../detail-catalog.js',import.meta.url),'utf8'),context);
const detail=context.window.GR_DETAIL['stripe-cable-half'];
const colors=['곤색','베이지','초록','하늘','연핑'];
const asset=path=>readFileSync(new URL('../'+path,import.meta.url));

test('RM401 has a real WebP hero and both rotation sheets for every sale color',()=>{
  const paths=[];
  for(const color of colors){
    const hero=detail.looks.find(look=>look.images[color])?.images[color];
    assert.ok(hero,`${color}: missing model styling image`);
    paths.push(hero);
    for(const mode of ['model360','product360']){
      const sheets=detail[mode][color]?.sheets;
      assert.equal(sheets?.length,2,`${color}: missing ${mode} front/back sheets`);
      paths.push(...sheets);
    }
  }
  assert.equal(new Set(paths).size,25,'Each color/view must have its own asset');
  for(const path of paths){
    const bytes=asset(path);
    assert.equal(bytes.toString('ascii',0,4),'RIFF',path);
    assert.equal(bytes.toString('ascii',8,12),'WEBP',path);
    assert.ok(bytes.length>10000,`${path}: asset appears incomplete`);
  }
});

test('RM401 retains original color photographs and verified product measurements',()=>{
  for(const color of colors)assert.ok(detail.originals[color]?.some(photo=>photo.src.includes('/source-rm401-')),color);
  assert.equal(detail.size,'FREE');
  assert.equal(detail.sizeUnit,'cm');
  assert.equal(detail.measurements.find(m=>m.label==='가슴 단면').value,46);
  assert.equal(detail.measurements.find(m=>m.label==='총장').value,45);
});

test('RM401 offers four complete outfit choices across all five colors',()=>{
  assert.equal(detail.looks.length,4);
  const paths=detail.looks.flatMap(look=>colors.map(color=>{
    assert.ok(look.images[color],`${look.id}: ${color} styling missing`);
    return look.images[color];
  }));
  assert.equal(new Set(paths).size,20);
  for(const path of paths){const bytes=asset(path);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length>10000);}
});
