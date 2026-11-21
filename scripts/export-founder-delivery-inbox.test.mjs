import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = new URL('./export-founder-delivery-inbox.mjs', import.meta.url).pathname;
function invoke(payload, input) {
  const dir = mkdtempSync(join(tmpdir(),'urai-r1653-'));
  try {
    const p = join(dir,'input.json');
    writeFileSync(p, payload);
    return spawnSync(process.execPath,[cli,...(input || [p])],{encoding:'utf8',timeout:5000});
  } finally {rmSync(dir,{recursive:true,force:true});}
}
test('safe offline empty snapshot exports deterministic HOLD-only JSON',()=>{
  const r=invoke('[]');
  assert.equal(r.status,0,r.stderr);
  const a=JSON.parse(r.stdout);
  assert.deepEqual(a.items,[]);
  assert.equal(a.releaseGate,'HOLD_NO_GO');
  assert.equal(a.automaticallyDispatches,false);
  assert.equal(a.privateMemoryWrites,'DISABLED');
});
test('malformed and oversized snapshots fail closed without leaking content',()=>{
  for(const s of ['{', '{}', 'null', '"SECRET_TOKEN_should_not_be_in_output"','x'.repeat(1024*1024+1)]) {
    const r=invoke(s);
    assert.equal(r.status,2);
    assert.equal(r.stdout,'');
    assert.ok(!r.stderr.includes('SECRET_TOKEN_'));
  }
});
test('CLI refuses absent explicit source and does not call providers',()=>{
  const r=spawnSync(process.execPath,[cli],{encoding:'utf8',timeout:5000});
  assert.equal(r.status,2);
  assert.match(r.stderr,/usage:/);
});
