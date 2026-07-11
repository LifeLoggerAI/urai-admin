#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';
import { SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';

const PROJECT_ID = 'urai-admin-emulator';
const EMULATOR_APPROVAL = 'APPROVE_URAI_ADMIN_EMULATOR';
const RECEIPT_SCHEMA = 'urai-admin-system-registry-emulator-receipt-1';
const DEFAULT_RECEIPT_PATH = 'docs/release-evidence/admin-system-registry-emulator-receipt.json';
const shaPattern = /^[0-9a-f]{40}$/;
const digestPattern = /^[0-9a-f]{64}$/;
const loopbackEmulatorPattern = /^(?:127\.0\.0\.1|localhost|\[::1\]):[1-9][0-9]{0,4}$/;

function fail(message) {
  console.error(`[system-registry-emulator-receipt] ${message}`);
  process.exit(1);
}

function run(command, args, env = process.env) {
  try {
    return execFileSync(command, args, {
      cwd: process.cwd(),
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    const stdout = error && typeof error === 'object' && 'stdout' in error ? String(error.stdout || '') : '';
    const stderr = error && typeof error === 'object' && 'stderr' in error ? String(error.stderr || '') : '';
    fail(`Command failed: ${command} ${args.join(' ')}\n${stdout}\n${stderr}`.trim());
  }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function sameState(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || '';
if (!loopbackEmulatorPattern.test(emulatorHost)) {
  fail('FIRESTORE_EMULATOR_HOST must name an explicit loopback host and port. Start this through Firebase emulators:exec.');
}
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  fail('Cloud service-account credentials are forbidden for the emulator receipt.');
}

const exactSha = run('git', ['rev-parse', 'HEAD']);
if (!shaPattern.test(exactSha)) fail(`Checked-out SHA is invalid: ${exactSha}`);
const worktree = run('git', ['status', '--porcelain']);
if (worktree) fail('Emulator receipt requires a clean worktree before execution.');

const app = admin.initializeApp({ projectId: PROJECT_ID }, `system-registry-receipt-${process.pid}`);
const firestore = app.firestore();

async function snapshotState() {
  const [registry, events] = await Promise.all([
    firestore.collection('systemRegistry').orderBy(admin.firestore.FieldPath.documentId()).get(),
    firestore.collection('adminOperationalEvents').orderBy(admin.firestore.FieldPath.documentId()).get(),
  ]);
  return {
    registryCount: registry.size,
    registryIds: registry.docs.map((doc) => doc.id),
    operationalEventCount: events.size,
    operationalEventIds: events.docs.map((doc) => doc.id),
  };
}

const guardedBaseEnv = {
  ...process.env,
  URAI_ADMIN_FIRESTORE_EMULATOR: '1',
  URAI_ADMIN_FIREBASE_PROJECT: PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT_ID,
  URAI_ADMIN_EMULATOR_APPROVAL: EMULATOR_APPROVAL,
  URAI_ADMIN_SEED_CONFIRM: 'SEED_SYSTEM_REGISTRY',
  URAI_ADMIN_SEED_SHA: exactSha,
  URAI_ADMIN_SEED_ACTOR: 'system-registry-emulator-receipt',
};
delete guardedBaseEnv.FIREBASE_SERVICE_ACCOUNT_KEY;
delete guardedBaseEnv.GOOGLE_APPLICATION_CREDENTIALS;
delete guardedBaseEnv.URAI_ADMIN_PRODUCTION_APPROVAL;
delete guardedBaseEnv.URAI_ADMIN_STAGING_APPROVAL;
delete guardedBaseEnv.URAI_ADMIN_STAGING_FIREBASE_PROJECT;
delete guardedBaseEnv.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED;

const before = await snapshotState();
if (before.registryCount !== 0 || before.operationalEventCount !== 0) {
  fail('Emulator namespace is not empty. Restart the disposable Firestore emulator before generating a receipt.');
}

const initialDryRunEnv = { ...guardedBaseEnv };
delete initialDryRunEnv.URAI_ADMIN_SEED_APPLY;
const initialDryRunOutput = run(process.execPath, ['scripts/run-system-registry-seed.mjs'], initialDryRunEnv);
const afterInitialDryRun = await snapshotState();
if (!sameState(before, afterInitialDryRun)) {
  fail('Initial dry run mutated the Firestore emulator.');
}

const applyOutput = run(process.execPath, ['scripts/run-system-registry-seed.mjs'], {
  ...guardedBaseEnv,
  URAI_ADMIN_SEED_APPLY: '1',
});

const [registrySnapshot, eventSnapshot] = await Promise.all([
  firestore.collection('systemRegistry').orderBy(admin.firestore.FieldPath.documentId()).get(),
  firestore.collection('adminOperationalEvents').where('action', '==', 'systemRegistry.seed').get(),
]);

if (registrySnapshot.size !== SYSTEM_REGISTRY_RECORDS.length) {
  fail(`Expected ${SYSTEM_REGISTRY_RECORDS.length} registry records after apply, observed ${registrySnapshot.size}.`);
}
if (eventSnapshot.size !== 1) {
  fail(`Expected one systemRegistry.seed operational event, observed ${eventSnapshot.size}.`);
}

const expectedIds = SYSTEM_REGISTRY_RECORDS.map((record) => record.id).sort();
const observedIds = registrySnapshot.docs.map((doc) => doc.id).sort();
if (JSON.stringify(expectedIds) !== JSON.stringify(observedIds)) {
  fail('Applied emulator registry IDs do not match the canonical registry set.');
}

const digests = new Set();
for (const doc of registrySnapshot.docs) {
  const data = doc.data();
  if (data.sourceSha !== exactSha) fail(`Registry record ${doc.id} does not bind exact source SHA.`);
  if (data.seededBy !== 'scripts/seed-system-registry.mjs') fail(`Registry record ${doc.id} has unexpected seededBy authority.`);
  if (!digestPattern.test(String(data.registryDigest || ''))) fail(`Registry record ${doc.id} lacks a valid registry digest.`);
  digests.add(data.registryDigest);
}
if (digests.size !== 1) fail('Applied registry records do not share one immutable registry digest.');
const [registryDigest] = [...digests];

const afterApply = await snapshotState();
const postApplyDryRunEnv = { ...guardedBaseEnv };
delete postApplyDryRunEnv.URAI_ADMIN_SEED_APPLY;
const postApplyDryRunOutput = run(process.execPath, ['scripts/run-system-registry-seed.mjs'], postApplyDryRunEnv);
const afterPostApplyDryRun = await snapshotState();
if (!sameState(afterApply, afterPostApplyDryRun)) {
  fail('Post-apply dry run mutated the Firestore emulator.');
}

const seedEvent = eventSnapshot.docs[0].data();
if (seedEvent.metadata?.projectId !== PROJECT_ID || seedEvent.metadata?.emulatorMode !== true) {
  fail('Operational event does not bind the isolated emulator project and emulator mode.');
}
if (seedEvent.metadata?.sourceSha !== exactSha || seedEvent.metadata?.registryDigest !== registryDigest) {
  fail('Operational event does not bind the exact source SHA and registry digest.');
}

const receipt = {
  schemaVersion: RECEIPT_SCHEMA,
  generatedAt: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY || 'LifeLoggerAI/urai-admin',
  exactSha,
  projectId: PROJECT_ID,
  emulatorHost,
  registryDigest,
  expectedRegistryCount: SYSTEM_REGISTRY_RECORDS.length,
  before,
  afterInitialDryRun,
  afterApply,
  afterPostApplyDryRun,
  initialDryRunOutput,
  applyOutput,
  postApplyDryRunOutput,
  dryRunNonMutation: sameState(before, afterInitialDryRun) && sameState(afterApply, afterPostApplyDryRun),
  guardedApplyMutation: afterApply.registryCount === SYSTEM_REGISTRY_RECORDS.length && afterApply.operationalEventCount === 1,
  exactSourceBinding: registrySnapshot.docs.every((doc) => doc.data().sourceSha === exactSha),
  productionMutationPerformed: false,
  stagingAuthorityAsserted: false,
  serviceAccountCredentialUsed: false,
};

const receiptPath = process.env.URAI_ADMIN_EMULATOR_RECEIPT_PATH || DEFAULT_RECEIPT_PATH;
mkdirSync(dirname(receiptPath), { recursive: true });
writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
await app.delete();
console.log(`[system-registry-emulator-receipt] PASS: ${receiptPath}`);
