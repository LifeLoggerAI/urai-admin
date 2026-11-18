'use strict';
// R1494 strictly synthetic verifier tests; NOT an owner-issued credential or IAM proof.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const source=path.resolve(__dirname,'../src/institutionalMissionGoogleOidcVerifier.ts');
const js=ts.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText;
const m={exports:{}};
new Function('require','module','exports',js)(require,m,m.exports);
const verify=m.exports.verifyGoogleMissionWorkloadToken;
const {publicKey,privateKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
const jwk=publicKey.export({format:'jwk'});
const key={...jwk,kid:'synthetic-kid-01',alg:'RS256',use:'sig'};
const policy=Object.freeze({
 audience:'https://urai-staging.invalid/mission',
 serviceAccountEmail:'mission-worker@project-123.iam.gserviceaccount.com',
 googleSubject:'123456789012345678901',actorId:'worker_alpha',
 tenant:'tenant_alpha',role:'WORKER',taskIds:['task_alpha']
});
const now=Math.floor(Date.now()/1000);
const base={iss:'https://accounts.google.com',aud:policy.audience,sub:policy.googleSubject,
 email:policy.serviceAccountEmail,email_verified:true,iat:now-10,exp:now+240};
const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const sign=(claims=base,header={alg:'RS256',kid:key.kid,typ:'JWT'})=>{
 const payload=b64(header)+'.'+b64(claims);
 return payload+'.'+crypto.sign('RSA-SHA256',Buffer.from(payload),privateKey).toString('base64url');
};
let expectedEndpoint=0;
const originalFetch=global.fetch;
global.fetch=async(url,options)=>{
 expectedEndpoint++;
 assert.equal(url,'https://www.googleapis.com/oauth2/v3/certs');
 assert.equal(options.redirect,'error');
 return {ok:true,json:async()=>({keys:[key]})};
};
let checks=0;
async function deny(label,token,opts=policy){
 await assert.rejects(verify(token,opts),/DENY/);
 console.log('PASS DENY',++checks,label);
}
(async()=>{
 const principal=await verify(sign(),policy);
 assert.deepEqual(principal,{
  subject:'worker_alpha',issuer:'https://accounts.google.com',
  audience:policy.audience,tenant:'tenant_alpha',role:'WORKER',
  issuedAtMs:base.iat*1000,notBeforeMs:base.iat*1000,expiresAtMs:base.exp*1000,taskIds:['task_alpha']
 });
 console.log('PASS',++checks,'synthetic signed fixture with pinned identity');
 await deny('unsigned token','a.b.c');
 await deny('wrong audience',sign({...base,aud:'https://attacker.invalid'}));
 await deny('wrong Google subject',sign({...base,sub:'99999999999999'}));
 await deny('wrong account email',sign({...base,email:'other@project-123.iam.gserviceaccount.com'}));
 await deny('unverified email',sign({...base,email_verified:false}));
 await deny('wrong issuer',sign({...base,iss:'https://evil.invalid'}));
 await deny('expired',sign({...base,exp:now-5}));
 await deny('future issued',sign({...base,iat:now+50}));
 await deny('overlong token',sign({...base,exp:now+4000}));
 await deny('token role cannot authorize',sign({...base,role:'OPERATOR'}),{...policy,role:'OPERATOR'});
 await deny('bad algorithm',sign(base,{alg:'none',kid:key.kid}));
 await deny('untrusted account policy',sign(),{...policy,serviceAccountEmail:'fake@example.com'});
 await deny('untrusted subject policy',sign(),{...policy,googleSubject:'worker_alpha'});
 // Key mismatch must fail; the keyset remains from the fixed simulated provider endpoint.
 await deny('kid mismatch',sign(base,{alg:'RS256',kid:'unknown-kid'}));
 const {privateKey:otherKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
 const h=b64({alg:'RS256',kid:key.kid}),p=b64(base),payload=h+'.'+p;
 await deny('bad signature',payload+'.'+crypto.sign('RSA-SHA256',Buffer.from(payload),otherKey).toString('base64url'));
 // R1504 independent negative controls: nbf may never authorize before its not-before time.
 // Explicitly deny signed tokens before nbf and impossible timestamp orderings.
 await deny('future nbf',sign({...base,nbf:now+20,exp:now+240}));
 await deny('nbf after expiry',sign({...base,nbf:now+20,exp:now+10}));
 await deny('future iat within prior skew',sign({...base,iat:now+20,exp:now+240}));
 await deny('expiry at or before issuance',sign({...base,iat:now-10,exp:now-10}));
 global.fetch=originalFetch;
 console.log('RESULT',JSON.stringify({checks,endpointChecks:expectedEndpoint,synthetic:true,providerIdentity:false,providerIAM:false,realIssuer:false,hostedFirestore:false,productionAuthorized:false}));
})().catch(e=>{global.fetch=originalFetch;console.error(e.stack||e);process.exitCode=1});
