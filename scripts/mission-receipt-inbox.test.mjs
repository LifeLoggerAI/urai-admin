import test from 'node:test';
import assert from 'node:assert/strict';
import {readAuthorizedFounderTask} from './mission-receipt-inbox.mjs';
const sha='a'.repeat(40),digest='b'.repeat(64);
const taskId='task_alpha',actorId='worker_reviewer';
const url='https://github.com/LifeLoggerAI/urai-admin/blob/'+sha+'/docs/item.md';
const task={taskId,state:'ACCEPTED',sourceRevision:sha,taskClass:'SOURCE_AUDIT',
 evidenceDigest:digest,evidenceSubmittedBy:'worker_alpha',evidenceUrl:url,verifiedBy:'worker_reviewer'};
const execution={taskId,leaseEpoch:1,workerId:'worker_alpha',sourceRevision:sha,sha256:digest,evidenceUrl:url};
const verification={taskId,result:'PASS',reviewerId:'worker_reviewer',expectedRevision:sha,expectedDigest:digest,externalCertification:false};
const accepted={task,execution,verification};
test('only exact reviewed store read method is used, not collection scans',async()=>{
 const calls=[];
 const store={readTaskWithReceipts:async(a,b)=>{calls.push([a,b]);return accepted;},
  readTask:()=>{throw Error('readTask called')},collection:()=>{throw Error('collection scan')}};
 const r=await readAuthorizedFounderTask(store,actorId,taskId);
 assert.deepEqual(calls,[[actorId,taskId]]);
 assert.equal(r.status,'VERIFIED_POINTER');
 assert.equal(r.evidenceUrl,url);
 assert.equal(r.artifactBytesVerified,false);
 assert.equal(r.founderAcknowledged,false);
 assert.equal(r.automaticallyDispatches,false);
});
test('unreviewed tasks cannot become reviewed or delivered',async()=>{
 const store={readTaskWithReceipts:async()=>({...accepted,task:{...task,state:'VERIFYING'}})};
 const r=await readAuthorizedFounderTask(store,actorId,taskId);
 assert.equal(r.status,'PENDING_INDEPENDENT_REVIEW');
 assert.equal(r.founderAcknowledged,false);
});
test('store authorization failures propagate rather than being ignored',async()=>{
 const store={readTaskWithReceipts:async()=>{throw Error('DENY: revoked READ grant')}};
 await assert.rejects(readAuthorizedFounderTask(store,actorId,taskId),/DENY: revoked/);
});
test('missing trusted receipt method, bad actor and mismatched task fail',async()=>{
 await assert.rejects(readAuthorizedFounderTask({},actorId,taskId),/DENY/);
 await assert.rejects(readAuthorizedFounderTask({readTaskWithReceipts(){}},'../admin',taskId),/DENY/);
 const forged={readTaskWithReceipts:async()=>({...accepted,task:{...task,taskId:'task_other'}})};
 await assert.rejects(readAuthorizedFounderTask(forged,actorId,taskId),/DENY/);
});
test('invalid evidence and self approval cannot promote pointer',async()=>{
 const bad={...accepted,verification:{...verification,reviewerId:'worker_alpha'}};
 const r=await readAuthorizedFounderTask({readTaskWithReceipts:async()=>bad},actorId,taskId);
 assert.equal(r.status,'VERIFICATION_INVALID');
 assert.equal(r.evidenceUrl,url);
 assert.equal(r.founderAcknowledged,false);
});
