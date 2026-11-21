import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,symlink,link,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {admitCompletedVideo} from './admit-founder-video-offline.mjs';
const id='d230fd9cad6a40969940845112cd8a78';
const provider={videoId:id,status:'completed',title:'Synthetic film',videoPageUrl:'https://app.heygen.com/videos/'+id,completedAt:1794339651};
const archivePageUrl='https://app.notion.com/p/11111111111111111111111111111111';
const manifest={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',deliveryMode:'MANUAL_VERIFIED_CUSTODY',automaticallyDispatches:false,productionGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',items:[]};
async function fixture(fn){
 const dir=await mkdtemp(join(tmpdir(),'r1658-'));
 const originalPath=join(dir,'original.mp4'),archivePath=join(dir,'archive.mp4');
 await writeFile(originalPath,'source-bytes');
 await writeFile(archivePath,'source-bytes');
 try{return await fn({originalPath,archivePath,dir});}finally{await rm(dir,{recursive:true,force:true});}
}
const opts=(paths,extra={})=>({manifest,provider,archivePageUrl,filename:'synthetic-video.mp4',worker:'review_cpu_worker',...paths,...extra});
test('two local streams give unapproved hash-verified record',async()=>{
 await fixture(async p=>{
 const x=await admitCompletedVideo(opts(p));assert.equal(x.manifest.items.length,1);
 assert.equal(x.receipt.status,'ARCHIVED_BYTES_VERIFIED');
 assert.equal(x.receipt.contentVerifiedByThisRun,true);
 assert.equal(x.manifest.items[0].founderAcknowledged,false);
 assert.equal(x.manifest.items[0].humanReview,'PENDING');
 });
});
test('repeated matching job is idempotent',async()=>{
 await fixture(async p=>{
 const x=await admitCompletedVideo(opts(p));
 const y=await admitCompletedVideo(opts(p,{manifest:x.manifest}));
 assert.equal(y.receipt.status,'RECHECKED_UNCHANGED');assert.deepEqual(y.manifest,x.manifest);
 });
});
test('mismatched contents and same source inode denied',async()=>{
 await fixture(async p=>{
 await writeFile(p.archivePath,'a different archive');
 await assert.rejects(admitCompletedVideo(opts(p)),/DENY: source and archive bytes differ/);
 await rm(p.archivePath);await link(p.originalPath,p.archivePath);
 await assert.rejects(admitCompletedVideo(opts(p)),/DENY: same original and archive file/);
 });
});
test('symlinked file cannot serve as an independent copy',async()=>{
 await fixture(async p=>{
 await rm(p.archivePath);await symlink(p.originalPath,p.archivePath);
 await assert.rejects(admitCompletedVideo(opts(p)));
 });
});
test('only fully completed provider records can be admitted',async()=>{
 await fixture(async p=>{
 for(const x of [{...provider,status:'processing'},{...provider,videoPageUrl:'https://evil.example/vid'},
 {...provider,videoId:'bogus'}, {...provider,completedAt:null}]){
  await assert.rejects(admitCompletedVideo(opts(p,{provider:x})),/DENY/);
 }
 });
});
test('reject secret-bearing URLs and forged archive owners',async()=>{
 await fixture(async p=>{
 for(const url of ['http://app.notion.com/p/11111111111111111111111111111111',
  'https://app.notion.com/p/11111111111111111111111111111111?token=x',
  'https://evil.example/p/11111111111111111111111111111111',
  'https://app.notion.com/p/11111111111111111111111111111111/%2e%2e']){
  await assert.rejects(admitCompletedVideo(opts(p,{archivePageUrl:url})),/DENY/);
 }
 });
});
test('tampered prior item cannot be overwritten',async()=>{
 await fixture(async p=>{
 const x=await admitCompletedVideo(opts(p));
 const modified={...x.manifest,items:[{...x.manifest.items[0],sha256:'c'.repeat(64)}]};
 await assert.rejects(admitCompletedVideo(opts(p,{manifest:modified})),/DENY: ID collision/);
 });
});
test('unsafe filenames and release-state alterations denied',async()=>{
 await fixture(async p=>{
 await assert.rejects(admitCompletedVideo(opts(p,{filename:'../bad.mp4'})),/DENY/);
 await assert.rejects(admitCompletedVideo(opts(p,{manifest:{...manifest,privateMemoryWrites:'ENABLED'}})),/DENY/);
 });
});
