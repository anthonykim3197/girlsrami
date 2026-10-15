import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const context={window:{}};
for (const file of ['standard-detail.js','detail-catalog.js']) vm.runInNewContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),context);

test('normalizing detail photos retains measured dimensions so lazy loading can reserve the real shape',()=>{
  const detail=context.window.GRStandardDetail.normalize({id:'fixture',name:'니트',colors:[]},{fabric:[{src:'/portrait.jpg',width:3024,height:4032},{src:'/landscape.jpg',width:2048,height:1365}]});
  assert.equal(detail.fabric[0].width,3024);
  assert.equal(detail.fabric[0].height,4032);
  assert.equal(detail.fabric[1].width,2048);
  assert.equal(detail.fabric[1].height,1365);
});

test('every current fabric image and color board has measured size metadata before review anchors render',()=>{
  for(const [id,detail] of Object.entries(context.window.GR_DETAIL)){
    for(const image of detail.fabric||[]){
      assert.ok(Number.isInteger(image.width)&&image.width>0,`${id}: ${image.src} missing width`);
      assert.ok(Number.isInteger(image.height)&&image.height>0,`${id}: ${image.src} missing height`);
    }
    if(detail.colorBoard){
      assert.ok(Number.isInteger(detail.colorBoardSize?.width)&&detail.colorBoardSize.width>0,`${id}: board width`);
      assert.ok(Number.isInteger(detail.colorBoardSize?.height)&&detail.colorBoardSize.height>0,`${id}: board height`);
    }
  }
});
