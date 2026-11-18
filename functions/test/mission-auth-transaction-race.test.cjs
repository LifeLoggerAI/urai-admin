'use strict';
// R1488 deterministic admission/race test with a trusted fence factory,
// using a synthetic DB. NOT a native emulator test or hosted identity proof.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../src'),req=createRequire(path.resolve(__dirname,'../package.json')),ts=req('typescript'),cache={};
function load(name){if(cache[name])return cache[name].exports;const m={exports:{}};cache[name]=m;
 const output=ts.transpileModule(fs.readFileSync(path.join(root,name),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText;
 new Function('require','module','exports',output)(id=>id.startsWith('./')?load(id.slice(2)+'.ts'):req(id),m,m.exports);return m.exports}
const {InstitutionalMissionCoordination}=load('institutionalMissionCoordination.ts');
const {createServerOwnedMissionGrantFence}=load('institutionalMissionServerGrantFence.ts');
const actor='worker_alpha',taskId='r1466_revoked_claim',now=1794905500000;
let authorized=true,firstPermitResolve,beginTxResolve,releaseTx;
const firstPermit=new Promise(r=>firstPermitResolve=r);
const beginTx=new Promise(r=>beginTxResolve=r);
const proceed=new Promise(r=>releaseTx=r);
let permitCalls=0,transactionWrites=0,grantReads=0;
const grant={schema:'urai-mission-grant-v1',actorId:actor,issuer:'issuer',audience:'audience',tenant:'tenant',role:'WORKER',
status:'ACTIVE',allowedActions:['CLAIM'],taskIds:[taskId],issuedAtMs:now-1000,notBeforeMs:now-1000,
expiresAtMs:now+10000,revokedAtMs:null};
const db={collection:n=>({doc:id=>({path:n+'/'+id})}),
 async runTransaction(fn){beginTxResolve();await proceed;return fn({
 get:async ref=>{if(ref.path.startsWith('institutionalMissionGrants/'))grantReads++;
  return {exists:true,data:()=>ref.path.startsWith('institutionalMissionGrants/')?grant:ref.path.startsWith('institutionalMissionWorkers/')?
    {workerId:actor,status:'ACTIVE',taskClasses:['SOURCE_AUDIT']}:
    {taskId,taskClass:'SOURCE_AUDIT',state:'READY',leaseEpoch:0,dependencyIds:[]},
    readTime:{toMillis:()=>now}};},
 update:()=>{transactionWrites++},set:()=>{transactionWrites++}});
 }};
const fence=createServerOwnedMissionGrantFence(db,{issuer:'issuer',audience:'audience',tenant:'tenant'});
const store=new InstitutionalMissionCoordination(db,async()=>{permitCalls++;if(permitCalls===1)firstPermitResolve();return authorized},fence);
(async()=>{const pending=store.claimTask(actor,taskId,10);await firstPermit;await beginTx;authorized=false;releaseTx();
 await assert.rejects(pending,/DENY/);
 assert.equal(transactionWrites,0);
 console.log('PASS R1488 admission revoked before transaction',{permitCalls,transactionWrites,grantReads,simulated:true,providerIAM:false});
})().catch(e=>{console.error(e.stack||e);process.exitCode=2});
