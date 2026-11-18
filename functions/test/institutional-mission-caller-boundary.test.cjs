'use strict';
// R1488 fail-closed replacement for legacy callback-injection assumptions.
// Production workload verification is not integrated. All arbitrary providers
// must be denied, including callbacks returning a plausible principal.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const src=path.resolve(__dirname,'../src'),req=createRequire(path.resolve(__dirname,'../package.json')),ts=req('typescript');
const cache={};
function load(n){if(cache[n])return cache[n].exports;const m={exports:{}};cache[n]=m;const code=ts.transpileModule(fs.readFileSync(path.join(src,n),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText;
new Function('require','module','exports',code)((id)=>id.startsWith('./')?load(id.slice(2)+'.ts'):req(id),m,m.exports);return m.exports}
const {createMissionSession}=load('institutionalMissionCallerBoundary.ts');
const {createServerOwnedMissionGrantFence}=load('institutionalMissionServerGrantFence.ts');
const db={collection:()=>({doc:()=>({})})};
const now=Date.now();
const principal={subject:'worker_alpha',issuer:'issuer',audience:'audience',tenant:'tenant',role:'WORKER',
 issuedAtMs:now-1000,notBeforeMs:now-1000,expiresAtMs:now+10000,taskIds:['task_safe']};
const fence=createServerOwnedMissionGrantFence(db,{issuer:'issuer',audience:'audience',tenant:'tenant'});
const base={db,credential:'unsigned-and-untrusted',transactionFence:fence,issuer:'issuer',
 audience:'audience',tenant:'tenant',verifyCredential:async()=>principal};
let checks=0;async function deny(label,options){await assert.rejects(createMissionSession(options),/DENY/);console.log('PASS',++checks,label)}
(async()=>{
 await deny('unsigned credential with synthetic verifier',base);
 await deny('raw noop verifier', {...base,verifyCredential:async()=>null});
 await deny('missing verifier', {...base,verifyCredential:null});
 await deny('unbranded transaction fence', {...base,transactionFence:async()=>{}});
 await deny('missing fence', {...base,transactionFence:null});
 await deny('swapped identity payload', {...base,credential:{subject:'worker_alpha'}});
 await deny('extra roles forged from payload', {...base,verifyCredential:async()=>({...principal,role:'REVIEWER'})});
 console.log('R1488 CALLER BOUNDARY DENY-ONLY',checks+'/'+checks,'PASS',
  'providerAuthentication:false hostedFirestore:false independentApproval:false');
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
