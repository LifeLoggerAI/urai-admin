'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const file=path.resolve(__dirname,'../src/institutionalMissionCredentialAuthority.ts');
const m=new Module(file,module);
m.filename=file;
m.paths=Module._nodeModulePaths(path.dirname(file));
m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,file);
const {createGoogleMissionCredentialVerifier,isApprovedMissionCredentialVerifier}=m.exports;
let pass=0;
function check(name,fn){fn();pass++;console.log('PASS',name);}
const base={audience:'https://mission.example.invalid',tenant:'tenant-test',accounts:[{
 subject:'123456789012345678901',email:'mission-worker@project.iam.gserviceaccount.com',
 actorId:'worker_alpha',role:'WORKER',taskIds:['task_alpha']
}]};
check('arbitrary function is never approved',()=>assert.equal(isApprovedMissionCredentialVerifier(async()=>({})),false));
check('valid identity inspector is not granted runtime approval',()=>{
 const f=createGoogleMissionCredentialVerifier(base);assert.equal(isApprovedMissionCredentialVerifier(f),false);
});
check('reject missing workload mapping',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[]}),/DENY/));
check('reject duplicate signed subject',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[base.accounts[0],{...base.accounts[0],actorId:'worker_beta',email:'mission-beta@project.iam.gserviceaccount.com'}]}),/DENY/));
check('reject duplicate effective actor identity',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[base.accounts[0],{...base.accounts[0],subject:'123456789012345678902',email:'mission-beta@project.iam.gserviceaccount.com'}]}),/DENY/));
check('reject untrusted personal email',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[{...base.accounts[0],email:'person@gmail.com'}]}),/DENY/));
check('reject unbounded task list',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[{...base.accounts[0],taskIds:Array.from({length:17},(_,i)=>'task_'+i+'a')}]}),/DENY/));
check('reject malformed actor',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[{...base.accounts[0],actorId:'owner/bad'}]}),/DENY/));
check('reject duplicate task IDs',()=>assert.throws(()=>createGoogleMissionCredentialVerifier({...base,accounts:[{...base.accounts[0],taskIds:['task_alpha','task_alpha']}]}),/DENY/));
(async()=>{
 const f=createGoogleMissionCredentialVerifier(base);
 for(const token of ['','bad','eyJhbGciOiJub25lIn0.e30.','x'.repeat(250)]){
  await assert.rejects(f(token),/DENY/);pass++;console.log('PASS rejects malformed or unsigned token length');
 }
 console.log('R1495_GOOGLE_IDENTITY_REVIEW',JSON.stringify({checks:pass,passed:pass,verifiedGoogleServiceAccountToken:false,productionRuntimeEnabled:false,independentSecurityApproved:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
