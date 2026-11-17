'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{createRequire}=require('node:module'),tsModule=require('node:module');
const root='/tmp/urai-r1466-final-exact-8ffc/functions',req=createRequire(root+'/package.json'),ts=req('typescript');
const source=fs.readFileSync('/tmp/urai-r20261117-10-tx-emulator/new/institutionalMissionCoordination.ts','utf8');
const m={exports:{}};
new Function('require','module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText)(req,m,m.exports);
const {FieldValue}=req('firebase-admin/firestore'),{initializeApp}=req('firebase-admin/app'),{getFirestore}=req('firebase-admin/firestore');
const projectId='urai-r20261117-process-loss-local';
initializeApp({projectId});
const db=getFirestore();db.settings({ignoreUndefinedProperties:true});
const action=process.argv[2],worker=process.argv[3],workdir=__dirname,taskId='r20261117_realtime_crash_task',poisonId='r20261117_realtime_unused_task';
const revision='8ffc5f810396e483ce53358e7d0922c1e78b541f',url='https://github.com/LifeLoggerAI/urai-admin/pull/114',sha='e'.repeat(64);
const can=async({actorId,action:act})=>{
 if(actorId==='admin_principal')return ['REGISTER','CREATE','READ'].includes(act);
 if(actorId==='reviewer_zeta')return ['VERIFY','READ'].includes(act);
 if(actorId==='worker_alpha'||actorId==='worker_beta')return ['CLAIM','HEARTBEAT','SUBMIT_EVIDENCE','READ'].includes(act);
 return false;
};
const coord=new m.exports.InstitutionalMissionCoordination(db,can);
const ready=()=>fs.writeFileSync(workdir+'/ready_'+worker,process.pid.toString());
const write=(name,obj)=>fs.writeFileSync(workdir+'/'+name+'.json',JSON.stringify(obj,null,2)+'\n');
const state=async id=>(await db.collection('institutionalMissionTasks').doc(id).get()).data();
const receipt=async (id,name)=>(await db.collection('institutionalMissionTasks').doc(id).collection('receipts').doc(name).get()).data();
const forceExpire=async id=>{const ref=db.collection('institutionalMissionTasks').doc(id);await db.runTransaction(async tx=>{const a=await tx.get(ref);assert.equal(a.data().state,'CLAIMED');tx.update(ref,{leaseExpiresAtMs:1,updatedAt:FieldValue.serverTimestamp()});});};
async function main(){
 let res;
 if(action==='setup'){
   await coord.registerWorker('admin_principal','worker_alpha',['SOURCE_AUDIT']);
   await coord.registerWorker('admin_principal','worker_beta',['SOURCE_AUDIT']);
   await coord.registerWorker('admin_principal','reviewer_zeta',['SECURITY_REVIEW']);
   for(const [id,suffix] of [[taskId,'main'],[poisonId,'poison']]){
     await coord.registerTask('admin_principal',{taskId:id,sourceRevision:revision,sourceUrl:url,taskClass:'SOURCE_AUDIT',dependencyIds:[],dedupeKey:'r20261117_realtime_'+suffix});
   }
   res={action,created:2};
 }else if(action==='claim'){
   ready();
   while(!fs.existsSync(workdir+'/go')) await new Promise(r=>setTimeout(r,25));
   let claim=await coord.claimTask(worker,taskId,10);
   res={action,worker,claim:claim||null};
 }else if(action==='recover'){
   const old=await state(taskId);
   assert.equal(old.leaseEpoch,1);
   // Real wall-time expiry test: DO NOT force expiry.
   const claim=await coord.claimTask(worker,taskId,10);
   assert.equal(claim?.leaseEpoch,2);
   res={action,worker,claim,oldWorker:old.leaseOwner};
 }else if(action==='stale'){
   const a=await coord.heartbeat(worker,taskId,1,30);
   const b=await coord.submitEvidence(worker,taskId,1,url,sha);
   assert.equal(a,false);assert.equal(b,false);
   res={action,worker,heartbeat:a,evidence:b};
 }else if(action==='submit'){
   const ret=await coord.submitEvidence(worker,taskId,2,url,sha);
   assert.equal(ret,true);
   const t=await state(taskId);
   assert.equal(t.state,'VERIFYING');
   assert.equal(t.leaseEpoch,2);
   const r=await receipt(taskId,'execution');
   assert.equal(r.sha256,sha);
   res={action,worker,accepted:ret,taskState:t.state,receiptPresent:!!r};
 }else if(action==='review'){
   const ret=await coord.verifyEvidence('reviewer_zeta',taskId,revision,sha,'PASS');
   assert.equal(ret.state,'ACCEPTED');
   const r=await receipt(taskId,'verification');
   assert.equal(r.reviewerId,'reviewer_zeta');
   assert.equal(r.externalCertification,false);
   res={action,reviewer:'reviewer_zeta',result:ret,receiptPresent:!!r,externalCertification:r.externalCertification};
 }else if(action==='poison'){
   const seen=[];
   for(let epoch=1;epoch<=3;epoch++){
     const claim=await coord.claimTask('worker_alpha',poisonId,30);
     assert.equal(claim?.leaseEpoch,epoch);
     seen.push(epoch);
     await forceExpire(poisonId);
   }
   const last=await coord.claimTask('worker_beta',poisonId,30);
   assert.equal(last,null);
   const t=await state(poisonId),r=await receipt(poisonId,'poison');
   assert.equal(t.state,'BLOCKED');assert.equal(r.reason,'LEASE_RETRY_LIMIT');
   res={action,epochs:seen,fourthClaim:last,taskState:t.state,poisonReceipt:!!r,reason:r.reason};
 }else if(action==='inspect'){
   const a=await state(taskId),b=await state(poisonId);
   assert.equal(a.state,'ACCEPTED');assert.equal(a.leaseEpoch,2);
   assert.equal(b.state,'BLOCKED');
   res={action,taskState:a.state,taskEpoch:a.leaseEpoch,taskReviewer:a.verifiedBy,poisonState:b.state};
 }else throw new Error('invalid action');
 console.log(JSON.stringify(res));
 write('result_'+action+(worker?'_'+worker:''),res);
 if(action==='claim' && worker==='worker_alpha' && process.env.HOLD_CLAIM_OWNER==='1') {
   fs.writeFileSync(workdir+'/owner_process_alive',String(process.pid));
   setInterval(()=>{},1000);
   return;
 }
 process.exit(0);
}
main().catch(e=>{console.error('ERROR',action,worker,e.stack);process.exit(2)});