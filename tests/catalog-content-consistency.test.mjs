import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';
import {validateDetailContent} from '../scripts/validate-detail-content.mjs';

const root = new URL('../',import.meta.url);
const c = {window:{}};
vm.runInNewContext(readFileSync(new URL('detail-catalog.js',root),'utf8'),c);
const details = JSON.parse(JSON.stringify(c.window.GR_DETAIL));
const products = JSON.parse(readFileSync(new URL('seo-products.json',root),'utf8')).products;

test('all sale products have the same complete editorial, styling, palette, fabric and size content',()=>{
  assert.deepEqual(validateDetailContent(products,details),{products:12,colors:65,looks:260});
});

test('the build gate detects missing palettes, unavailable color looks and misleading photo captions',()=>{
  const copy=structuredClone(details),p=products.find(p=>p.id==='boucle-round-half-cardigan'),d=copy[p.id];
  delete d.colorBoard;
  delete d.looks[0].images[p.colors[0]];
  d.fabric[0].caption='실물 사진';d.fabric[0].mediaKind='studio-edit';
  assert.throws(()=>validateDetailContent([p],copy),error=>{
    assert.match(error.message,/Color Palette required/);
    assert.match(error.message,/missing .* photograph/);
    assert.match(error.message,/cannot be captioned as an original/);
    return true;
  });
});

test('studio detail photos keep the original photo sources separate and do not erase them',()=>{
  for(const p of products){
    const d=details[p.id];
    assert.ok(d.fabricOriginals.length,`${p.id} originals`);
    for(const original of d.fabricOriginals){
      assert.equal(original.mediaKind,'photo');
      assert.ok(!d.fabric.some(f=>f.mediaKind==='studio-edit'&&f.src===original.src),`${p.id} edited file overwrote original`);
    }
  }
});

test('all local editorial media exist and new studio image dimensions match their WebP headers',()=>{
  for(const p of products){
    const d=details[p.id];
    const images=[...d.looks.flatMap(l=>Object.values(l.images)),d.colorBoard,...d.fabric.map(f=>f.src)];
    for(const src of images) if(!/^https?:/.test(src)) assert.ok(existsSync(new URL(src.replace(/^\//,''),root)),src);
    for(const f of [...d.fabric,{src:d.colorBoard,...d.colorBoardSize}]){
      if(!f.src.includes('/v4/'))continue;
      const bytes=readFileSync(new URL(f.src.replace(/^\//,''),root));
      assert.equal(bytes.toString('ascii',0,4),'RIFF',f.src);
      assert.equal(bytes.toString('ascii',8,12),'WEBP',f.src);
      let size;
      for(let n=12;n+8<=bytes.length;){
        const chunk=bytes.toString('ascii',n,n+4),len=bytes.readUInt32LE(n+4),pos=n+8;
        if(chunk==='VP8X')size={width:bytes.readUIntLE(pos+4,3)+1,height:bytes.readUIntLE(pos+7,3)+1};
        if(chunk==='VP8 ')size ||= {width:bytes.readUInt16LE(pos+6)&0x3fff,height:bytes.readUInt16LE(pos+8)&0x3fff};
        n=pos+len+(len&1);
      }
      assert.deepEqual(size,{width:f.width,height:f.height},f.src);
    }
  }
});
