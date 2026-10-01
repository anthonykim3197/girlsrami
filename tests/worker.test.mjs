import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler,tokenDigest,productUrl} from '../supabase/functions/fitting-worker/handler.mjs';
test('an unauthorized GPU caller never reaches private storage',async()=>{
  const handler=createHandler({repository:{claim(){throw new Error('Must not reach private data');}},tokenHash:await tokenDigest('example-private-worker-token-32-chars'),projectUrl:'https://example.supabase.co',log(){throw new Error('No error expected');}});
  const r=await handler(new Request('https://example.supabase.co/functions/v1/fitting-worker',{method:'POST',body:JSON.stringify({action:'claim'})}));
  assert.equal(r.status,401);
  assert.equal((await r.json()).error,'UNAUTHORIZED');
});
test('worker cannot fetch arbitrary URLs or send non-JPEG data to storage',async()=>{
  assert.throws(()=>productUrl('http://127.0.0.1/secrets','https://example.supabase.co'));
  assert.throws(()=>productUrl('https://attacker.example/image.jpg','https://example.supabase.co'));
  assert.equal(productUrl('p-knit.jpg','https://example.supabase.co'),'https://girlslami.com/p-knit.jpg');
  const token='example-private-worker-token-32-chars';
  const handler=createHandler({repository:{currentLease:async()=>({id:'00000000-0000-4000-8000-000000000001',owner_id:'owner'}),uploadResult(){throw new Error('Do not store HTML');}},tokenHash:await tokenDigest(token),projectUrl:'https://example.supabase.co',log(){throw new Error('No error expected');}});
  const r=await handler(new Request('https://example.supabase.co/functions/v1/fitting-worker',{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify({action:'complete',id:'00000000-0000-4000-8000-000000000001',lease:'00000000-0000-4000-8000-000000000002',image:btoa('<script>bad</script>')})}));
  assert.equal(r.status,400);assert.equal((await r.json()).error,'JPEG_REQUIRED');
});

const workerToken='example-private-worker-token-32-chars';
const jobId='00000000-0000-4000-8000-000000000001';
const leaseId='00000000-0000-4000-8000-000000000002';
async function workerRequest(repository,payload){
  const handler=createHandler({repository,tokenHash:await tokenDigest(workerToken),projectUrl:'https://example.supabase.co',log(){}});
  return handler(new Request('https://example.supabase.co/functions/v1/fitting-worker',{
    method:'POST',headers:{Authorization:'Bearer '+workerToken},body:JSON.stringify(payload)
  }));
}
test('GPU authentication preflight does not claim a member job or mark the engine ready',async()=>{
  const response=await workerRequest({status:async()=>({enabled:false}),claim(){throw new Error('Preflight must not take a job');}}, {action:'status'});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{enabled:false});
});
test('a generation failure releases the current lease without uploading an image',async()=>{
  let failure;
  const response=await workerRequest({finish:async(id,lease,path,code)=>{
    failure={id,lease,path,code};return true;
  },uploadResult(){throw new Error('A failed job has no image');}}, {action:'fail',id:jobId,lease:leaseId,code:'INFERENCE_FAILED'});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{accepted:true});
  assert.deepEqual(failure,{id:jobId,lease:leaseId,path:null,code:'INFERENCE_FAILED'});
});
test('a cancelled lease stays cancelled when GPU failure arrives late',async()=>{
  const response=await workerRequest({finish:async()=>false}, {action:'fail',id:jobId,lease:leaseId,code:'IMAGE_FETCH_FAILED'});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{accepted:false});
});
test('failure messages cannot store photo URLs, credentials or arbitrary exception text',async()=>{
  const response=await workerRequest({finish(){throw new Error('Rejected failure must not reach storage');}}, {action:'fail',id:jobId,lease:leaseId,code:'https://private.example/photo?token=secret'});
  assert.equal(response.status,400);
  assert.deepEqual(await response.json(),{error:'INVALID_FAILURE'});
});
