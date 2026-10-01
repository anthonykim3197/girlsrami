import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const alice='00000000-0000-4000-8000-000000000001';
const bob='00000000-0000-4000-8000-000000000002';
const admin='00000000-0000-4000-8000-000000000003';
async function setup({serverConsent=true}={}){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;
    create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text,created_at timestamptz default now());
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon,authenticated,service_role;grant select,insert,delete on storage.objects to authenticated;
    create function storage.foldername(text) returns text[] language sql as $$select string_to_array($1,'/')$$;
    insert into auth.users values ('${alice}'),('${bob}'),('${admin}');`);
  await db.exec(`alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
    alter default privileges in schema public grant execute on functions to anon,authenticated,service_role;`);
  await db.exec(await readFile(new URL('../supabase/migrations/001_core.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/002_fitting.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/004_color_photos.sql',import.meta.url),'utf8'));
  if(serverConsent)await db.exec(await readFile(new URL('../supabase/migrations/005_korea_gpu_consent.sql',import.meta.url),'utf8'));
  await db.query('insert into public.admin_users values($1)',[admin]);
  return db;
}
async function as(db,id,role='authenticated'){await db.exec(`reset role;set role ${role};set request.jwt.claim.sub='${id}';`);}
test('the existing catalog imports all fifteen products without inventing options or purchase URLs',async()=>{
  const db=await setup();
  try{
    const sql=execFileSync(process.execPath,[new URL('../scripts/seed-sql.mjs',import.meta.url).pathname],{encoding:'utf8'});
    await db.exec(sql);await db.exec(sql);
    assert.equal((await db.query('select count(*)::int as n from products')).rows[0].n,15);
    assert.equal((await db.query('select count(*)::int as n from product_drafts')).rows[0].n,15);
    assert.deepEqual((await db.query("select payload->'colors' as colors from products where id='vneck-knit-vest'")).rows[0].colors,[]);
    assert.equal((await db.query("select payload->>'storeUrl' as url from products where id='wool-cable-regular'")).rows[0].url,'');
  }finally{await db.close();}
});
test('hosted default grants cannot expose worker RPCs or private job columns',async()=>{
  const db=await setup();
  try{
    await as(db,'','anon');
    await assert.rejects(db.query('select * from worker_claim()'),/permission denied/);
    await assert.rejects(db.query('select expired_image_paths()'),/permission denied/);
    await as(db,alice);
    await assert.rejects(db.query('select lease,input_path from fitting_jobs'),/permission denied/);
    assert.equal((await db.query("select has_table_privilege('authenticated','public.products','truncate') as allowed")).rows[0].allowed,false);
  }finally{await db.close();}
});
test('another member and catalog admin cannot read private dimensions or photos',async()=>{
  const db=await setup();
  try{
    await as(db,alice);await db.query('insert into profiles(id,measurements)values($1,$2)',[alice,{height:160,chest:92,fit:'regular'}]);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v2']);
    await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',alice+'/a/input.jpg']);
    for(const id of [bob,admin]){await as(db,id);assert.equal((await db.query('select * from profiles')).rows.length,0);assert.equal((await db.query('select * from storage.objects')).rows.length,0);}
    await assert.rejects(db.query('insert into profiles(id,measurements)values($1,$2)',[alice,{}]));
  }finally{await db.close();}
});
test('photo jobs require consent, ownership, live engine, daily limit and cancellation wins over completion',async()=>{
  const db=await setup();const p={id:'knit',name:'Knit',price:12900,stock:2,image:'p.jpg',colors:['Beige'],colorPhotos:{Beige:{image:'p.jpg',verified:true}},sizes:[{label:'M',chestHalf:52,length:54,verified:true}],status:'active',photoVerified:true,storeUrl:'https://smartstore.naver.com/girlsrami/products/1'};
  const path=alice+'/a/input.jpg';const make=(key)=>db.query('select create_fit_job($1,$2,$3,$4,$5) as id',[key,'knit','Beige',path,'2026-10-01-v2']);
  try{
    await db.query('insert into products(id,payload)values($1,$2)',['knit',p]);
    await as(db,alice);await assert.rejects(make('10000000-0000-4000-8000-000000000001'),/PHOTO_CONSENT_REQUIRED/);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v2']);
    await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',path]);
    await assert.rejects(make('10000000-0000-4000-8000-000000000001'),/ENGINE_UNAVAILABLE/);
    await as(db,'','service_role');await db.query('select * from worker_claim()');await as(db,alice);
    await assert.rejects(make('10000000-0000-4000-8000-000000000001'),/ENGINE_UNAVAILABLE/);
    await as(db,'','service_role');await db.query('update worker_state set enabled=true');await as(db,alice);
    const key='10000000-0000-4000-8000-000000000001';const id=(await make(key)).rows[0].id;assert.equal((await make(key)).rows[0].id,id);
    await assert.rejects(db.exec("update fitting_jobs set status='completed'"));
    await as(db,bob);await assert.rejects(make('10000000-0000-4000-8000-000000000002'),/PHOTO_CONSENT_REQUIRED/);
    await as(db,'','service_role');const job=(await db.query('select * from worker_claim()')).rows[0];
    await as(db,alice);await db.query('select begin_fitting_withdrawal()');
    assert.equal((await db.query('select * from photo_consents')).rows.length,0);
    assert.equal((await db.query('select status from fitting_jobs')).rows[0].status,'cancelled');
    await as(db,'','service_role');assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[id,job.lease,alice+'/a/output.jpg'])).rows[0].accepted,false);
    await as(db,alice);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v2']);
    for(const n of [2,3]){const j=(await make('10000000-0000-4000-8000-00000000000'+n)).rows[0].id;await db.query('select cancel_fit_job($1)',[j]);}
    await assert.rejects(make('10000000-0000-4000-8000-000000000004'),/DAILY_LIMIT/);
    await assert.rejects(db.query('select erase_fitting_data()'),/REMOVE_IMAGES_FIRST/);
    await db.query('delete from storage.objects where name=$1',[path]);await db.query('select erase_fitting_data()');
    assert.equal((await db.query('select * from photo_consents')).rows.length,0);
    assert.equal((await db.query('select id from fitting_jobs')).rows.length,0);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v2']);
    await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',path]);
    await assert.rejects(make('10000000-0000-4000-8000-000000000005'),/DAILY_LIMIT/);
  }finally{await db.close();}
});
test('publish requires admin and optimistic version; drafts stay private',async()=>{
  const db=await setup();const payload={id:'knit',name:'Knit',price:12900,stock:2,image:'p-knit.jpg',colors:['Beige'],sizes:[{label:'M',chestHalf:52,length:54,verified:true}],status:'active',photoVerified:false,storeUrl:'https://smartstore.naver.com/girlsrami/products/1'};
  try{
    await as(db,alice);await assert.rejects(db.query('select save_product_draft($1,$2,$3)', ['knit',payload,0]));
    await as(db,admin);await db.query('select save_product_draft($1,$2,$3)',['knit',payload,0]);
    await as(db,alice);assert.equal((await db.query('select * from product_drafts')).rows.length,0);assert.equal((await db.query('select * from products')).rows.length,0);
    await as(db,admin);await db.query('select publish_product($1,$2)',['knit',1]);
    await assert.rejects(db.query('select save_product_draft($1,$2,$3)',['knit',{...payload,price:15000},0]));
    await as(db,alice);assert.equal((await db.query('select payload from products')).rows[0].payload.price,12900);
    await assert.rejects(db.exec('update products set version=999'));
  }finally{await db.close();}
});
test('cart rejects nonexistent color, unknown size, oversold quantity',async()=>{
  const db=await setup();const p={id:'knit',name:'Knit',price:12900,stock:2,image:'p.jpg',colors:['Beige'],sizes:[{label:'M',chestHalf:52,length:54,verified:true}],status:'active',photoVerified:true,storeUrl:'https://smartstore.naver.com/girlsrami/products/1'};
  try{
    await db.query('insert into products(id,payload)values($1,$2)',['knit',p]);await as(db,alice);
    await assert.rejects(db.query('select add_to_cart($1,$2,$3,$4)',['knit','Red','M',1]));
    await assert.rejects(db.query('select add_to_cart($1,$2,$3,$4)',['knit','Beige','XXL',1]));
    await assert.rejects(db.query('select add_to_cart($1,$2,$3,$4)',['knit','Beige','M',3]));
    const id=(await db.query('select add_to_cart($1,$2,$3,$4) as id',['knit','Beige','M',2])).rows[0].id;
    await db.query('select set_cart_quantity($1,$2)',[id,1]);
    assert.equal((await db.query('select quantity from cart_items')).rows[0].quantity,1);
    await assert.rejects(db.query('select set_cart_quantity($1,$2)',[id,3]),/OPTION_UNAVAILABLE/);
    await as(db,bob);assert.equal((await db.query('select * from cart_items')).rows.length,0);
    await assert.rejects(db.query('select set_cart_quantity($1,$2)',[id,1]),/OPTION_UNAVAILABLE/);
    await as(db,'','service_role');
    await db.query('insert into products(id,payload)values($1,$2)',['unknown-colors',{...p,id:'unknown-colors',colors:[]}]);
    await assert.rejects(db.query('insert into products(id,payload)values($1,$2)',['fractional-stock',{...p,id:'fractional-stock',stock:1.5}]));
    await as(db,alice);
    await assert.rejects(db.query('select add_to_cart($1,$2,$3,$4)',['unknown-colors','Beige','M',1]),/OPTION_UNAVAILABLE/);
  }finally{await db.close();}
});

const photoProduct={id:'color-knit',name:'Color knit',price:12900,stock:2,image:'p-beige.jpg',colors:['Beige','Navy'],sizes:[{label:'M',chestHalf:52,length:54,verified:true}],status:'active',photoVerified:true,storeUrl:'',colorPhotos:{Beige:{image:'p-beige.jpg',verified:true},Navy:{image:'p-navy.jpg',verified:true}}};
async function preparePhotoJob(db,p=photoProduct){
  await db.query('insert into products(id,payload)values($1,$2)',[p.id,p]);
  await db.exec('update worker_state set enabled=true,last_seen=now()');
  await as(db,alice);
  await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v2']);
  const path=alice+'/color-test/input.jpg';
  await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',path]);
  return ()=>db.query('select create_fit_job($1,$2,$3,$4,$5)',['10000000-0000-4000-8000-000000000011',p.id,'Navy',path,'2026-10-01-v2']);
}
test('GPU job snapshots the selected color photo instead of the representative photo',async()=>{
  const db=await setup();
  try{
    const create=await preparePhotoJob(db);await create();await as(db,'','service_role');
    assert.equal((await db.query('select product_image from worker_claim()')).rows[0].product_image,'p-navy.jpg');
  }finally{await db.close();}
});
test('a verified representative photo cannot authorize a missing or unverified selected color',async()=>{
  for(const colorPhotos of [{Beige:photoProduct.colorPhotos.Beige},{...photoProduct.colorPhotos,Navy:{image:'p-navy.jpg',verified:false}}]){
    const db=await setup();
    try{const create=await preparePhotoJob(db,{...photoProduct,colorPhotos});await assert.rejects(create(),/PRODUCT_PHOTO_PENDING/);}
    finally{await db.close();}
  }
});
test('server draft validation rejects unknown color photos and external image hosts',async()=>{
  const db=await setup();
  try{
    await as(db,admin);
    for(const colorPhotos of [{Red:{image:'p-red.jpg',verified:true}},{Navy:{image:'https://attacker.example/p.jpg',verified:true}}]){
      await assert.rejects(db.query('select save_product_draft($1,$2,$3)',[photoProduct.id,{...photoProduct,colorPhotos},0]));
    }
  }finally{await db.close();}
});
test('legacy Colab consent cannot upload or authorize a new Korea server job',async()=>{
  const db=await setup();const path=alice+'/legacy/input.jpg';
  try{
    await db.query('insert into products(id,payload)values($1,$2)',[photoProduct.id,photoProduct]);
    await db.exec('update worker_state set enabled=true,last_seen=now()');
    await as(db,alice);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v1']);
    await assert.rejects(db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',path]),/row-level security/);
    await db.exec('reset role');
    await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',path]);
    await as(db,alice);
    const create=version=>db.query('select create_fit_job($1,$2,$3,$4,$5) as id',['10000000-0000-4000-8000-000000000021',photoProduct.id,'Navy',path,version]);
    await assert.rejects(create('2026-10-01-v1'),/PHOTO_CONSENT_REQUIRED/);
    await assert.rejects(create('2026-10-01-v2'),/PHOTO_CONSENT_REQUIRED/);
    await db.query('update photo_consents set version=$1,accepted_at=now() where owner_id=$2',['2026-10-01-v2',alice]);
    assert.ok((await create('2026-10-01-v2')).rows[0].id);
  }finally{await db.close();}
});
test('Korea worker never claims or completes a legacy processor job',async()=>{
  const db=await setup();const lease='20000000-0000-4000-8000-000000000001';
  try{
    await db.query('insert into products(id,payload)values($1,$2)',[photoProduct.id,photoProduct]);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v1']);
    await db.query(`insert into fitting_jobs(owner_id,request_key,product_id,color,input_path,product_image,consent_version)
      values($1,$2,$3,'Navy',$4,'p-navy.jpg','2026-10-01-v1')`,[alice,'10000000-0000-4000-8000-000000000022',photoProduct.id,alice+'/legacy/input.jpg']);
    await db.exec('update worker_state set enabled=true,last_seen=now()');
    await as(db,'','service_role');
    assert.equal((await db.query('select * from worker_claim()')).rows.length,0);
    assert.equal((await db.query('select status from fitting_jobs')).rows[0].status,'cancelled');
    const job=(await db.query(`insert into fitting_jobs(owner_id,request_key,product_id,color,input_path,product_image,consent_version,status,lease,started_at)
      values($1,$2,$3,'Navy',$4,'p-navy.jpg','2026-10-01-v1','running',$5,now()) returning id`,[alice,'10000000-0000-4000-8000-000000000023',photoProduct.id,alice+'/legacy/input.jpg',lease])).rows[0];
    assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[job.id,lease,alice+'/legacy/output.jpg'])).rows[0].accepted,false);
  }finally{await db.close();}
});
test('processor migration keeps historical consent and results while cancelling legacy leases and closing intake',async()=>{
  const db=await setup({serverConsent:false});const lease='20000000-0000-4000-8000-000000000002';
  try{
    await db.query('insert into products(id,payload)values($1,$2)',[photoProduct.id,photoProduct]);
    await db.query('insert into photo_consents(owner_id,version)values($1,$2)',[alice,'2026-10-01-v1']);
    for(const [key,state,result] of [['24','running',null],['25','completed',alice+'/legacy/output.jpg']]){
      await db.query(`insert into fitting_jobs(owner_id,request_key,product_id,color,input_path,product_image,consent_version,status,lease,output_path)
        values($1,$2,$3,'Navy',$4,'p-navy.jpg','2026-10-01-v1',$5,$6,$7)`,[alice,'10000000-0000-4000-8000-0000000000'+key,photoProduct.id,alice+'/legacy/input.jpg',state,state==='running'?lease:null,result]);
    }
    await db.exec('update worker_state set enabled=true,last_seen=now()');
    await db.exec(await readFile(new URL('../supabase/migrations/005_korea_gpu_consent.sql',import.meta.url),'utf8'));
    assert.equal((await db.query('select version from photo_consents')).rows[0].version,'2026-10-01-v1');
    const rows=(await db.query('select status,lease,output_path from fitting_jobs order by request_key')).rows;
    assert.deepEqual(rows,[{status:'cancelled',lease:null,output_path:null},{status:'completed',lease:null,output_path:alice+'/legacy/output.jpg'}]);
    assert.equal((await db.query('select fitting_status() as status')).rows[0].status.available,false);
    await as(db,alice);
    await assert.rejects(db.query('select worker_claim()'),/permission denied/);
    await assert.rejects(db.query('select worker_finish($1,$2,$3)',['00000000-0000-4000-8000-000000000099',lease,alice+'/legacy/output.jpg']),/permission denied/);
  }finally{await db.close();}
});
test('a current Korea consent permits the leased worker result and its owner can read it',async()=>{
  const db=await setup();
  try{
    const create=await preparePhotoJob(db);await create();
    await as(db,'','service_role');
    const job=(await db.query('select * from worker_claim()')).rows[0];
    const path=alice+'/color-test/output.jpg';
    assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[job.id,job.lease,path])).rows[0].accepted,true);
    await as(db,alice);
    assert.deepEqual((await db.query('select status,output_path from fitting_jobs')).rows,[{status:'completed',output_path:path}]);
  }finally{await db.close();}
});
