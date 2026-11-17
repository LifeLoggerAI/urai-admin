const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../src');
const req=createRequire(path.resolve(__dirname,'../package.json'));
const ts=req('typescript');
const transpile=f=>ts.transpileModule(fs.readFileSync(path.join(root,f),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021,esModuleInterop:true}}).outputText;
const coord={exports:{}};
new Function('require','module','exports',transpile('institutionalMissionCoordination.ts'))(
  id=>id==='firebase-admin/firestore'?{FieldValue:{serverTimestamp:()=>null}}:req(id),coord,coord.exports);
const boundary={exports:{}};
new Function('require','module','exports',transpile('institutionalMissionCallerBoundary.ts'))(
  id=>id==='./institutionalMissionCoordination'?coord.exports:req(id),boundary,boundary.exports);
const {createMissionSession}=boundary.exports;
let now=1730000000000,checks=0,reads=0,verificationCalls=0,transactionCalls=0;
const principal={subject:'worker_alpha',issuer:'fixture-issuer',audience:'mission-ops',
 tenant:'synthetic_research',role:'WORKER',issuedAtMs:now-1000,
 notBeforeMs:now-1000,expiresAtMs:now+20000,taskIds:['task_safe']};
let current={...principal};
const db={collection:()=>({doc:task=>({
 get:async()=>{reads++;return {exists:true,data:()=>({taskId:task,state:'READY'})}},
 })}),runTransaction:async()=>{transactionCalls++;throw Error('unexpected transaction')}};
const opts=()=>({db,credential:'opaque-test',issuer:principal.issuer,
 audience:principal.audience,tenant:principal.tenant,now:()=>now,
 verifyCredential:async credential=>{verificationCalls++;return credential==='opaque-test'?current:null}});
async function pass(n,f){await f();checks++;console.log('PASS',checks,n)}
async function deny(n,f){await assert.rejects(f,/DENY/);checks++;console.log('PASS',checks,n)}
(async()=>{
 await deny('missing verifier',()=>createMissionSession({...opts(),verifyCredential:null}));
 await deny('invalid credential',()=>createMissionSession({...opts(),credential:'other'}));
 await deny('wrong issuer',()=>createMissionSession({...opts(),issuer:'impostor'}));
 await deny('wrong audience',()=>createMissionSession({...opts(),audience:'wrong'}));
 await deny('wrong tenant',()=>createMissionSession({...opts(),tenant:'other'}));
 await pass('valid worker binds actorId',async()=>{const session=await createMissionSession(opts());assert.equal(session.principalId,'worker_alpha')});

let session=await createMissionSession(opts());
await pass('authorized source read',async()=>{let t=await session.readTask('task_safe');assert.equal(t.taskId,'task_safe')});
await deny('wrong task ID denied',()=>session.readTask('task_other'));
await deny('worker cannot verify',()=>session.verifyEvidence('task_safe','a'.repeat(40),'b'.repeat(64),'PASS'));
assert.equal(transactionCalls,0);
await deny('missing READ scope',async()=>{current={...principal,role:'WORKER',taskIds:['task_other']};await session.readTask('task_safe')});
current={...principal};
await pass('valid session after role restoration',async()=>assert.equal((await session.readTask('task_safe')).taskId,'task_safe'));
current={...principal,subject:'worker_beta'};
await deny('principal swap denied after session',()=>session.readTask('task_safe'));
current={...principal,role:'REVIEWER'};
await deny('role switch loses worker capability',()=>session.claimTask('task_safe',10));
current={...principal,issuedAtMs:principal.issuedAtMs,expiresAtMs:now-10};
await deny('expiry after session setup',()=>session.readTask('task_safe'));
current={...principal,notBeforeMs:now+10};
await deny('not before after setup',()=>session.readTask('task_safe'));
current={...principal,issuedAtMs:now+10};
await deny('future issued after setup',()=>session.readTask('task_safe'));
current={...principal,expiresAtMs:now+3600001};
await deny('excess lifetime after setup',()=>session.readTask('task_safe'));

current={...principal,taskIds:['task_safe','task_safe']};
await deny('duplicate task grants',()=>session.readTask('task_safe'));
current={...principal,taskIds:[]};
await deny('empty task scope',()=>session.readTask('task_safe'));
current={...principal,taskIds:['../bad']};
await deny('path-like task scope',()=>session.readTask('task_safe'));
current={...principal};
const reviewer=await createMissionSession({...opts(),verifyCredential:async()=>({...principal,role:'REVIEWER',subject:'worker_validator'})});
await deny('reviewer cannot claim worker task',()=>reviewer.claimTask('task_safe',10));
await pass('reviewer may read permitted metadata',async()=>assert.equal((await reviewer.readTask('task_safe')).taskId,'task_safe'));
current={...principal};let toggled=false;
const revocable=await createMissionSession({...opts(),verifyCredential:async()=>toggled?null:principal});
toggled=true;
await deny('revoked credential denied on next call',()=>revocable.readTask('task_safe'));
assert.equal(transactionCalls,0);
console.log('RESULT',JSON.stringify({checks,passed:checks,reads,verificationCalls,transactions:transactionCalls,realProviderIam:false,realHostedFirestore:false}));
})().catch(e=>{console.error(e.stack);process.exitCode=2});

