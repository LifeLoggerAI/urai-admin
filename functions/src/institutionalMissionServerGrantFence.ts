/** R1482 REVIEW ONLY. No issuer, IAM mutation, or deployment authorization. */
import type { Firestore } from 'firebase-admin/firestore';
import type { AdminTransactionFence, MissionAction } from './institutionalMissionCoordination';
export type GrantPolicy = Readonly<{issuer:string;audience:string;tenant:string}>;
const roles: Record<string, readonly MissionAction[]> = {
 OPERATOR:['REGISTER','CREATE'],WORKER:['READ','CLAIM','HEARTBEAT','SUBMIT_EVIDENCE'],REVIEWER:['READ','VERIFY']
};
const ids=/^[a-z][a-z0-9_-]{3,95}$/;
function deny():never {throw Error('DENY: invalid or revoked authoritative mission grant')}
function named(v:unknown):v is string{return typeof v==='string'&&ids.test(v)}
function names(v:unknown,max:number):v is string[]{return Array.isArray(v)&&v.length>0&&v.length<=max&&v.every(named)&&new Set(v).size===v.length}
export function createServerOwnedMissionGrantFence(db:Firestore,policy:GrantPolicy):AdminTransactionFence{
 if(!db||!policy||![policy.issuer,policy.audience,policy.tenant].every(v=>typeof v==='string'&&v.length>0&&v.length<=256))deny();
 const trusted=Object.freeze({...policy});
 return async(tx,{actorId,action,taskId})=>{
  if(!named(actorId)||!Object.values(roles).some(actions=>actions.includes(action))||(taskId!==undefined&&!named(taskId)))deny();
  const snap=await tx.get(db.collection('institutionalMissionGrants').doc(actorId));
  if(!snap.exists)deny();
  const rawReadTime=snap.readTime?.toMillis?.();
  if(typeof rawReadTime!=='number'||!Number.isSafeInteger(rawReadTime)||rawReadTime<=0)deny();
  const now=rawReadTime;
  const g=snap.data();
  const allowed=['schema','actorId','issuer','audience','tenant','role','status','allowedActions','taskIds','issuedAtMs','notBeforeMs','expiresAtMs','revokedAtMs'];
  if(!g||Object.keys(g).some(k=>!allowed.includes(k))||
   g.schema!=='urai-mission-grant-v1'||g.actorId!==actorId||
   g.issuer!==trusted.issuer||g.audience!==trusted.audience||g.tenant!==trusted.tenant||
   g.status!=='ACTIVE'||g.revokedAtMs!==null||!Object.prototype.hasOwnProperty.call(roles,g.role)||
   !Array.isArray(g.allowedActions)||g.allowedActions.length<1||g.allowedActions.length>6||new Set(g.allowedActions).size!==g.allowedActions.length||!g.allowedActions.every((a:string)=>Object.values(roles).some(actions=>actions.includes(a as MissionAction)))||
   !g.allowedActions.includes(action)||!roles[g.role].includes(action)||
   !names(g.taskIds,16)||
   !Number.isSafeInteger(g.issuedAtMs)||!Number.isSafeInteger(g.notBeforeMs)||!Number.isSafeInteger(g.expiresAtMs)||
   g.issuedAtMs<=0||g.notBeforeMs<g.issuedAtMs||
   g.expiresAtMs<=g.notBeforeMs||g.expiresAtMs-g.issuedAtMs>3600000||
   !(g.issuedAtMs<=now&&g.notBeforeMs<=now&&now<g.expiresAtMs)||
   (taskId!==undefined&&!g.taskIds.includes(taskId))||
   (taskId===undefined&&action!=='REGISTER'))deny();
 };
}
