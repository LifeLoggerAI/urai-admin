#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const apply = process.env.URAI_ADMIN_SEED_APPLY === '1';
const confirm = process.env.URAI_ADMIN_SEED_CONFIRM || '';
const expectedSha = process.env.URAI_ADMIN_SEED_SHA || '';
const projectId = process.env.URAI_ADMIN_FIREBASE_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'urai-4dc1d';
const productionApproval = process.env.URAI_ADMIN_PRODUCTION_APPROVAL || '';
const stagingApproval = process.env.URAI_ADMIN_STAGING_APPROVAL || '';
const allowNonProduction = process.env.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED === '1';
const shaPattern = /^[0-9a-f]{40}$/;
const projectPattern = /^[a-z][a-z0-9-]{4,29}$/;
const seedSource = readFileSync(new URL('./seed-system-registry.mjs', import.meta.url), 'utf8');
const dataSource = readFileSync(new URL('./system-registry-data.mjs', import.meta.url), 'utf8');

function fail(message) {
  console.error(`[system-registry-seed] ${message}`);
  process.exit(1);
}

const contract = spawnSync(process.execPath, ['scripts/test-system-registry-contract.mjs'], {
  stdio: 'inherit',
  env: process.env,
});
if (contract.error) fail(`Failed to run registry contract: ${contract.error.message}`);
if (contract.status !== 0) fail(`Registry contract exited with status ${contract.status}.`);

if (!apply) {
  console.log('Registry dry-run validation passed. No Firestore write was performed.');
  process.exit(0);
}

if (confirm !== 'SEED_SYSTEM_REGISTRY') fail('URAI_ADMIN_SEED_CONFIRM must equal SEED_SYSTEM_REGISTRY.');
if (!shaPattern.test(expectedSha)) fail('URAI_ADMIN_SEED_SHA must be a full lowercase 40-character SHA.');
if (!projectPattern.test(projectId)) fail(`Firebase project id is invalid: ${projectId}.`);

let actualSha;
let worktree;
try {
  actualSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  worktree = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(`Failed to inspect the current git checkout: ${reason}`);
}

if (actualSha !== expectedSha) fail(`Checked-out SHA ${actualSha} does not match URAI_ADMIN_SEED_SHA ${expectedSha}.`);
if (worktree) fail('Registry seed requires a clean worktree.');
if (!dataSource.includes("repo: 'LifeLoggerAI/urai-spatial'")) fail('Canonical urai-spatial authority is missing from registry data.');
if (/status:\s*['"]production_ready['"]/.test(dataSource)) fail('Static registry data must not predeclare production_ready.');
if (!seedSource.includes('{ merge: false }')) fail('Registry seed must replace canonical records rather than preserve stale fields.');

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch {
    fail('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }
  if (serviceAccount.project_id && serviceAccount.project_id !== projectId) {
    fail(`Service-account project ${serviceAccount.project_id} does not match target ${projectId}.`);
  }
}

if (projectId === 'urai-4dc1d') {
  if (productionApproval !== 'APPROVE_URAI_ADMIN_PRODUCTION') {
    fail('Production seed requires URAI_ADMIN_PRODUCTION_APPROVAL=APPROVE_URAI_ADMIN_PRODUCTION.');
  }
} else {
  if (!allowNonProduction) fail('Non-production seed requires URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1.');
  if (stagingApproval !== 'APPROVE_URAI_ADMIN_STAGING') {
    fail('Non-production seed requires URAI_ADMIN_STAGING_APPROVAL=APPROVE_URAI_ADMIN_STAGING.');
  }
}

const result = spawnSync(process.execPath, ['scripts/seed-system-registry.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    URAI_ADMIN_SEED_GUARD_PASSED: 'run-system-registry-seed.mjs',
  },
});

if (result.error) fail(`Failed to start registry seed: ${result.error.message}`);
process.exit(result.status ?? 1);
