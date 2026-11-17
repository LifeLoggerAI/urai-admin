const assert=require('node:assert/strict'),fs=require('node:fs'),{createRequire}=require('node:module');
const req=createRequire(require('node:path').resolve(__dirname,'../package.json'));
const ts=req('typescript'),file=require('node:path').resolve(__dirname,'../src/institutionalMissionCoordination.ts');
const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText)(
  n=>n==='firebase-admin/firestore'?{FieldValue:{serverTimestamp:()=>null}}:req(n),m,m.exports);
const data={workerId:'worker_alpha',status:'ACTIVE',taskClasses:['SOURCE_AUDIT']};
const task={taskId:'r1466_revoked_claim',taskClass:'SOURCE_AUDIT',state:'READY',leaseEpoch:0,dependencyIds:[]};
let authorized=true,initialPermitResolve;const initialPermit=new Promise(r=>initialPermitResolve=r);
let entryResolve;const entry=new Promise(r=>entryResolve=r);let startTx;const proceed=new Promise(r=>startTx=r);
let permitCount=0,transactionWrites=0;
const db={collection(name){return{doc(id){return{path:name+'/'+id}}}},async runTransaction(fn){
 entryResolve();await proceed;return fn({get:async ref=>({exists:true,data:()=>ref.path.includes('Workers')?data:task,readTime:{toMillis:()=>1794905500000}}),
 update:()=>{transactionWrites++},set:()=>{transactionWrites++}})}};
const store=new m.exports.InstitutionalMissionCoordination(db,async()=>{permitCount++; if(permitCount===1)initialPermitResolve();return authorized});
(async()=>{
 const work=store.claimTask('worker_alpha','r1466_revoked_claim',10);
 await initialPermit;await entry;
 authorized=false;startTx();
 await assert.rejects(work,/DENY/);
 assert.equal(transactionWrites,0);
 console.log('PASS transaction admission rechecks revoked identity',{permitCount,transactionWrites});
})().catch(e=>{console.error(e.stack);process.exitCode=2});
