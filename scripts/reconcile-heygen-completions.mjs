/**
 * R1659. Read-only reconciliation of an already-authorized, sanitized provider
 * inventory against a private custody manifest. Never fetches providers, uploads
 * archives, publishes media, changes credentials or acknowledges the founder.
 */
import { createHash } from 'node:crypto';
import { summarizeFounderCustody } from './founder-custody-manifest.mjs';

const VID=/^[0-9a-f]{32}$/;
const STATUSES=new Set(['completed','failed','pending','processing','in_progress']);
const INPUT_KEYS=new Set(['id','status','title','created_at','completed_at','video_page_url']);
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const deny=reason=>{throw Error('DENY: '+reason);};
const stable=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

export function reconcileHeyGenCompletionFeed(feed,manifest){
  const custody=summarizeFounderCustody(manifest);
  if(!isObj(feed)||feed.schema!=='urai-heygen-sanitized-feed-v1'||
     feed.paginationComplete!==true||!Array.isArray(feed.items)||
     feed.items.length>500)deny('complete sanitized feed required');
  const records=new Map();
  for(const job of feed.items){
    if(!isObj(job)||Object.keys(job).some(k=>!INPUT_KEYS.has(k))||
       !VID.test(job.id||'')||!STATUSES.has(job.status)||
       typeof job.title!=='string'||job.title.length<1||job.title.length>250||
       !Number.isSafeInteger(job.created_at)||job.created_at<0||
       ![null,undefined].includes(job.completed_at)&&(!Number.isSafeInteger(job.completed_at)||job.completed_at<0)||
       !(job.video_page_url===null||job.video_page_url===undefined||
         job.video_page_url==='https://app.heygen.com/videos/'+job.id)||
       records.has(job.id)) deny('malformed, duplicate or unsanitized provider record');
    if(job.status==='completed'&&
      (!(Number.isSafeInteger(job.completed_at)&&job.completed_at>=job.created_at)||
       job.video_page_url!=='https://app.heygen.com/videos/'+job.id))
       deny('completed job lacks authoritative evidence pointer');
    if(job.status!=='completed'&&job.completed_at!=null) deny('noncompleted job has completion timestamp');
    records.set(job.id,job);
  }
  const archiveVideos=new Map(manifest.items.filter(x=>x.kind==='video')
    .map(x=>[x.id.slice('heygen:'.length),x]));
  const items=[];
  for(const [id,job] of records){
    const archived=archiveVideos.get(id);
    let status;
    if(job.status==='completed'){
      if(archived){
        if(archived.originalRecordUrl!==job.video_page_url ||
           archived.verificationState!=='SOURCE_AND_ARCHIVE_SHA_MATCH')
           status='CUSTODY_CONFLICT_REVIEW_REQUIRED';
        else status='EXISTING_HASH_VERIFIED_RECEIPT';
      }else status='PENDING_ORIGINAL_ARCHIVE';
    }else if(archived){
      status='PROVIDER_ARCHIVE_STATE_CONFLICT';
    }else if(job.status==='failed'){
      status='FAILED_NO_VIDEO';
    }else status='IN_PROGRESS_NOT_DELIVERED';
    items.push({id:'heygen:'+id,status,providerStatus:job.status,
      originalRecordUrl:job.video_page_url??null,founderAcknowledged:false});
  }
  for(const [id] of archiveVideos){
    if(!records.has(id))items.push({
      id:'heygen:'+id,status:'ARCHIVED_NOT_IN_THIS_FEED',
      providerStatus:'not_listed',originalRecordUrl:null,founderAcknowledged:false
    });
  }
  items.sort((a,b)=>a.id.localeCompare(b.id));
  const counts={};
  for(const x of items)counts[x.status]=(counts[x.status]||0)+1;
  const sortedCounts=Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b)));
  return {schema:'urai-heygen-completion-reconcile-v1',
    source:'AUTHORIZED_SANITIZED_FEED',reviewOnly:true,automaticallyDispatches:false,
    bytesReverifiedByThisRun:false,founderAcknowledgementImplemented:false,
    releaseGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',
    providerJobs:records.size,archivedVideoReceipts:archiveVideos.size,
    existingArchiveReceipts:sortedCounts.EXISTING_HASH_VERIFIED_RECEIPT||0,
    pendingOriginalArchive:sortedCounts.PENDING_ORIGINAL_ARCHIVE||0,
    failedProviderJobs:sortedCounts.FAILED_NO_VIDEO||0,
    counts:sortedCounts,items,summarySha256:stable(items)};
}
