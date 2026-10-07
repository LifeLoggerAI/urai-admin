#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { ADMIN_HOSTING_TARGET, validateAdminHostingTarget } from './validate-admin-hosting-target.mjs';

const root = process.cwd();
const site = 'synthetic-owned-admin-site';
const sha = 'a'.repeat(40);
const config = JSON.parse(readFileSync(path.join(root, 'firebase.json'), 'utf8'));
const rc = JSON.parse(readFileSync(path.join(root, '.firebaserc'), 'utf8'));

function fixture({ bound = false, config: chosenConfig = config } = {}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'urai-admin-hosting-boundary-'));
  const checkout = path.join(dir, 'checkout');
  mkdirSync(path.join(checkout, 'scripts'), { recursive: true });
  writeFileSync(path.join(checkout, 'firebase.json'), JSON.stringify(chosenConfig));
  const chosenRc = structuredClone(rc);
  chosenRc.targets = bound ? { 'urai-4dc1d': { hosting: { [ADMIN_HOSTING_TARGET]: [site] } } } : {};
  writeFileSync(path.join(checkout, '.firebaserc'), JSON.stringify(chosenRc));
  copyFileSync(path.join(root, 'scripts/validate-admin-hosting-target.mjs'), path.join(checkout, 'scripts/validate-admin-hosting-target.mjs'));
  return { dir, checkout, close() { rmSync(dir, { recursive: true, force: true }); } };
}

test('reviewed symbolic configuration is valid structurally while production stays unbound', () => {
  const f = fixture();
  try {
    assert.equal(validateAdminHostingTarget({ cwd: f.checkout }).bound, false);
    assert.throws(() => validateAdminHostingTarget({ cwd: f.checkout, requireBound: true, hostingSite: site }), /remains unbound/);
  } finally { f.close(); }
});

test('one matching protected reviewed dedicated binding is accepted', () => {
  const f = fixture({ bound: true });
  try { assert.equal(validateAdminHostingTarget({ cwd: f.checkout, requireBound: true, hostingSite: site }).bound, true); }
  finally { f.close(); }
});

for (const mutation of ['missing-target', 'wrong-target', 'concrete-site', 'hosting-array']) {
  test('actual guard rejects unsafe configuration ' + mutation, () => {
    const changed = structuredClone(config);
    if (mutation === 'missing-target') delete changed.hosting.target;
    if (mutation === 'wrong-target') changed.hosting.target = 'default';
    if (mutation === 'concrete-site') changed.hosting.site = 'urai-4dc1d';
    if (mutation === 'hosting-array') changed.hosting = [changed.hosting];
    const f = fixture({ config: changed });
    try { assert.throws(() => validateAdminHostingTarget({ cwd: f.checkout }), /fallback is forbidden/); }
    finally { f.close(); }
  });
}

test('primary project site, multiple sites and mismatched protected site are rejected', () => {
  const f = fixture({ bound: true });
  try {
    assert.throws(() => validateAdminHostingTarget({ cwd: f.checkout, requireBound: true, hostingSite: 'another-owned-site' }), /remains unbound/);
    const badRc = structuredClone(rc);
    for (const sites of [['urai-4dc1d'], [site, 'second-site']]) {
      badRc.targets = { 'urai-4dc1d': { hosting: { [ADMIN_HOSTING_TARGET]: sites } } };
      writeFileSync(path.join(f.checkout, '.firebaserc'), JSON.stringify(badRc));
      assert.throws(() => validateAdminHostingTarget({ cwd: f.checkout }), /exactly one dedicated/);
    }
  } finally { f.close(); }
});

