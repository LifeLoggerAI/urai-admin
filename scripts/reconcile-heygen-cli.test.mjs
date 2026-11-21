import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const cli=new URL('./reconcile-heygen-cli.mjs',import.meta.url).pathname;
const id='a'.repeat(32);
const feed={schema:'urai-heygen-sanitized-feed-v1',paginationComplete:true,items:[
 {id,status:'completed',title:'Synthetic completed output',created_at:1,completed_at:2,video_page_url:'https://app.heygen.com/videos/'+id}]};
const manifest={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',
 deliveryMode:'MANUAL_VERIFIED_CUSTODY',automaticallyDispatches:false,
 productionGate:'HOLD_NO_GO',privateMemoryWrites:'DISABLED',items:[]};
async function withFiles(fn) {
 const dir=await mkdtemp(join(tmpdir(),'r1659-'));
 const f=join(dir,'feed.json'),m=join(dir,'manifest.json');
 try{await writeFile(f,JSON.stringify(feed));await writeFile(m,JSON.stringify(manifest));return await fn({f,m,dir});}
 finally{await rm(dir,{recursive:true,force:true});}
}
const run=p=>spawnSync(process.execPath,[cli,p.f,p.m],{encoding:'utf8',timeout:10000});
test('completed but unarchived job remains pending, no private source URLs echoed',async()=>{
 await withFiles(async p=>{
  const r=run(p);assert.equal(r.status,0,r.stderr);const j=JSON.parse(r.stdout);
  assert.equal(j.pendingOriginalArchive,1);assert.equal(j.existingArchiveReceipts,0);
  assert.equal(j.automaticallyDispatches,false);assert.equal(j.releaseGate,'HOLD_NO_GO');
  assert.ok(!r.stdout.includes('app.heygen.com'));assert.ok(!r.stdout.includes('app.notion.com'));
 });
});
test('partial provider listing is denied',async()=>{
 await withFiles(async p=>{
  await writeFile(p.f,JSON.stringify({...feed,paginationComplete:false}));
  const r=run(p);assert.equal(r.status,2);assert.equal(r.stdout,'');
 });
});
test('signed URLs, malformed source and forged production gate denied',async()=>{
 await withFiles(async p=>{
  await writeFile(p.f,JSON.stringify({...feed,items:[{...feed.items[0],video_url:'https://host/?secret=TOKEN'}]}));
  const r=run(p);assert.equal(r.status,2);assert.ok(!r.stderr.includes('TOKEN'));
  await writeFile(p.f,JSON.stringify(feed));
  await writeFile(p.m,JSON.stringify({...manifest,privateMemoryWrites:'ENABLED'}));
  assert.equal(run(p).status,2);
 });
});
test('missing arguments and oversize input fail closed',async()=>{
 const r=spawnSync(process.execPath,[cli],{encoding:'utf8',timeout:5000});assert.equal(r.status,2);
 await withFiles(async p=>{
  await writeFile(p.f,'x'.repeat(1024*1024+1));
  assert.equal(run(p).status,2);
 });
});
