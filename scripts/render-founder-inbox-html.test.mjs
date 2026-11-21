import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFounderInbox} from './render-founder-inbox-html.mjs';
const sha='a'.repeat(64), source='https://app.heygen.com/videos/synthetic-test-video',archive='https://app.notion.com/p/11111111111111111111111111111111';
const item={id:'heygen:synthetic_video',kind:'video',name:'Clean video',filename:'clean.mp4',bytes:1530,sha256:sha,originalRecordUrl:source,archiveUrl:archive,verificationState:'SOURCE_AND_ARCHIVE_SHA_MATCH',verificationMethod:'local-stream-sha',verificationWorker:'worker_sample',humanReview:'PENDING',founderAcknowledged:false};
const base={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',deliveryMode:'MANUAL_VERIFIED_CUSTODY',automaticallyDispatches:false,productionGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',items:[item]};
const run=m=>renderFounderInbox(m);
test('renders working accessible offline artifact links and no bogus approval',()=>{
 const html=run(base);
 assert.match(html,/<main class="shell">/);assert.match(html,/Search artifacts/);
 assert.match(html,/data-filter="video"/);assert.match(html,/Open archived original/);
 assert.match(html,/Review pending/);assert.match(html,/not a live worker dispatch system/);
 assert.match(html,/HOLD \/ NO-GO/);
 assert.ok(!html.includes('Approved by founder'));
});
test('HTML escapes supplied labels and never executes embedded code',()=>{
 const x=run({...base,items:[{...item,name:'<img src=x onerror=alert(1)> & Hello'}]});
 assert.ok(!x.includes('<img src=x onerror=alert(1)>'));
 assert.ok(x.includes('&lt;img src=x onerror=alert(1)&gt;'));
 assert.ok(x.includes('&amp; Hello'));
});
test('falsified approval and unsafe provider URL are denied before render',()=>{
 assert.throws(()=>run({...base,items:[{...item,founderAcknowledged:true}]}),/DENY/);
 assert.throws(()=>run({...base,items:[{...item,archiveUrl:'https://evil.example/a'}]}),/DENY/);
});
test('reordered manifests produce identical HTML',()=>{
 const j={...item,id:'heygen:other_video',name:'Other video',filename:'other.mp4'};
 const a=run({...base,items:[item,j]}),b=run({...base,items:[j,item]});
 assert.equal(a,b);
});
test('never displays API signed URLs or job secrets',()=>{
 const x=run(base);
 assert.ok(!x.includes('Signature='));
 assert.ok(!x.includes('resource2.heygen.ai'));
 assert.match(x,/app.notion.com/);
});
