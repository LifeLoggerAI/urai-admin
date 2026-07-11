#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const PRODUCTION_PROJECT_ID = 'urai-4dc1d';
const SEED_CONFIRMATION = 'SEED_SYSTEM_REGISTRY';
const PRODUCTION_APPROVAL = 'APPROVE_URAI_ADMIN_PRODUCTION';
const STAGING_APPROVAL = 'APPROVE_URAI_ADMIN_STAGING';
const shaPattern = /^[0-9a-f]{40}$/;
const projectPattern = /^[a-z][a-z0-9-]{4,29}$/;

export function runSystemRegistrySeed({
  env = process.env,
  execFileSyncFn = execFileSync,
  spawnSyncFn = spawnSync,
  readFileSyncFn = readFileSync,
  nodePath = process.execPath,
} = {}) {
  const apply = env.URAI_ADMIN_SEED_APPLY === '1';
  const confirm = env.URAI_ADMIN_SEED_CONFIRM || '';
  const expectedSha = env.URAI_ADMIN_SEED_SHA || '';
  const explicitProjectId = env.URAI_ADMIN_FIREBASE_PROJECT || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  const projectId = explicitProjectId || PRODUCTION_PROJECT_ID;
  const stagingProjectId = env.URAI_ADMIN_STAGING_FIREBASE_PROJECT || '';
  const productionApproval = env.URAI_ADMIN_PRODUCTION_APPROVAL || '';
  const stagingApproval = env.URAI_ADMIN_STAGING_APPROVAL || '';
  const allowNonProduction = env.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED === '1';

  const fail = (message, code = 1) => ({ ok: false, code, message });

  let seedSource;
  let dataSource;
  try {
    seedSource = readFileSyncFn(new URL('./seed-system-registry.mjs', import.meta.url), 'utf8');
    dataSource = readFileSyncFn(new URL('./system-registry-data.mjs', import.meta.url), 'utf8');
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return fail(`Failed to read registry sources: ${reason}`);
  }

  const contract = spawnSyncFn(nodePath, ['scripts/test-system-registry-contract.mjs'], {
    stdio: 'inherit',
    env,
  });
  if (contract.error) return fail(`Failed to run registry contract: ${contract.error.message}`);
  if (contract.status !== 0) return fail(`Registry contract exited with status ${contract.status}.`);

  if (!apply) {
    return {
      ok: true,
      code: 0,
      message: 'Registry dry-run validation passed. No Firestore write was performed.',
    };
  }

  if (!explicitProjectId) {
    return fail('Apply mode requires URAI_ADMIN_FIREBASE_PROJECT or NEXT_PUBLIC_FIREBASE_PROJECT_ID to explicitly select the target project.');
  }
  if (confirm !== SEED_CONFIRMATION) return fail(`URAI_ADMIN_SEED_CONFIRM must equal ${SEED_CONFIRMATION}.`);
  if (!shaPattern.test(expectedSha)) return fail('URAI_ADMIN_SEED_SHA must be a full lowercase 40-character SHA.');
  if (!projectPattern.test(projectId)) return fail(`Firebase project id is invalid: ${projectId}.`);

  let actualSha;
  let worktree;
  try {
    actualSha = execFileSyncFn('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    worktree = execFileSyncFn('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return fail(`Failed to inspect the current git checkout: ${reason}`);
  }

  if (actualSha !== expectedSha) return fail(`Checked-out SHA ${actualSha} does not match URAI_ADMIN_SEED_SHA ${expectedSha}.`);
  if (worktree) return fail('Registry seed requires a clean worktree.');
  if (!dataSource.includes("repo: 'LifeLoggerAI/urai-spatial'")) return fail('Canonical urai-spatial authority is missing from registry data.');
  if (/repo:\s*['"]LifeLoggerAI\/UrAi\*['"]/.test(dataSource)) return fail('Legacy wildcard repository authority is forbidden in canonical registry data.');
  if (/status:\s*['"]production_ready['"]/.test(dataSource)) return fail('Static registry data must not predeclare production_ready.');
  if (!seedSource.includes('{ merge: false }')) return fail('Registry seed must replace canonical records rather than preserve stale fields.');

  if (env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      return fail('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.');
    }
    if (serviceAccount.project_id && serviceAccount.project_id !== projectId) {
      return fail(`Service-account project ${serviceAccount.project_id} does not match target ${projectId}.`);
    }
  }

  if (projectId === PRODUCTION_PROJECT_ID) {
    if (productionApproval !== PRODUCTION_APPROVAL) {
      return fail(`Production seed requires URAI_ADMIN_PRODUCTION_APPROVAL=${PRODUCTION_APPROVAL}.`);
    }
  } else {
    if (!stagingProjectId) {
      return fail('Non-production seed requires URAI_ADMIN_STAGING_FIREBASE_PROJECT to name the approved staging project.');
    }
    if (projectId !== stagingProjectId) {
      return fail(`Non-production target ${projectId} does not match approved staging project ${stagingProjectId}.`);
    }
    if (!allowNonProduction) return fail('Non-production seed requires URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1.');
    if (stagingApproval !== STAGING_APPROVAL) {
      return fail(`Non-production seed requires URAI_ADMIN_STAGING_APPROVAL=${STAGING_APPROVAL}.`);
    }
  }

  const result = spawnSyncFn(nodePath, ['scripts/seed-system-registry.mjs'], {
    stdio: 'inherit',
    env: {
      ...env,
      URAI_ADMIN_SEED_GUARD_PASSED: 'run-system-registry-seed.mjs',
    },
  });

  if (result.error) return fail(`Failed to start registry seed: ${result.error.message}`);
  const status = result.status ?? 1;
  if (status !== 0) return fail(`Registry seed exited with status ${status}.`, status);
  return { ok: true, code: 0, message: `Registry seed completed for explicitly selected project ${projectId}.` };
}

function isMainModule() {
  return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isMainModule()) {
  const result = runSystemRegistrySeed();
  const output = result.ok ? console.log : console.error;
  output(`[system-registry-seed] ${result.message}`);
  process.exit(result.code);
}
