import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const cli=new URL('./admit-founder-video-cli.mjs',import.meta.url).pathname;
const id='a'.repeat(32);
const manifest={schema:'urai-founder-artifact-custody-v1',scope:'PRIVATE_REVIEW_ONLY',
 deliveryMode:'MANUAL_VERIFIED_CUSTODY',automaticallyDispatches:false,productionGate:'HOLD_NO_GO',
 privateMemoryWrites:'DISABLED',items:[]};
const provider={status:'completed',videoId:id,videoPageUrl:'https://app.heygen.com/videos/'+id,
 title:'A completed test film',completedAt:1794339651};
async function fixture(fn){
 const dir=await mkdtemp(join(tmpdir(),'r1658cli-'));
 const paths={m:join(dir,'manifest.json'),p:join(dir,'provider.json'),o:join(dir,'original.mp4'),
  a:join(dir,'archive.mp4'),out:join(dir,'new-private.json')};
 try {
  await writeFile(paths.m,JSON.stringify(manifest));await writeFile(paths.p,JSON.stringify(provider));
  await writeFile(paths.o,'exact-source-bytes');await writeFile(paths.a,'exact-source-bytes');
  return await fn(paths);
 }finally {await rm(dir,{recursive:true,force:true});}
}
function run(p){return spawnSync(process.execPath,[cli,p.m,p.p,p.o,p.a,
 'https://app.notion.com/p/11111111111111111111111111111111',
 'synthetic.mp4','review_cpu_worker',p.out],{encoding:'utf8',timeout:15000});}
test('creates a private new manifest with source-archive checked item',async()=>{
 await fixture(async p=>{
  const r=run(p);assert.equal(r.status,0,r.stderr);
  const out=JSON.parse(await readFile(p.out,'utf8'));
  assert.equal(out.items.length,1);assert.equal(out.items[0].founderAcknowledged,false);
  assert.equal((await stat(p.out)).mode & 0o777,0o600);
  assert.equal(JSON.parse(r.stdout).manifestWritten,true);
 });
});
test('repeat against same input never overwrites already-existing output',async()=>{
 await fixture(async p=>{
  const first=run(p);assert.equal(first.status,0,first.stderr);
  const second=run(p);assert.equal(second.status,2);
  const saved=JSON.parse(await readFile(p.out,'utf8'));
  assert.equal(saved.items.length,1);
 });
});
test('wrong archive bytes fail closed with no output',async()=>{
 await fixture(async p=>{
  await writeFile(p.a,'tampered bytes');
  const r=run(p);assert.equal(r.status,2);
  await assert.rejects(stat(p.out),{code:'ENOENT'});
 });
});
test('recheck existing identical item produces receipt but no file write',async()=>{
 await fixture(async p=>{
  const first=run(p);assert.equal(first.status,0,first.stderr);
  const updated=await readFile(p.out,'utf8');await writeFile(p.m,updated);
  await rm(p.out);
  const second=run(p);assert.equal(second.status,0,second.stderr);
  assert.equal(JSON.parse(second.stdout).receipt.status,'RECHECKED_UNCHANGED');
  assert.equal(JSON.parse(second.stdout).manifestWritten,false);
  await assert.rejects(stat(p.out),{code:'ENOENT'});
 });
});
