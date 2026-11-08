#!/usr/bin/env node
// Source-only regression for the Admin release security-gate contract.
// Never executes firebase, accesses credentials, or invokes production.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const gate = readFileSync(new URL('./security-gate.sh', import.meta.url), 'utf8');
const deploy = readFileSync(new URL('./deploy-production.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

test('distinct source assertions preserve Hosting target guard and Functions namespace guard', () => {
  const target = 'required_pattern "scripts/deploy-production.sh" "^[[:space:]]*node scripts/validate-admin-hosting-target.mjs --require-bound[[:space:]]*$"';
  const codebase = 'required_pattern "scripts/deploy-production.sh" "^[[:space:]]*node scripts/assert-admin-functions-codebase.mjs[[:space:]]*$"';
  assert.ok(gate.split('\n').includes(target));
  assert.ok(gate.split('\n').includes(codebase));
  assert.ok(gate.split('\n').some((line) =>
    line === 'required_pattern ".github/workflows/deploy.yml" "node scripts/assert-admin-functions-codebase.mjs"'));
  assert.doesNotMatch(gate, /\*required_pattern "scripts\/deploy-production\.sh" "node/);
});

test('production deploy retains read-only project policy publishing boundary', () => {
  assert.match(deploy, /^node scripts\/assert-admin-functions-codebase\.mjs$/m);
  assert.match(deploy, /^node scripts\/validate-admin-hosting-target\.mjs --require-bound$/m);
  assert.match(deploy, /^firebase deploy --only hosting:urai-admin-production,functions -P urai-4dc1d$/m);
  assert.doesNotMatch(deploy, /^firebase deploy .*firestore,storage/m);
});

test('protected workflow also validates exact Functions codebase source before WIF and rollback', () => {
  const codebaseAt = workflow.indexOf('node scripts/assert-admin-functions-codebase.mjs');
  const wifAt = workflow.indexOf('Require WIF deploy identity');
  assert.ok(codebaseAt >= 0 && wifAt > codebaseAt);
  assert.match(workflow, /assert-admin-functions-codebase\.mjs" --cwd "\$\{rollback_dir\}"/);
});
