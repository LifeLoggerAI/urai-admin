import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeFounderCustody } from './founder-custody-manifest.mjs';
const a='a'.repeat(40),sha='b'.repeat(64);
const src='https://app.heygen.com/videos/d230fd9cad6a40969940845112cd8a78';
const archive='https://app.notion.com/p/41ffc25435048191ac88e13356f6b8e3';
const item={id:'heygen:sample_video',kind:'video',name:'Synthetic original video',filename:'sample.mp4',bytes:1024,sha256:sha,
 originalRecordUrl:src,archiveUrl:archive,verificationState:'SOURCE_AND_ARCHIVE_SHA_MATCH',
 verificationMethod:'independent-sample-hashes',verificationWorker:'synthetic-worker',
 humanReview:'PENDING',founderAcknowledged:false};
const manifest={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',deliveryMode:'MANUAL_VERIFIED_CUSTODY',
 automaticallyDispatches:false,productionGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',items:[item]};
const run=x=>summarizeFounderCustody(x);
test('checked video becomes non-delivered metadata summary without private links',()=>{
 const r=run(manifest);assert.equal(r.itemCount,1);assert.equal(r.videoCount,1);
 assert.equal(r.items[0].finalDelivery,'NOT_ACKNOWLEDGED');assert.equal(r.bytesVerifiedByThisScript,false);
 assert.equal(r.automaticallyDispatches,false);assert.equal(r.privateMemoryWrites,'DISABLED');
 assert.ok(!JSON.stringify(r).includes('app.notion.com'));
});
test('schema flags reject false claims of live dispatch and private writes',()=>{
 for(const field of [{automaticallyDispatches:true},{deliveryMode:'AUTOMATIC'},{privateMemoryWrites:'ENABLED'},{productionGate:'GO'}]){
  assert.throws(()=>run({...manifest,...field}),/DENY/);
 }
});
test('reject missing and forged receipts, unsupported links and URL tricks',()=>{
 for(const override of [
  {founderAcknowledged:true},{humanReview:'APPROVED'},{sha256:'no-hash'},
  {bytes:0},{kind:'unknown'},{verificationState:'PRESERVED_SOURCE_WITH_SHA256'},
  {archiveUrl:'https://evil.example/p/foo'},
  {archiveUrl:'https://app.notion.com/p/hello?token=SECRET'},
  {archiveUrl:'https://app.notion.com/p/hello/%2e%2e/p'},
  {archiveUrl:'http://app.notion.com/p/hello'},
  {originalRecordUrl:'https://user:pass@app.heygen.com/videos/example'}
 ]){
  assert.throws(()=>run({...manifest,items:[{...item,...override}]}),/DENY/);
 }
});
test('duplicate IDs and malformed manifests fail closed',()=>{
 assert.throws(()=>run({...manifest,items:[item,item]}),/DENY/);
 for(const x of [null,{},[],{...manifest,items:null}])assert.throws(()=>run(x),/DENY/);
});
test('stable hash independent of input order, no cross-tenant data',()=>{
 const second={...item,id:'heygen:second_video',name:'Second synthetic',sha256:'c'.repeat(64)};
 const x=run({...manifest,items:[item,second]});
 const y=run({...manifest,items:[second,item]});
 assert.deepEqual(x,y);assert.match(x.summarySha256,/^[0-9a-f]{64}$/);
 assert.equal(x.totalBytes,2048);
});
test('bounded input and integer bytes',()=>{
 assert.throws(()=>run({...manifest,items:Array.from({length:501},(_,i)=>({...item,id:'heygen:video_'+i}))}),/DENY/);
 assert.throws(()=>run({...manifest,items:[{...item,bytes:1.5}]}),/DENY/);
});
