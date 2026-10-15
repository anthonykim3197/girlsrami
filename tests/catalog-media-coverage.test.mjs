import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

// 2026-10-15 sale registry. Update only with a verified catalog change, not to hide a media gap.
// An angle count proves coverage, not photographic authenticity or correct visual orientation.
const SALE_REGISTRY = [
  {
    "code": "RM385",
    "id": "cable-vneck-knit",
    "colors": [
      "소라",
      "회색",
      "아이",
      "베이지",
      "연핑",
      "보라",
      "초록",
      "곤색",
      "검정"
    ],
    "storeId": "8087805239",
    "originalHash": "97e8095b50a2afec957b7efa8044dabc11b4069e1f3811c40023847ea9d57e77",
    "originalCount": 9
  },
  {
    "code": "RM401",
    "id": "stripe-cable-half",
    "colors": [
      "곤색",
      "베이지",
      "초록",
      "하늘",
      "연핑"
    ],
    "storeId": "8424655623",
    "originalHash": "88428f12e1d93a932f5e2d4dcdf988b80cd908884629f7fa6a1aec600eb3ba91",
    "originalCount": 5
  },
  {
    "code": "RM429",
    "id": "vneck-knit-vest",
    "colors": [
      "그레이프",
      "모카",
      "그레이",
      "브라운",
      "올리브",
      "곤색"
    ],
    "storeId": "9721023441",
    "originalHash": "b333a2c0194e7543590e79628f74c6c7ffca75d46789f019d82aa331fc2e2628",
    "originalCount": 6
  },
  {
    "code": "RM375",
    "id": "alpaca-round-knit",
    "colors": [
      "회색",
      "차콜",
      "파랑",
      "크림",
      "오렌지",
      "네온",
      "보라"
    ],
    "storeId": "7594968064",
    "originalHash": "f49842ae2c07c11fdea6c5ce90f901f4b355b9686ab4cb9ae755289bd0916901",
    "originalCount": 7
  },
  {
    "code": "RM471",
    "id": "popcorn-vneck-half",
    "colors": [
      "노랑",
      "연두",
      "베이지",
      "검정"
    ],
    "storeId": "10115610353",
    "originalHash": "10f451f8d0cb5ed6ee41b4bb281cdfaaa97f78ad324b296981d71203a815d5b1",
    "originalCount": 4
  },
  {
    "code": "RM418",
    "id": "recycled-round-sweater",
    "colors": [
      "스카이",
      "곤색",
      "올리브",
      "모카",
      "그레이",
      "브라운"
    ],
    "storeId": "9704215111",
    "originalHash": "f1d7c04ab19754d2df0cb1afa2eea04acb7159da49e878b53272f61f8caf9f1e",
    "originalCount": 6
  },
  {
    "code": "RM277",
    "id": "boucle-crop-cardigan",
    "colors": [
      "연두",
      "연밤",
      "베이지",
      "소라",
      "곤색"
    ],
    "storeId": "6679667474",
    "originalHash": "d2b201801c2701003267fa0f8f7a26825180e5e05ab0118e46319b0ee768d4f8",
    "originalCount": 5
  },
  {
    "code": "RM336",
    "id": "fisherman-crop-bustier",
    "colors": [
      "베이지",
      "연밤",
      "소라",
      "검정"
    ],
    "storeId": "6600921594",
    "originalHash": "21ccb59abb9a58854faa1c5fd3351336d7da30d4fe1b8549d4a147902674c12f",
    "originalCount": 4
  },
  {
    "code": "RM279",
    "id": "boucle-round-half-cardigan",
    "colors": [
      "라임",
      "연두",
      "베이지",
      "소라",
      "곤색"
    ],
    "storeId": "5565703580",
    "originalHash": "cfb98522a1b788a9bd4de49fa2ca5d55db088288e0e0d0365a5c948b4f3bb558",
    "originalCount": 5
  },
  {
    "code": "RM274",
    "id": "boucle-fisher-vneck-vest",
    "colors": [
      "아이",
      "연두",
      "베이지",
      "소라",
      "연회색"
    ],
    "storeId": "5548814040",
    "originalHash": "18fbd51714b5d6375109ea73217f02cfdae2701340d248e3516a8eec8bb4385a",
    "originalCount": 5
  },
  {
    "code": "RM382",
    "id": "honey-loop-crop-knit",
    "colors": [
      "크림",
      "카멜",
      "차콜",
      "스카이"
    ],
    "storeId": "13795042666",
    "originalHash": "2e13e4e9fa4ab590c4566491b07f0427d50d44c928afdfe5f4fc8930e03a8422",
    "originalCount": 1
  },
  {
    "code": "RM495",
    "id": "off-duty-vneck-knit-vest",
    "colors": [
      "스카이",
      "차콜",
      "크림",
      "카멜",
      "회색"
    ],
    "storeId": "13795688981",
    "originalHash": "852fda00fe067e372e664bd3322e0ed1a4d08cf9a7a61fc489b54b03eedb0ab7",
    "originalCount": 8
  }
];
const ORIGINAL_GRAY_FILES = [
  {
    "angle": 0,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/000.jpg",
    "sha256": "d33f76f2b468a89f01b9b3115e8cf64bd953c1ff2ae1e9e55256916ce1684036"
  },
  {
    "angle": 45,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/045.jpg",
    "sha256": "533ee4b6a3066c305ded8075f45db8750d1dcaa7cc7b566f928efeba5be98da3"
  },
  {
    "angle": 90,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/090.jpg",
    "sha256": "bd8bc0e9f78e7faac51d7b6962197e5f288bb8491b06df43fb969a4c39bf171e"
  },
  {
    "angle": 135,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/135.jpg",
    "sha256": "116b9b6d696c6eedfce1093d5828cc1115e256e49dc0510292fa8adfe4b3b69e"
  },
  {
    "angle": 180,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/180.jpg",
    "sha256": "460d905519feda84fa9efb43c3ad05e5a2889dcc8e8db603d14ac14cbcea829c"
  },
  {
    "angle": 225,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/225.jpg",
    "sha256": "d5654bd81bd2eb8337051333db05e908a516f2868ec3bf1c37ad31d6fbca06ce"
  },
  {
    "angle": 270,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/270.jpg",
    "sha256": "38987e078e64fb38e42bfd1c15ef8d5a9e5913d6baf0c5e4a6bee9badfa26e3f"
  },
  {
    "angle": 315,
    "src": "/assets/detail/off-duty-vneck-knit-vest/originals/315.jpg",
    "sha256": "82a232211e8dcb7205262a817aad5007f84953b94341d21424a01483c57cbcf4"
  }
];
const ANGLES = [0,45,90,135,180,225,270,315];
const LEGACY_ID = 'off-duty-vneck-knit-vest';
const PUBLIC_ORIGIN = 'https://rlbffhmdonbzifiivbfl.supabase.co';
const LEGACY_COLORS = {'스카이':'sky','차콜':'charcoal','크림':'cream','카멜':'camel','회색':'gray'};
const LEGACY_PREFIX = '/storage/v1/object/public/catalog/editorial-20261003-v3/assets/';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NEW9_LAUNCH = JSON.parse(readFileSync(resolve(root,'tests/fixtures/new9-launch-20261016.json'),'utf8'));
SALE_REGISTRY.push(...NEW9_LAUNCH.registry);
const context = {window:{}};
vm.runInNewContext(readFileSync(resolve(root,'detail-catalog.js'),'utf8'), context);
const details = JSON.parse(JSON.stringify(context.window.GR_DETAIL));
const seo = JSON.parse(readFileSync(resolve(root,'seo-products.json'),'utf8')).products;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const cache = new Map();

