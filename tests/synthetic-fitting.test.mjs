import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
const owner='00000000-0000-4000-8000-000000000001';
const other='00000000-0000-4000-8000-000000000002';
const input=owner+'/synthetic-test/input.png';
async function as(db,id,role='authenticated'){
  await db.exec(`reset role;set role ${role};set request.jwt.claim.sub='${id}';`);
}
async function setup(){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;
    create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text,created_at timestamptz default now());
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon,authenticated,service_role;grant select,insert,delete on storage.objects to authenticated;
    grant all on storage.objects to service_role;
    create function storage.foldername(text) returns text[] language sql as $$select string_to_array($1,'/')$$;
    insert into auth.users values ('${owner}'),('${other}');
    alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
    alter default privileges in schema public grant execute on functions to anon,authenticated,service_role;`);
  for(const file of ['001_core.sql','002_fitting.sql','004_color_photos.sql','005_korea_gpu_consent.sql','007_synthetic_fitting.sql']){
    await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
  }
  await db.query('insert into products(id,payload)values($1,$2)',['qa-knit',{
    id:'qa-knit',name:'AI 시험 니트',price:0,stock:0,image:'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/qa-knit.png',
    colors:['Green'],colorPhotos:{Green:{image:'https://rlbffhmdonbzifiivbfl.supabase.co/storage/v1/object/public/catalog/qa-knit.png',verified:false}},
    sizes:[{label:'시험',chestHalf:null,length:null,verified:false}],status:'hidden',photoVerified:false,storeUrl:'',syntheticTest:true
  }]);
  await db.query('insert into fitting_test_sessions(owner_id,product_id,color,input_path,expires_at)values($1,$2,$3,$4,now()+interval \'2 hours\')',[owner,'qa-knit','Green',input]);
  await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',input]);
  return db;
}
const create=(db,n)=>db.query('select create_fitting_test_job($1) as id',['10000000-0000-4000-8000-00000000000'+n]);
test('synthetic session is private, cannot be self-provisioned, and keeps production disabled',async()=>{
  const db=await setup();
  try{
    await as(db,other);
    assert.equal((await db.query('select * from fitting_test_sessions')).rows.length,0);
    await assert.rejects(create(db,1),/TEST_SESSION_UNAVAILABLE/);
    await assert.rejects(db.query('insert into fitting_test_sessions(owner_id,product_id,color,input_path,expires_at)values($1,$2,$3,$4,now())',[other,'qa-knit','Green',other+'/x.png']),/permission denied/);
    await assert.rejects(db.query('select * from worker_test_claim()'),/permission denied/);
    await as(db,owner);
    const id=(await create(db,1)).rows[0].id;
    assert.equal((await create(db,1)).rows[0].id,id);
    assert.equal((await db.query('select * from photo_consents')).rows.length,0);
    await as(db,'','service_role');
    assert.deepEqual((await db.query('select worker_test_status() as state')).rows[0].state,{enabled:true,photo_intake_enabled:false});
    assert.equal((await db.query('select * from worker_claim()')).rows.length,0);
    await db.query('update worker_state set enabled=true');
    assert.equal((await db.query('select * from worker_claim()')).rows.length,0);
    assert.equal((await db.query('select status from fitting_jobs where id=$1',[id])).rows[0].status,'queued');
    const job=(await db.query('select * from worker_test_claim()')).rows[0];
    assert.equal(job.id,id);
    assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[id,job.lease,owner+'/'+id+'/output.jpg'])).rows[0].accepted,true);
    assert.equal((await db.query("select payload->>'photoVerified' as verified from products")).rows[0].verified,'false');
  }finally{await db.close();}
});
test('withdrawal beats completion and deletes only synthetic files and jobs while retaining quotas',async()=>{
  const db=await setup();
  try{
    await as(db,owner);const id=(await create(db,1)).rows[0].id;
    await as(db,'','service_role');const job=(await db.query('select * from worker_test_claim()')).rows[0];
    await db.query('insert into storage.objects(bucket_id,name)values($1,$2)',['fitting-private',owner+'/unrelated/input.jpg']);
    await as(db,owner);
    assert.deepEqual((await db.query('select begin_fitting_test_withdrawal() as paths')).rows[0].paths.sort(),[input,owner+'/'+id+'/output.jpg'].sort());
    await as(db,'','service_role');
    assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[id,job.lease,owner+'/'+id+'/output.jpg'])).rows[0].accepted,false);
    await as(db,owner);await assert.rejects(db.query('select erase_fitting_test_data()'),/REMOVE_IMAGES_FIRST/);
    await db.query('delete from storage.objects where name=$1',[input]);
    await db.query('select erase_fitting_test_data()');
    assert.equal((await db.query('select id from fitting_jobs')).rows.length,0);
    assert.equal((await db.query('select * from fitting_test_sessions')).rows.length,0);
    assert.equal((await db.query('select name from storage.objects')).rows[0].name,owner+'/unrelated/input.jpg');
    await as(db,'','service_role');assert.equal((await db.query('select count(*)::int as n from fitting_usage')).rows[0].n,1);
  }finally{await db.close();}
});
test('expired sessions cannot submit or finish work and cancellation preserves daily limits',async()=>{
  const db=await setup();
  try{
    await as(db,owner);const id=(await create(db,1)).rows[0].id;
    await as(db,'','service_role');const job=(await db.query('select * from worker_test_claim()')).rows[0];
    await db.query('update fitting_test_sessions set expires_at=now()-interval \'1 minute\'');
    assert.equal((await db.query('select worker_finish($1,$2,$3) as accepted',[id,job.lease,owner+'/'+id+'/output.jpg'])).rows[0].accepted,false);
    assert.equal((await db.query('select * from worker_test_claim()')).rows.length,0);
    await as(db,owner);await assert.rejects(create(db,2),/TEST_SESSION_UNAVAILABLE/);
    await as(db,'','service_role');await db.query('update fitting_test_sessions set expires_at=now()+interval \'1 hour\'');
    await as(db,owner);
    for(const n of [2,3]){const key=(await create(db,n)).rows[0].id;await db.query('select cancel_fit_job($1)',[key]);}
    await assert.rejects(create(db,4),/DAILY_LIMIT/);
  }finally{await db.close();}
});
