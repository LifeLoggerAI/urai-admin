import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFounderDeliveryInbox, projectMissionDelivery } from './founder-delivery-inbox.mjs';

const A = 'a'.repeat(40), B = 'b'.repeat(64);
const url = 'https://github.com/LifeLoggerAI/urai-labs-llc/blob/' + A + '/docs/benchmarks/k9.drat';
const task = { taskId: 'r1653_example', taskClass:'RESEARCH_REVIEW',
  state: 'ACCEPTED', sourceRevision: A, evidenceDigest:B,
  evidenceSubmittedBy:'worker_alpha', evidenceUrl:url, verifiedBy:'worker_reviewer' };
const execution = { taskId:task.taskId, leaseEpoch:1, workerId:'worker_alpha',
  sourceRevision:A, sha256:B, evidenceUrl:url };
const verification = { taskId:task.taskId, reviewerId:'worker_reviewer',
  expectedRevision:A, expectedDigest:B, result:'PASS', externalCertification:false };
const projected = (t=task,e=execution,v=verification) =>
  projectMissionDelivery(t,e,v);

test('complete exact-source receipts produce a verified pointer, never final delivery',()=>{
  const x=projected();
  assert.equal(x.status,'VERIFIED_POINTER');
  assert.equal(x.founderAcknowledged,false);
  assert.equal(x.artifactBytesVerified,false);
  assert.equal(x.evidenceUrl,url);
});
test('not all running or accepted-looking tasks produce delivery',()=>{
  for(const state of ['READY','CLAIMED']) assert.equal(projected({...task,state}).status,'NOT_DELIVERED');
  assert.equal(projected({...task,state:'VERIFYING'}).status,'PENDING_INDEPENDENT_REVIEW');
  assert.equal(projected({...task,state:'BLOCKED'}).status,'BLOCKED');
});
test('missing or mismatched execution receipts fail closed',()=>{
  assert.equal(projected(task,null).status,'EVIDENCE_INVALID');
  assert.equal(projected(task,{...execution,workerId:'worker_wrong'}).status,'EVIDENCE_INVALID');
  assert.equal(projected(task,{...execution,sha256:'c'.repeat(64)}).status,'EVIDENCE_INVALID');
  assert.equal(projected(task,{...execution,sourceRevision:'d'.repeat(40)}).status,'EVIDENCE_INVALID');
  assert.equal(projected(task,{...execution,leaseEpoch:0}).status,'EVIDENCE_INVALID');
  assert.equal(projected(task,{...execution,taskId:'different_task'}).status,'EVIDENCE_INVALID');
});
test('untrusted, ambiguous and credentialed URLs are denied',()=>{
  const urls=[
    'http://github.com/x/y/blob/main/z','https://evil.example/x/y/blob/z',
    'https://user:password@github.com/x/y/blob/main/z',
    'https://github.com/x/y/blob/main/z?token=secret',
    'https://github.com/x/y/blob/main/z#fragment',
    'https://github.com/x/y/blob/main/%2e%2e/z',
    'https://github.com/x/y/blob/main/%2Fetc',
    'https://github.com/x/y/settings/secrets',
    'https://docs.google.com/evil/path',
    'file:///tmp/proof', 'https://github.com.evil.example/x/y/blob/z'
  ];
  for(const u of urls) assert.equal(projected({...task,evidenceUrl:u},{...execution,evidenceUrl:u}).status,'EVIDENCE_INVALID',u);
});
test('verification cannot be self-approved or forged',()=>{
  assert.equal(projected(task,execution,null).status,'VERIFICATION_INVALID');
  assert.equal(projected(task,execution,{...verification,reviewerId:'worker_alpha'}).status,'VERIFICATION_INVALID');
  assert.equal(projected(task,execution,{...verification,result:'FAIL'}).status,'VERIFICATION_INVALID');
  assert.equal(projected(task,execution,{...verification,expectedDigest:'c'.repeat(64)}).status,'VERIFICATION_INVALID');
  assert.equal(projected(task,execution,{...verification,externalCertification:true}).status,'VERIFICATION_INVALID');
  assert.equal(projected({...task,verifiedBy:'worker_other'}).status,'VERIFICATION_INVALID');
});
test('rejects malformed tasks and duplicate IDs',()=>{
  assert.throws(()=>projected({...task,sourceRevision:'main'}),/DENY/);
  assert.throws(()=>projected({...task,taskId:'../secret'}),/DENY/);
  assert.throws(()=>buildFounderDeliveryInbox([{},{}]),/DENY/);
  assert.throws(()=>buildFounderDeliveryInbox([{task,execution,verification},{task,execution,verification}]),/duplicate/);
});
test('projection deterministic independent of task ordering, no auto dispatch',()=>{
  const nextTask={...task,taskId:'r1653_other',state:'READY'};
  const rows=[{task,execution,verification},{task:nextTask}];
  const a=buildFounderDeliveryInbox(rows), b=buildFounderDeliveryInbox([...rows].reverse());
  assert.deepEqual(a,b);
  assert.equal(a.counts.VERIFIED_POINTER,1);
  assert.equal(a.counts.NOT_DELIVERED,1);
  assert.equal(a.automaticallyDispatches,false);
  assert.equal(a.privateMemoryWrites,'DISABLED');
  assert.equal(a.releaseGate,'HOLD_NO_GO');
});
test('empty inbox is safe and has stable hash',()=>{
  const a=buildFounderDeliveryInbox([]);
  assert.deepEqual(a.items,[]);
  assert.match(a.projectionSha256,/^[a-f0-9]{64}$/);
});
