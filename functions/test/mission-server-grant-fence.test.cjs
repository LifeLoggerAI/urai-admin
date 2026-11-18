const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const file=require('node:path').resolve(__dirname,'../src/institutionalMissionServerGrantFence.ts');
const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText)(require,m,m.exports);
const now=1794905500000;
const base={schema:'urai-mission-grant-v1',actorId:'worker_alpha',issuer:'issuer',audience:'audience',tenant:'tenant',role:'WORKER',status:'ACTIVE',allowedActions:['CLAIM','HEARTBEAT'],taskIds:['task_alpha'],issuedAtMs:now-1000,notBeforeMs:now-1000,expiresAtMs:now+1000,revokedAtMs:null};
let n=0,reads=0;
const db={collection:c=>{assert.equal(c,'institutionalMissionGrants');return{doc:id=>{assert.equal(id,'worker_alpha');return {path:c+'/'+id}}}}};
const fence=m.exports.createServerOwnedMissionGrantFence(db,{issuer:'issuer',audience:'audience',tenant:'tenant'});
function tx(g,exists=true,time=now){return{get:async()=>{reads++;return{exists,data:()=>g,readTime:{toMillis:()=>time}}}}}
async function good(label,g=base,a='CLAIM',task='task_alpha'){await fence(tx(g),{actorId:'worker_alpha',action:a,taskId:task});n++;console.log('PASS',label)}
async function bad(label,g=base,a='CLAIM',task='task_alpha',exists=true,time=now){await assert.rejects(fence(tx(g,exists,time),{actorId:'worker_alpha',action:a,taskId:task}),/DENY/);n++;console.log('PASS DENY',label)}
(async()=>{
await good('authorized claim');
await good('authorized heartbeat',base,'HEARTBEAT');
await good('authorized read',{...base,allowedActions:['READ','CLAIM','HEARTBEAT']},'READ');
await bad('missing',undefined,'CLAIM','task_alpha',false);
await bad('revoked status',{...base,status:'REVOKED'});
await bad('revokedAt',{...base,revokedAtMs:now-1});
await bad('expired',{...base,expiresAtMs:now});
await bad('future',{...base,notBeforeMs:now+1});
await bad('wrong actor',{...base,actorId:'other_actor'});
await bad('wrong issuer',{...base,issuer:'else'});
await bad('wrong audience',{...base,audience:'else'});
await bad('wrong tenant',{...base,tenant:'else'});
await bad('wrong task',base,'CLAIM','task_other');
await bad('wrong role',{...base,role:'REVIEWER'});
await bad('wrong action',base,'VERIFY');
await bad('duplicate action',{...base,allowedActions:['CLAIM','CLAIM']});
await bad('duplicate task',{...base,taskIds:['task_alpha','task_alpha']});
await bad('overlong',{...base,expiresAtMs:now+4000000});
await bad('missing read time',base,'CLAIM','task_alpha',true,0);
await bad('unknown field',{...base,elevated:true});
await bad('wrong schema',{...base,schema:'legacy'});
await bad('missing revoked marker',Object.fromEntries(Object.entries(base).filter(([k])=>k!=='revokedAtMs')));
await assert.rejects(fence(tx(base),{actorId:'worker_alpha',action:'CLAIM'}),/DENY/);n++;console.log('PASS DENY unscoped mutation');
await good('controller register',{...base,role:'OPERATOR',allowedActions:['REGISTER','CREATE']},'REGISTER',undefined);
console.log('RESULT',JSON.stringify({checks:n,reads,simulated:true,hostedFirestore:false,providerIAM:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
