#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { ADMIN_FUNCTIONS_CODEBASE, assertAdminFunctionsCodebase } from './assert-admin-functions-codebase.mjs';

const root = process.cwd();
function fixture(functions) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'urai-admin-functions-synthetic-'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'firebase.json'), JSON.stringify({ functions }));
  return { dir, close: () => rmSync(dir, { recursive: true, force: true }) };
}
const approved = { source: 'functions', runtime: 'nodejs22', codebase: ADMIN_FUNCTIONS_CODEBASE };

test('the current unapproved default codebase fails closed', () => {
  const source = JSON.parse(readFileSync(path.join(root, 'firebase.json'), 'utf8'));
  assert.notEqual(source.functions?.[0]?.codebase, ADMIN_FUNCTIONS_CODEBASE);
  assert.throws(() => assertAdminFunctionsCodebase({ cwd: root }), /codebase is not independently isolated/);
});

test('one synthetic dedicated codebase passes source shape only', () => {
  const f = fixture([approved]);
  try { assert.deepEqual(assertAdminFunctionsCodebase({ cwd: f.dir }), approved); }
  finally { f.close(); }
});

for (const [label, functions] of [
  ['absent', undefined],
  ['empty list', []],
  ['two local codebases', [approved, { ...approved, codebase: 'another-repository' }]],
  ['shared default', [{ ...approved, codebase: 'default' }]],
  ['foreign sibling', [{ ...approved, codebase: 'urai-spatial-functions' }]],
  ['missing codebase', [{ source: 'functions', runtime: 'nodejs22' }]],
  ['wrong source', [{ ...approved, source: 'other-repo' }]],
  ['wrong runtime', [{ ...approved, runtime: 'nodejs20' }]],
]) {
  test('reject ' + label, () => {
    const f = fixture(functions);
    try { assert.throws(() => assertAdminFunctionsCodebase({ cwd: f.dir })); }
    finally { f.close(); }
  });
}

test('source guard CLI denies current default before any Firebase invocation', () => {
  const run = spawnSync(process.execPath, [path.join(root, 'scripts/assert-admin-functions-codebase.mjs')], { cwd: root, encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /deployment HOLD/);
});
