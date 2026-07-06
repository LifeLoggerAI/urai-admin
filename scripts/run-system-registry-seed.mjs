#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const apply = process.env.URAI_ADMIN_SEED_APPLY === '1';
const confirm = process.env.URAI_ADMIN_SEED_CONFIRM || '';
const expectedSha = process.env.URAI_ADMIN_SEED_SHA || '';
const projectId = process.env.URAI_ADMIN_FIREBASE_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'urai-4dc1d';
const productionApproval = process.env.URAI_ADMIN_PRODUCTION_APPROVAL || '';
const shaPattern = /^[0-9a-f]{40}$/;
const seedSource = readFileSync(new URL('./seed-system-registry.mjs', import.meta.url), 'utf8');

function fail(message) {
  console.error(`[system-registry-seed] ${message}`);
  process.exit(1);
}

if (!apply) {
  console.log('System registry seed is dry-run only. Set URAI_ADMIN_SEED_APPLY=1 with the required confirmation and exact SHA to write.');
  process.exit(0);
}

if (confirm !== 'SEED_SYSTEM_REGISTRY') fail('URAI_ADMIN_SEED_CONFIRM must equal SEED_SYSTEM_REGISTRY.');
if (!shaPattern.test(expectedSha)) fail('URAI_ADMIN_SEED_SHA must be a full lowercase 40-character SHA.');

const actualSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (actualSha !== expectedSha) fail(`Checked-out SHA ${actualSha} does not match URAI_ADMIN_SEED_SHA ${expectedSha}.`);

if (seedSource.includes("repo: 'LifeLoggerAI/UrAi*'")) {
  fail('Legacy LifeLoggerAI/UrAi* authority remains in seed-system-registry.mjs. Merge the canonical registry correction before seeding.');
}

if (projectId === 'urai-4dc1d' && productionApproval !== 'APPROVE_URAI_ADMIN_PRODUCTION') {
  fail('Production seed requires URAI_ADMIN_PRODUCTION_APPROVAL=APPROVE_URAI_ADMIN_PRODUCTION.');
}

const result = spawnSync(process.execPath, ['scripts/seed-system-registry.mjs'], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
