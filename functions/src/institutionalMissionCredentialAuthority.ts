/** R1495 review-only: Google-key-verified service-account identity, never a worker key. */
import { OAuth2Client } from 'google-auth-library';
import type { VerifiedMissionPrincipal } from './institutionalMissionCallerBoundary';

export type WorkloadAccount=Readonly<{subject:string;email:string;actorId:string;role:'WORKER'|'REVIEWER';taskIds:readonly string[]}>;
export type WorkloadPolicy=Readonly<{audience:string;tenant:string;accounts:readonly WorkloadAccount[]}>;
export type WorkloadVerifier=(token:string)=>Promise<VerifiedMissionPrincipal|null>;
const name=/^[a-z][a-z0-9_-]{3,95}$/;
const emailPattern=/^[a-z0-9][a-z0-9-]*@[a-z0-9][a-z0-9-]*\.iam\.gserviceaccount\.com$/;
const subjectPattern=/^[0-9]{10,30}$/;
function deny():never {throw Error('DENY: invalid workload identity');}
export function isApprovedMissionCredentialVerifier(_f:unknown):boolean {
 // No production-authorized mapping/credential issuer is connected yet.
 return false;
}
/** Identity is Google-signature-verified; roles/tasks come exclusively from deployment-owned policy.
 * This factory is NOT an authorized production composition root: it cannot open a session. Revocation is checked
 * against the current Firestore grant separately; an ID token cannot be revoked early.
 */
export function createGoogleMissionCredentialVerifier(p:WorkloadPolicy):WorkloadVerifier {
 if(!p||typeof p.audience!=='string'||p.audience.length<12||p.audience.length>512||
 typeof p.tenant!=='string'||p.tenant.length<3||p.tenant.length>128||
 !Array.isArray(p.accounts)||p.accounts.length<1||p.accounts.length>64)deny();
 const accounts=new Map<string,WorkloadAccount>(),actors=new Set<string>(),emails=new Set<string>();
 for(const x of p.accounts){
  if(!x||!subjectPattern.test(x.subject)||!emailPattern.test(x.email)||
   !name.test(x.actorId)||!['WORKER','REVIEWER'].includes(x.role)||
   !Array.isArray(x.taskIds)||!x.taskIds.length||x.taskIds.length>16||
   !x.taskIds.every((t:unknown)=>typeof t==='string'&&name.test(t))||new Set(x.taskIds).size!==x.taskIds.length||
   accounts.has(x.subject)||actors.has(x.actorId)||emails.has(x.email))deny();
  accounts.set(x.subject,Object.freeze({...x,taskIds:Object.freeze([...x.taskIds])}));
  actors.add(x.actorId);emails.add(x.email);
 }
 const audience=p.audience,tenant=p.tenant,client=new OAuth2Client();
 const verify:WorkloadVerifier=async(token)=>{
  if(typeof token!=='string'||token.length<80||token.length>12000||token.split('.').length!==3)deny();
  let payload;
  try{payload=(await client.verifyIdToken({idToken:token,audience,maxExpiry:3600})).getPayload();}
  catch{deny();}
  const nbf=(payload as unknown as {nbf?:unknown}|undefined)?.nbf;
  if(!payload||!['accounts.google.com','https://accounts.google.com'].includes(payload.iss)||
   payload.aud!==audience||!subjectPattern.test(payload.sub)||payload.email_verified!==true||
   typeof payload.email!=='string'||!emailPattern.test(payload.email)||
   (payload.azp!==undefined&&payload.azp!==audience)||
   !Number.isSafeInteger(payload.iat)||!Number.isSafeInteger(payload.exp)||
   (nbf!==undefined&&!Number.isSafeInteger(nbf)))deny();
  const a=accounts.get(payload.sub);
  if(!a||a.email!==payload.email)deny();
  const issuedAtMs=payload.iat*1000,notBeforeMs=(typeof nbf==='number'?nbf:payload.iat)*1000,expiresAtMs=payload.exp*1000,now=Date.now();
  if(!Number.isSafeInteger(issuedAtMs)||!Number.isSafeInteger(notBeforeMs)||!Number.isSafeInteger(expiresAtMs)||
   issuedAtMs>now||now<notBeforeMs||expiresAtMs<=now||notBeforeMs<issuedAtMs||
   expiresAtMs<=issuedAtMs||expiresAtMs-issuedAtMs>3600000)deny();
  return Object.freeze({subject:a.actorId,issuer:'https://accounts.google.com',
   audience,tenant,role:a.role,taskIds:a.taskIds,issuedAtMs,notBeforeMs,expiresAtMs});
 };
 return verify;
}
