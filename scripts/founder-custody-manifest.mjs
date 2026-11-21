/**
 * R1656 offline custody-manifest validator. Read-only and privacy-safe.
 * Checks the shape of an ALREADY VERIFIED private custody manifest, not file bytes.
 * Inputs must come from an authorized local export; no provider API, no writes.
 */
import { createHash } from 'node:crypto';
const HEX64 = /^[0-9a-f]{64}$/;
const SAFE_ID = /^(?:heygen|math|visual):[a-z0-9_-]{4,128}$/;
const KINDS = new Set(['video','math-proof','screenshot']);
const VERIFICATION = new Set(['SOURCE_AND_ARCHIVE_SHA_MATCH','CHECKED_FINITE_PROOF','PRESERVED_SOURCE_WITH_SHA256']);
const owns = (a,k) => Object.prototype.hasOwnProperty.call(a,k);
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
function allowedUrl(value) {
  if(typeof value!=='string'||value.length>2000||/%2e|%2f|%5c|%00/i.test(value)||value.includes('\\')||value.includes('#')) return false;
  try{
    const u=new URL(value);
    if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.port) return false;
    if(!['github.com','app.heygen.com','app.notion.com'].includes(u.hostname)) return false;
    if(u.pathname.includes('//')||u.pathname.split('/').some(x=>x==='.'||x==='..')) return false;
    return true;
  }catch{return false;}
}
export function summarizeFounderCustody(manifest){
  if(!object(manifest)||manifest.schema!=='urai-founder-artifact-custody-v1'||
     manifest.scope!=='PRIVATE_REVIEW_ONLY'||manifest.deliveryMode!=='MANUAL_VERIFIED_CUSTODY'||
     manifest.automaticallyDispatches!==false||manifest.productionGate!=='HOLD_NO_GO'||
     manifest.privateMemoryWrites!=='DISABLED'||!Array.isArray(manifest.items)||
     manifest.items.length>500) throw Error('DENY: invalid or operationally overclaimed custody manifest');
  const seen=new Set(),summary=[];
  for(const item of manifest.items){
    if(!object(item)||typeof item.id!=='string'||!SAFE_ID.test(item.id)||
      seen.has(item.id)||!KINDS.has(item.kind)||
      typeof item.name!=='string'||item.name.length<2||item.name.length>180||
      typeof item.filename!=='string'||!/^[a-zA-Z0-9._-]{1,180}$/.test(item.filename)||
      !Number.isSafeInteger(item.bytes)||item.bytes<1||item.bytes>2147483648||
      typeof item.sha256!=='string'||!HEX64.test(item.sha256)||
      !VERIFICATION.has(item.verificationState)||
      !allowedUrl(item.originalRecordUrl)||!allowedUrl(item.archiveUrl)||
      item.humanReview!=='PENDING'||item.founderAcknowledged!==false||
      typeof item.verificationWorker!=='string'||item.verificationWorker.length<3||
      typeof item.verificationMethod!=='string'||item.verificationMethod.length<4){
      throw Error('DENY: invalid custody record');
    }
    if(item.kind==='video' && (item.verificationState!=='SOURCE_AND_ARCHIVE_SHA_MATCH'||
      !item.id.startsWith('heygen:')||!item.filename.endsWith('.mp4')||
      !item.archiveUrl.startsWith('https://app.notion.com/p/'))) throw Error('DENY: video archival claim mismatch');
    if(item.kind==='math-proof' && item.verificationState!=='CHECKED_FINITE_PROOF') throw Error('DENY: proof evidence claim mismatch');
    if(item.kind==='screenshot' && item.verificationState!=='PRESERVED_SOURCE_WITH_SHA256') throw Error('DENY: screenshot claim mismatch');
    seen.add(item.id);
    // Output intentionally omits private URLs and worker identifiers. They are
    // only used inside an authorized private origin manifest, never a public feed.
    summary.push({id:item.id,kind:item.kind,name:item.name,bytes:item.bytes,
      sha256:item.sha256,verificationState:item.verificationState,
      founderAcknowledged:false,humanReview:'PENDING',finalDelivery:'NOT_ACKNOWLEDGED'});
  }
  summary.sort((a,b)=>a.id.localeCompare(b.id));
  const totalBytes=summary.reduce((s,x)=>s+x.bytes,0);
  if(!Number.isSafeInteger(totalBytes))throw Error('DENY: invalid aggregate bytes');
  return {schema:'urai-founder-custody-summary-v1',status:'REVIEW_ONLY',automaticallyDispatches:false,
    releaseGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',
    bytesVerifiedByThisScript:false,founderAcknowledgementImplemented:false,
    itemCount:summary.length,videoCount:summary.filter(x=>x.kind==='video').length,
    totalBytes,summarySha256:createHash('sha256').update(JSON.stringify(summary)).digest('hex'),items:summary};
}
