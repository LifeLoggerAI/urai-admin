#!/usr/bin/env node

import assert from 'node:assert/strict';
import { runSystemRegistrySeed } from './run-system-registry-seed.mjs';

const SHA = 'a'.repeat(40);
const OTHER_SHA = 'b'.repeat(40);
const PRODUCTION_PROJECT = 'urai-4dc1d';
const STAGING_PROJECT = 'urai-admin-staging';
const EMULATOR_PROJECT = 'urai-admin-emulator';

function cloudAuthority(projectId) {
  return {
    FIREBASE_SERVICE_ACCOUNT_KEY: JSON.stringify({
      type: 'service_account',
      project_id: projectId,
      client_email: `registry-deployer@${projectId}.iam.gserviceaccount.com`,
    }),
    URAI_ADMIN_SEED_RECEIPT_PATH: `docs/release-evidence/test-${projectId}.json`,
  };
}

function createHarness({
  contractStatus = 0,
  seedStatus = 0,
  seedError = null,
  actualSha = SHA,
  worktree = '',
  readError = null,
  dataSource = "repo: 'LifeLoggerAI/urai-spatial'; status: 'blocked';",
  credentialFiles = {},
} = {}) {
  const calls = { spawn: [], exec: [], read: [] };

  const readFileSyncFn = (input) => {
    calls.read.push(String(input));
    if (readError) throw readError;
    const target = String(input);
    if (target.includes('seed-system-registry.mjs')) return "batch.set(ref, data, { merge: false });";
    if (target.includes('system-registry-data.mjs')) return dataSource;
    if (target in credentialFiles) return credentialFiles[target];
    throw new Error(`Unexpected read: ${target}`);
  };

  const execFileSyncFn = (command, args) => {
    calls.exec.push({ command, args });
    if (args[0] === 'rev-parse') return `${actualSha}\n`;
    if (args[0] === 'status') return `${worktree}\n`;
    throw new Error(`Unexpected exec: ${command} ${args.join(' ')}`);
  };

  const spawnSyncFn = (command, args, options) => {
    calls.spawn.push({ command, args, options });
    if (args[0] === 'scripts/test-system-registry-contract.mjs') return { status: contractStatus, error: null };
    if (args[0] === 'scripts/seed-system-registry.mjs') return { status: seedStatus, error: seedError };
    throw new Error(`Unexpected spawn: ${command} ${args.join(' ')}`);
  };

  return { calls, readFileSyncFn, execFileSyncFn, spawnSyncFn };
}

function invoke(env, options = {}) {
  const harness = createHarness(options);
  const result = runSystemRegistrySeed({
    env,
    readFileSyncFn: harness.readFileSyncFn,
    execFileSyncFn: harness.execFileSyncFn,
    spawnSyncFn: harness.spawnSyncFn,
    nodePath: '/test/node',
  });
  return { result, calls: harness.calls };
}

function expectFailure(name, invocation, expectedMessage, expectedCode = 1) {
  assert.equal(invocation.result.ok, false, `${name}: expected failure`);
  assert.equal(invocation.result.code, expectedCode, `${name}: unexpected exit code`);
  assert.match(invocation.result.message, expectedMessage, `${name}: unexpected message`);
  console.log(`OK: ${name}`);
}

{
  const { result, calls } = invoke({});
  assert.equal(result.ok, true);
  assert.match(result.message, /No Firestore write was performed/);
  assert.equal(calls.spawn.length, 1, 'dry-run must execute only the contract child');
  assert.equal(calls.spawn[0].args[0], 'scripts/test-system-registry-contract.mjs');
  assert.equal(calls.exec.length, 0, 'dry-run must not inspect or mutate a git checkout');
  console.log('OK: dry-run validates without spawning the seed child');
}

expectFailure(
  'contract failure propagates before apply logic',
  invoke({}, { contractStatus: 3 }),
  /contract exited with status 3/,
);

expectFailure(
  'apply requires explicit target project',
  invoke({ URAI_ADMIN_SEED_APPLY: '1' }),
  /explicitly select the target project/,
);

expectFailure(
  'apply rejects missing confirmation',
  invoke({ URAI_ADMIN_SEED_APPLY: '1', URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT }),
  /URAI_ADMIN_SEED_CONFIRM/,
);

expectFailure(
  'apply rejects invalid SHA',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: 'short',
  }),
  /full lowercase 40-character SHA/,
);

expectFailure(
  'apply rejects checked-out SHA mismatch',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }, { actualSha: OTHER_SHA }),
  /does not match URAI_ADMIN_SEED_SHA/,
);

expectFailure(
  'apply rejects legacy wildcard repository authority',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_PRODUCTION_APPROVAL: 'APPROVE_URAI_ADMIN_PRODUCTION',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(PRODUCTION_PROJECT),
  }, { dataSource: "repo: 'LifeLoggerAI/urai-spatial'; repo: 'LifeLoggerAI/UrAi*'; status: 'blocked';" }),
  /Legacy wildcard repository authority is forbidden/,
);

expectFailure(
  'production apply rejects missing approval',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /Production seed requires/,
);