function deployFixture(bound) {
  const f = fixture({ bound });
  const bin = path.join(f.dir, 'bin');
  mkdirSync(bin);
  copyFileSync(path.join(root, 'scripts/deploy-production.sh'), path.join(f.checkout, 'scripts/deploy-production.sh'));
  const observed = path.join(f.dir, 'firebase.txt');
  writeFileSync(path.join(bin, 'git'), '#!/bin/sh\nprintf "%s\\n" "$URAI_SYNTHETIC_SHA"\n');
  writeFileSync(path.join(bin, 'pnpm'), '#!/bin/sh\nexit 0\n');
  writeFileSync(path.join(bin, 'firebase'), '#!/bin/sh\nprintf "%s\\n" "$*" > "$URAI_SYNTHETIC_OBSERVATION"\n');
  for (const name of ['git', 'pnpm', 'firebase']) chmodSync(path.join(bin, name), 0o755);
  const credentials = path.join(f.dir, 'synthetic-credentials.json');
  writeFileSync(credentials, '{}');
  const result = spawnSync('bash', [path.join(f.checkout, 'scripts/deploy-production.sh')], {
    cwd: f.checkout, encoding: 'utf8',
    env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH, GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main', GOOGLE_APPLICATION_CREDENTIALS: credentials, URAI_ADMIN_TARGET_SHA: sha, URAI_ADMIN_HOSTING_SITE: site, URAI_SYNTHETIC_SHA: sha, URAI_SYNTHETIC_OBSERVATION: observed },
  });
  return { f, result, observed };
}

test('actual deployment shell denies the unbound site before any synthetic Firebase invocation', () => {
  const { f, result, observed } = deployFixture(false);
  try { assert.notEqual(result.status, 0); assert.match(result.stderr, /remains unbound/); assert.equal(existsSync(observed), false); }
  finally { f.close(); }
});

test('actual deployment shell invokes only the explicit Admin target with a matching synthetic binding', () => {
  const { f, result, observed } = deployFixture(true);
  try {
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(observed, 'utf8').trim(), 'deploy --only hosting:urai-admin-production,functions,firestore,storage -P urai-4dc1d');
  } finally { f.close(); }
});

test('actual rollback workflow denies an ancestor without the owned symbolic target before install or Firebase execution', () => {
  const oldConfig = structuredClone(config);
  delete oldConfig.hosting.target;
  const f = fixture({ config: oldConfig });
  try {
    mkdirSync(path.join(f.checkout, 'functions'));
    writeFileSync(path.join(f.checkout, 'functions/.keep'), '');
    execFileSync('git', ['init', '-q'], { cwd: f.checkout });
    execFileSync('git', ['add', '.'], { cwd: f.checkout });
    execFileSync('git', ['-c', 'user.name=Synthetic', '-c', 'user.email=synthetic@example.invalid', 'commit', '-qm', 'synthetic historical unbound source'], { cwd: f.checkout });
    const rollbackSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: f.checkout, encoding: 'utf8' }).trim();
    const workflow = readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
    const section = workflow.split('      - name: Restore approved rollback release after failed target verification\n')[1].split('      - name: Write deployment receipt\n')[0];
    const shell = section.split('        run: |\n')[1].split('\n').map((line) => line.startsWith('          ') ? line.slice(10) : line).join('\n');
    const bin = path.join(f.dir, 'bin');
    mkdirSync(bin);
    const observed = path.join(f.dir, 'corepack.txt');
    writeFileSync(path.join(bin, 'corepack'), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$URAI_SYNTHETIC_OBSERVATION"\n');
    chmodSync(path.join(bin, 'corepack'), 0o755);
    const marker = path.join(f.dir, 'deployed.json');
    writeFileSync(marker, '{}');
    const result = spawnSync('bash', ['-c', shell], {
      cwd: f.checkout, encoding: 'utf8',
      env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH, RUNNER_TEMP: f.dir, GITHUB_WORKSPACE: root, GITHUB_OUTPUT: path.join(f.dir, 'output.txt'), URAI_ADMIN_DEPLOY_MARKER: marker, URAI_ADMIN_ROLLBACK_SHA: rollbackSha, URAI_ADMIN_HOSTING_SITE: site, URAI_ADMIN_BASE_URL: 'https://synthetic-admin.example.invalid', URAI_ADMIN_FUNCTIONS_BASE_URL: 'https://synthetic-functions.example.invalid', URAI_ADMIN_PRODUCTION_URL: 'https://synthetic-admin.example.invalid', URAI_ADMIN_ALLOWED_ORIGINS: 'https://synthetic-admin.example.invalid', URAI_SYNTHETIC_OBSERVATION: observed },
    });
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(observed), false, 'no install/build/deploy should execute for an unbound ancestor');
    assert.match(result.stderr, /fallback is forbidden/);
  } finally { f.close(); }
});
