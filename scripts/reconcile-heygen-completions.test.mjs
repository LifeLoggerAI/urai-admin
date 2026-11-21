import test from 'node:test';
import assert from 'node:assert/strict';
import {reconcileHeyGenCompletionFeed} from './reconcile-heygen-completions.mjs';
const a='a'.repeat(32),b='b'.repeat(32),c='c'.repeat(32);
const archiveUrl='https://app.notion.com/p/11111111111111111111111111111111';
const m={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',
 deliveryMode:'MANUAL_VERIFIED_CUSTODY',automaticallyDispatches:false,
 productionGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',
 items:[{id:'heygen:'+a,kind:'video',name:'Archived source',filename:'source.mp4',
 bytes:101,sha256:'f'.repeat(64),originalRecordUrl:'https://app.heygen.com/videos/'+a,
 archiveUrl,verificationState:'SOURCE_AND_ARCHIVE_SHA_MATCH',
 verificationMethod:'independent-source-and-archive-sha',
 verificationWorker:'worker_test',humanReview:'PENDING',founderAcknowledged:false}]};
const job=(id,status)=>({id,status,title:'Synthetic worker output',created_at:100,
 completed_at:status==='completed'?200:null,
 video_page_url:status==='completed'?'https://app.heygen.com/videos/'+id:null});
const feed=items=>({schema:'urai-heygen-sanitized-feed-v1',paginationComplete:true,items});
const run=(items,manifest=m)=>reconcileHeyGenCompletionFeed(feed(items),manifest);
test('completed archived and failed jobs are distinguished, no new delivery',()=>{
 const out=run([job(a,'completed'),job(b,'failed')]);
 assert.equal(out.existingArchiveReceipts,1);assert.equal(out.failedProviderJobs,1);
 assert.equal(out.pendingOriginalArchive,0);assert.equal(out.automaticallyDispatches,false);
 assert.equal(out.bytesReverifiedByThisRun,false);
 assert.equal(out.items[0].founderAcknowledged,false);
});
test('a genuinely newly completed provider result enters pending archive, not delivered',()=>{
 const r=run([job(a,'completed'),job(c,'completed')]);
 assert.equal(r.pendingOriginalArchive,1);
 assert.equal(r.items.find(x=>x.id==='heygen:'+c).status,'PENDING_ORIGINAL_ARCHIVE');
});
test('provider failure and in-progress jobs cannot become deliverables',()=>{
 const out=run([job(a,'completed'),job(b,'failed'),job(c,'processing')]);
 assert.equal(out.counts.FAILED_NO_VIDEO,1);
 assert.equal(out.counts.IN_PROGRESS_NOT_DELIVERED,1);
});
test('same provider list in different order yields same digest',()=>{
 const j=[job(a,'completed'),job(b,'failed'),job(c,'pending')];
 assert.deepEqual(run(j),run(j.reverse()));
});
test('rejects unsafe and signed media URLs, duplicates and malformed status',()=>{
 const sample=job(a,'completed');
 for(const bad of [
  {...sample,video_url:'https://resource2.heygen.ai/private?Signature=x'},
  {...sample,video_page_url:'https://app.heygen.com/videos/'+a+'?token=secret'},
  {...sample,id:'wrong'},
  {...sample,status:'unknown'},
  {...sample,completed_at:null},
  {...sample,status:'failed',completed_at:200},
 ]){
  assert.throws(()=>run([bad]),/DENY/);
 }
 assert.throws(()=>run([sample,sample]),/DENY/);
});
test('rejects partial pagination and forged release clearance',()=>{
 assert.throws(()=>reconcileHeyGenCompletionFeed({...feed([job(a,'completed')]),paginationComplete:false},m),/DENY/);
 assert.throws(()=>run([job(a,'completed')],{...m,privateMemoryWrites:'ENABLED'}),/DENY/);
});
test('detect archived record whose provider status conflicts, no silent removal',()=>{
 const out=run([job(a,'failed')]);
 assert.equal(out.counts.PROVIDER_ARCHIVE_STATE_CONFLICT,1);
});
test('an archived record missing from a declared complete feed is flagged',()=>{
 const out=run([job(b,'failed')]);
 assert.equal(out.counts.ARCHIVED_NOT_IN_THIS_FEED,1);
});