expectFailure(
  'emulator apply rejects missing loopback host',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIRESTORE_EMULATOR: '1',
    URAI_ADMIN_FIREBASE_PROJECT: EMULATOR_PROJECT,
    URAI_ADMIN_EMULATOR_APPROVAL: 'APPROVE_URAI_ADMIN_EMULATOR',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /explicit loopback host and port/,
);

expectFailure(
  'emulator apply rejects noncanonical project id',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIRESTORE_EMULATOR: '1',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
    URAI_ADMIN_FIREBASE_PROJECT: 'different-emulator',
    URAI_ADMIN_EMULATOR_APPROVAL: 'APPROVE_URAI_ADMIN_EMULATOR',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /must exactly equal urai-admin-emulator/,
);

expectFailure(
  'emulator apply forbids cloud credentials',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIRESTORE_EMULATOR: '1',
    FIRESTORE_EMULATOR_HOST: 'localhost:8080',
    URAI_ADMIN_FIREBASE_PROJECT: EMULATOR_PROJECT,
    URAI_ADMIN_EMULATOR_APPROVAL: 'APPROVE_URAI_ADMIN_EMULATOR',
    FIREBASE_SERVICE_ACCOUNT_KEY: JSON.stringify({ project_id: EMULATOR_PROJECT }),
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /forbids cloud service-account credentials/,
);

{
  const { result, calls } = invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIRESTORE_EMULATOR: '1',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
    URAI_ADMIN_FIREBASE_PROJECT: EMULATOR_PROJECT,
    URAI_ADMIN_EMULATOR_APPROVAL: 'APPROVE_URAI_ADMIN_EMULATOR',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  });
  assert.equal(result.ok, true);
  assert.match(result.message, /isolated emulator/);
  assert.equal(calls.spawn.length, 2);
  assert.equal(calls.spawn[1].args[0], 'scripts/seed-system-registry.mjs');
  assert.equal(calls.spawn[1].options.env.URAI_ADMIN_SEED_GUARD_PASSED, 'run-system-registry-seed.mjs');
  assert.equal(calls.spawn[1].options.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080');
  console.log('OK: controlled emulator apply reaches only the guarded seed child');
}

expectFailure(
  'staging apply rejects missing approved staging project',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /URAI_ADMIN_STAGING_FIREBASE_PROJECT/,
);

expectFailure(
  'staging apply rejects target mismatch',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: 'different-staging',
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
  }),
  /does not match approved staging project/,
);

expectFailure(
  'cloud apply rejects missing explicit credential source',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    URAI_ADMIN_SEED_RECEIPT_PATH: 'docs/release-evidence/staging.json',
  }),
  /explicit project-bound credential source/,
);

expectFailure(
  'cloud apply rejects credential project mismatch',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(PRODUCTION_PROJECT),
  }),
  /does not match target urai-admin-staging/,
);

expectFailure(
  'cloud apply rejects missing confined receipt path',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    FIREBASE_SERVICE_ACCOUNT_KEY: cloudAuthority(STAGING_PROJECT).FIREBASE_SERVICE_ACCOUNT_KEY,
  }),
  /URAI_ADMIN_SEED_RECEIPT_PATH/,
);

expectFailure(
  'cloud apply rejects ambiguous credential sources',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(STAGING_PROJECT),
    GOOGLE_APPLICATION_CREDENTIALS: '/tmp/credential.json',
  }),
  /exactly one credential source/,
);

{
  const { result, calls } = invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_STAGING_FIREBASE_PROJECT: STAGING_PROJECT,
    URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED: '1',
    URAI_ADMIN_STAGING_APPROVAL: 'APPROVE_URAI_ADMIN_STAGING',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(STAGING_PROJECT),
  });
  assert.equal(result.ok, true);
  assert.match(result.message, /project-bound cloud target/);
  assert.match(result.message, /docs\/release-evidence/);
  assert.equal(calls.spawn.length, 2);
  assert.equal(calls.spawn[1].args[0], 'scripts/seed-system-registry.mjs');
  assert.equal(calls.spawn[1].options.env.URAI_ADMIN_SEED_GUARD_PASSED, 'run-system-registry-seed.mjs');
  console.log('OK: controlled staging apply requires project-bound credential and receipt authority');
}

expectFailure(
  'seed child nonzero status propagates',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_PRODUCTION_APPROVAL: 'APPROVE_URAI_ADMIN_PRODUCTION',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(PRODUCTION_PROJECT),
  }, { seedStatus: 7 }),
  /exited with status 7/,
  7,
);

expectFailure(
  'seed child start failure propagates',
  invoke({
    URAI_ADMIN_SEED_APPLY: '1',
    URAI_ADMIN_FIREBASE_PROJECT: PRODUCTION_PROJECT,
    URAI_ADMIN_PRODUCTION_APPROVAL: 'APPROVE_URAI_ADMIN_PRODUCTION',
    URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
    URAI_ADMIN_SEED_SHA: SHA,
    ...cloudAuthority(PRODUCTION_PROJECT),
  }, { seedError: new Error('fixture start failure') }),
  /fixture start failure/,
);

console.log('OK: system registry seed guard behavior passed');