function localFile(src) {
  assert.equal(typeof src,'string');
  assert.ok(!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(src),`${src}: expected local asset`);
  assert.ok(!/[?#]/.test(src),`${src}: local asset must be an exact file path`);
  const path = realpathSync(resolve(root,src.replace(/^\//,'')));
  assert.ok(path.startsWith(root+sep),`${src}: asset escapes release root`);
  return {path,bytes:readFileSync(path)};
}

// Read real encoded dimensions. Do not trust filenames, expected sheet size, or CSS declarations.
function webpSize(bytes, src) {
  assert.ok(bytes.length>32,`${src}: truncated WebP`);
  assert.equal(bytes.toString('ascii',0,4),'RIFF',src);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',src);
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length,`${src}: invalid RIFF length`);
  let offset=12, imageSize, canvas, imageChunks=0;
  while(offset<bytes.length) {
    assert.ok(offset+8<=bytes.length,`${src}: truncated chunk header`);
    const tag=bytes.toString('ascii',offset,offset+4), length=bytes.readUInt32LE(offset+4);
    const start=offset+8, end=start+length;
    assert.ok(end<=bytes.length,`${src}: truncated ${tag} data`);
    if(tag==='VP8X') {
      assert.equal(length,10,`${src}: VP8X size`);
      assert.equal(bytes[start]&2,0,`${src}: rotation sheets must be still images`);
      canvas={width:bytes.readUIntLE(start+4,3)+1,height:bytes.readUIntLE(start+7,3)+1};
    } else if(tag==='VP8 ') {
      assert.ok(length>=10,`${src}: truncated VP8 frame`);
      assert.equal(bytes[start]&1,0,`${src}: expected VP8 key frame`);
      assert.equal(bytes.subarray(start+3,start+6).toString('hex'),'9d012a',`${src}: VP8 frame signature`);
      imageSize={width:bytes.readUInt16LE(start+6)&0x3fff,height:bytes.readUInt16LE(start+8)&0x3fff};
      imageChunks++;
    } else if(tag==='VP8L') {
      assert.ok(length>=5,`${src}: truncated VP8L frame`);
      assert.equal(bytes[start],0x2f,`${src}: VP8L signature`);
      const bits=bytes.readUInt32LE(start+1);
      assert.equal(bits>>>29,0,`${src}: unsupported VP8L version`);
      imageSize={width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};
      imageChunks++;
    }
    offset=end+(length&1);
  }
  assert.equal(offset,bytes.length,`${src}: invalid chunk padding`);
  assert.equal(imageChunks,1,`${src}: expected one still-image bitstream`);
  assert.ok(imageSize.width>0&&imageSize.height>0,`${src}: invalid dimensions`);
  if(canvas) assert.deepEqual(canvas,imageSize,`${src}: canvas differs from encoded image`);
  return imageSize;
}

function pngSize(bytes, src) {
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',src);
  assert.equal(bytes.readUInt32BE(8),13,`${src}: invalid IHDR`);
  assert.equal(bytes.toString('ascii',12,16),'IHDR',src);
  assert.equal(bytes.toString('ascii',bytes.length-8,bytes.length-4),'IEND',`${src}: missing PNG end`);
  return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
}

function localImage(src, expectedExtension='webp') {
  const {path,bytes}=localFile(src);
  assert.ok(src.endsWith('.'+expectedExtension),`${src}: expected ${expectedExtension}`);
  if(!cache.has(path)) {
    const dimensions=expectedExtension==='png'?pngSize(bytes,src):webpSize(bytes,src);
    cache.set(path,{...dimensions,path,hash:hash(bytes)});
  }
  return cache.get(path);
}

function legacyRemote(src, kind) {
  const url=new URL(src);
  assert.equal(url.origin,PUBLIC_ORIGIN,`${src}: unexpected legacy host`);
  assert.ok(url.pathname.startsWith(LEGACY_PREFIX+kind+'/'+LEGACY_ID+'/'),`${src}: unexpected legacy source`);
  assert.ok(url.pathname.endsWith('.webp'),`${src}: expected existing WebP`);
  assert.equal(url.search,'',src); assert.equal(url.hash,'',src);
  return {path:url.href}; // Offline verification does not claim HTTP availability or encoded dimensions.
}

function rotation(entry, mode, product, color) {
  const label=`${product.code}/${color}/${mode}`;
  const frames=Array.isArray(entry)?entry:entry?.frames;
  if(frames) {
    assert.equal(product.id,LEGACY_ID,`${label}: only RM495 may reuse individual frames`);
    assert.equal(mode,'model360',`${label}: product rotation must use local sheets`);
    assert.equal(frames.length,8,`${label}: must contain eight independent angles`);
    return frames.map((src,index)=>{
      const angle=String(ANGLES[index]).padStart(3,'0');
      // The approved Gray turntable was copied locally; the other four colors remain remote.
      if(color==='회색') {
        assert.equal(src,`/assets/detail/${LEGACY_ID}/model360/gray/${angle}.webp`,`${label}: wrong local angle or color`);
        return {...localImage(src),owner:label+'/'+ANGLES[index]};
      }
      const result=legacyRemote(src,'turntable');
      assert.ok(new URL(src).pathname.includes(`/turntable/${LEGACY_ID}/${LEGACY_COLORS[color]}/`),`${label}: frame belongs to another color`);
      assert.equal(new URL(src).pathname.match(/\/(\d{3})-[a-f0-9]+\.webp$/)?.[1],angle,`${label}: wrong angle order`);
      return {...result,owner:label+'/'+ANGLES[index]};
    });
  }
  assert.equal(entry?.sheets?.length,2,`${label}: missing front/back 2x2 sheets`);
  const images=entry.sheets.map((src,index)=>{
    assert.ok(src.endsWith('-'+(index===0?'front':'back')+'.'+(product.id===LEGACY_ID?'png':'webp')),`${label}: wrong front/back sheet order`);
    return {...localImage(src,product.id===LEGACY_ID?'png':'webp')};
  });
  assert.deepEqual(images.map(({width,height})=>[width,height]),[[images[0].width,images[0].height],[images[0].width,images[0].height]],`${label}: sheet sizes differ`);
  for(const [index,image] of images.entries()) {
    assert.equal(image.width%2,0,`${label}: columns must divide evenly`);
    assert.equal(image.height%2,0,`${label}: rows must divide evenly`);
    const width=entry.cellWidth??entry.cellSize, height=entry.cellHeight??entry.cellSize;
    if(width!==undefined) assert.equal(width,image.width/2,`${label}: declared cell width differs from encoded image`);
    if(height!==undefined) assert.equal(height,image.height/2,`${label}: declared cell height differs from encoded image`);
    // Missing cell dimensions mean the renderer reads naturalWidth/2 and naturalHeight/2 (RM401).
    assert.ok(image.width/2>=500&&image.height/2>=500,`${label}: undersized rotation cell`);
    image.owner=label+'/'+(index===0?'front':'back');
  }
  return images;
}

const references=[];
test('release registry contains the twelve existing and nine new sale designs with 155 sale colors',()=>{
  assert.equal(SALE_REGISTRY.length,21);
  assert.equal(SALE_REGISTRY.reduce((sum,p)=>sum+p.colors.length,0),155);
  assert.deepEqual(sorted(Object.keys(details)),sorted(SALE_REGISTRY.map(p=>p.id)));
  assert.deepEqual(sorted(seo.map(p=>p.id)),sorted(SALE_REGISTRY.map(p=>p.id)));
  for(const product of SALE_REGISTRY) {
    const live=seo.find(p=>p.id===product.id);
    assert.deepEqual(sorted(live.colors),sorted(product.colors),product.code);
    assert.equal(live.storeUrl,`https://smartstore.naver.com/girlsrami/products/${product.storeId}`,product.code);
    assert.equal(details[product.id].isNewDesign,['RM382','RM495',...NEW9_LAUNCH.registry.map(p=>p.code)].includes(product.code),`${product.code}: NEW must follow the owner-confirmed launch classification`);
  }
});

for(const product of SALE_REGISTRY) {
  test(`${product.code}: every sale color has its own styling, model 8-angle and product 8-angle set`,()=>{
    const detail=details[product.id];
    assert.ok(detail,product.id);
    assert.deepEqual(sorted(Object.keys(detail.model360)),sorted(product.colors),`${product.code}: model sale colors`);
    assert.deepEqual(sorted(Object.keys(detail.product360)),sorted(product.colors),`${product.code}: product sale colors`);
    const available=sorted(new Set(detail.looks.flatMap(look=>Object.keys(look.images))));
    assert.deepEqual(available,sorted(product.colors),`${product.code}: styling sale colors`);
    const lookIds=new Set(), lookPaths=new Set(), lookHashes=new Set();
    for(const look of detail.looks) {
      assert.ok(look.id&&!lookIds.has(look.id),`${product.code}: duplicate or missing styling ID`);
      lookIds.add(look.id);
      assert.deepEqual(sorted(Object.keys(look.images)),sorted(product.colors),`${product.code}/${look.id}: every selectable outfit needs every sale color`);
      for(const src of Object.values(look.images)) {
        const image=product.id===LEGACY_ID?legacyRemote(src,'looks'):localImage(src);
        assert.ok(!lookPaths.has(image.path),`${product.code}/${look.id}: a styling option reuses an existing image`);
        lookPaths.add(image.path);
        if(image.hash) {
          assert.ok(!lookHashes.has(image.hash),`${product.code}/${look.id}: a styling option reuses identical image content`);
          lookHashes.add(image.hash);
        }
      }
    }
    for(const color of product.colors) {
      const look=detail.looks.find(item=>item.images[color]);
      assert.ok(look,`${product.code}/${color}: missing hero`);
      const image=product.id===LEGACY_ID?legacyRemote(look.images[color],'looks'):localImage(look.images[color]);
      references.push({...image,owner:`${product.code}/${color}/hero`});
      references.push(...rotation(detail.model360[color],'model360',product,color));
      references.push(...rotation(detail.product360[color],'product360',product,color));
    }
    assert.ok(product.colors.includes(detail.thumbnailColor),`${product.code}: thumbnail uses an unavailable color`);
    localImage(detail.thumbnail);
    if(product.id!==LEGACY_ID) assert.ok(detail.looks.some(look=>look.images[detail.thumbnailColor]===detail.thumbnail),`${product.code}: thumbnail color/image mismatch`);
    else {
      assert.equal(detail.looks.length,4,'RM495 retains four approved outfits, not four newly generated rotations');
      for(const look of detail.looks) {
        assert.deepEqual(sorted(Object.keys(look.images)),sorted(product.colors));
        for(const src of Object.values(look.images)) legacyRemote(src,'looks');
      }
    }
  });
  test(`${product.code}: actual source photograph references are preserved independently from generated views`,()=>{
    const detail=details[product.id];
    const original=Object.keys(detail.originals).sort().map(color=>[color,detail.originals[color].map(({angle,src})=>({angle,src}))]);
    assert.equal(original.reduce((sum,[,photos])=>sum+photos.length,0),product.originalCount);
    assert.equal(hash(JSON.stringify(original)),product.originalHash,`${product.code}: original photo reference changed; inspect provenance before updating this baseline`);
    const generated=new Set([...detail.looks.flatMap(l=>Object.values(l.images)),...['model360','product360'].flatMap(mode=>Object.values(detail[mode]).flatMap(v=>Array.isArray(v)?v:v.sheets??v.frames??[]))]);
    for(const [,photos] of original) for(const photo of photos) {
      assert.ok(!generated.has(photo.src),`${product.code}: source mislabeled as generated rotation`);
      if(photo.src.startsWith('https://')) assert.equal(new URL(photo.src).origin,PUBLIC_ORIGIN);
      else localFile(photo.src);
    }
  });
}

test('sale colors and views do not reuse the same path or identical local file bytes',()=>{
  const paths=new Map(), hashes=new Map();
  for(const image of references) {
    assert.ok(!paths.has(image.path),`${image.owner}: same asset as ${paths.get(image.path)}`);
    paths.set(image.path,image.owner);
    if(image.hash) {
      assert.ok(!hashes.has(image.hash),`${image.owner}: duplicate encoded content from ${hashes.get(image.hash)}`);
      hashes.set(image.hash,image.owner);
    }
  }
  // 150 colors use one local hero + four sheets. RM495 adds 5 remote heroes,
  // 32 remote model frames, 8 local Gray model frames and 10 local PNG product sheets.
  assert.equal(references.length,805);
  assert.equal(references.filter(image=>image.hash).length,768);
});

test('RM495 keeps all eight photographed Gray originals byte-for-byte',()=>{
  assert.deepEqual(ORIGINAL_GRAY_FILES.map(photo=>photo.angle),ANGLES);
  for(const photo of ORIGINAL_GRAY_FILES) {
    const {bytes}=localFile(photo.src);
    assert.equal(bytes.subarray(0,3).toString('hex'),'ffd8ff',photo.src);
    assert.equal(hash(bytes),photo.sha256,`${photo.src}: photographed original was modified`);
  }
});

test('new launch preserves 72 source photographs independently from generated media',()=>{
  assert.equal(NEW9_LAUNCH.registry.length,9);
  assert.equal(NEW9_LAUNCH.originals.length,72);
  for(const product of NEW9_LAUNCH.registry){
    assert.equal(product.colors.length,10);
    assert.ok(!product.colors.includes('오트밀'));
    const photographs=NEW9_LAUNCH.originals.filter(p=>p.code===product.code);
    assert.deepEqual(photographs.map(p=>Number(p.angle)),ANGLES);
    assert.deepEqual(details[product.id].fabricOriginals.map(p=>p.src),photographs.map(p=>p.src));
    for(const photo of photographs)assert.equal(hash(localFile(photo.src).bytes),photo.sha256,photo.src);
  }
});
