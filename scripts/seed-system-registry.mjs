#!/usr/bin/env node

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import admin from 'firebase-admin';
import { REGISTRY_EVIDENCE_DATE, SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';

const PRODUCTION_PROJECT_ID = 'urai-4dc1d';
const SEED_CONFIRMATION = 'SEED_SYSTEM_REGISTRY';
const PRODUCTION_APPROVAL = 'APPROVE_URAI_ADMIN_PRODUCTION';
const STAGING_APPROVAL = 'APPROVE_URAI_ADMIN_STAGING';
const explicitProjectId = process.env.URAI_ADMIN_FIREBASE_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const projectId = explicitProjectId || PRODUCTION_PROJECT_ID;
const stagingProjectId = process.env.URAI_ADMIN_STAGING_FIREBASE_PROJECT || '';
const allowNonProduction = process.env.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED === '1';
const actor = process.env.URAI_ADMIN_SEED_ACTOR || process.env.URAI_ADMIN_OWNER_EMAIL || 'system-registry-seed';
const expectedSha = process.env.URAI_ADMIN_SEED_SHA || '';
const guardPassed = process.env.URAI_ADMIN_SEED_GUARD_PASSED === 'run-system-registry-seed.mjs';
const shaPattern = /^[0-9a-f]{40}$/;
const projectPattern = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;
const allowedStatuses = new Set(['not_connected', 'blocked', 'staging_ready', 'production_ready', 'degraded']);
const requiredFields = [
  'id', 'name', 'repo', 'runtime', 'owner', 'status', 'productionUrl', 'stagingUrl',
  'firebaseTarget', 'lastReleaseSha', 'rollbackSha', 'lastSmokeResult', 'healthEndpoint',
  'monitoringUrl', 'requiredSecrets', 'knownBlockers', 'integrationContracts', 'dataBoundary',
  'privacyClassification', 'operationalRisk', 'evidenceLinks',
];

function fail(message) {
  console.error(`[system-registry-seed] ${message}`);
  process.exit(1);
}

if (!guardPassed) fail('Direct seed execution is disabled. Use pnpm seed:system-registry through the guarded wrapper.');
if (process.env.URAI_ADMIN_SEED_APPLY !== '1') fail('URAI_ADMIN_SEED_APPLY=1 is required.');
if (!explicitProjectId) fail('Apply mode requires URAI_ADMIN_FIREBASE_PROJECT or NEXT_PUBLIC_FIREBASE_PROJECT_ID to explicitly select the target project.');
if (process.env.URAI_ADMIN_SEED_CONFIRM !== SEED_CONFIRMATION) fail(`URAI_ADMIN_SEED_CONFIRM must equal ${SEED_CONFIRMATION}.`);
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

if (projectId === PRODUCTION_PROJECT_ID) {
  if (process.env.URAI_ADMIN_PRODUCTION_APPROVAL !== PRODUCTION_APPROVAL) {
    fail(`Production seed requires URAI_ADMIN_PRODUCTION_APPROVAL=${PRODUCTION_APPROVAL}.`);
  }
} else {
  if (!stagingProjectId) fail('Non-production seed requires URAI_ADMIN_STAGING_FIREBASE_PROJECT to name the approved staging project.');
  if (projectId !== stagingProjectId) fail(`Non-production target ${projectId} does not match approved staging project ${stagingProjectId}.`);
  if (!allowNonProduction) fail('Non-production seed requires URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1.');
  if (process.env.URAI_ADMIN_STAGING_APPROVAL !== STAGING_APPROVAL) {
    fail(`Non-production seed requires URAI_ADMIN_STAGING_APPROVAL=${STAGING_APPROVAL}.`);
  }
}

const ids = new Set();
for (const record of SYSTEM_REGISTRY_RECORDS) {
  for (const field of requiredFields) {
    if (!(field in record)) fail(`Registry record ${record.id || '<unknown>'} is missing ${field}.`);
  }
  if (!record.id || ids.has(record.id)) fail(`Registry record id is missing or duplicated: ${record.id || '<empty>'}.`);
  ids.add(record.id);
  if (!allowedStatuses.has(record.status)) fail(`Registry record ${record.id} has unsupported status ${record.status}.`);
  if (record.repo.includes('*')) fail(`Registry record ${record.id} contains forbidden wildcard repository authority.`);
  if (record.status === 'production_ready' && (!record.lastReleaseSha || !record.rollbackSha || record.lastSmokeResult !== 'pass' || !record.monitoringUrl)) {
    fail(`Registry record ${record.id} cannot be production_ready without deployed SHA, rollback SHA, passing smoke and monitoring evidence.`);
  }
}

if (!SYSTEM_REGISTRY_RECORDS.some((record) => record.repo === 'LifeLoggerAI/urai-spatial')) {
  fail('Canonical urai-spatial authority is missing from registry data.');
}

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch {
    fail('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }
  if (!serviceAccount || typeof serviceAccount !== 'object' || typeof serviceAccount.project_id !== 'string') {
    fail('FIREBASE_SERVICE_ACCOUNT_KEY must contain a project_id.');
  }
  if (serviceAccount.project_id !== projectId) {
    fail(`Service-account project ${serviceAccount.project_id} does not match target ${projectId}.`);
  }
}

if (!admin.apps.length) {
  admin.initializeApp(serviceAccount
    ? { credential: admin.credential.cert(serviceAccount), projectId }
    : { projectId });
}

const firestore = admin.firestore();
const now = admin.firestore.FieldValue.serverTimestamp();
const registryDigest = crypto
  .createHash('sha256')
  .update(JSON.stringify({ evidenceDate: REGISTRY_EVIDENCE_DATE, records: SYSTEM_REGISTRY_RECORDS }))
  .digest('hex');

let existingRegistry;
try {
  existingRegistry = await firestore.collection('systemRegistry').get();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(`Failed to inspect existing systemRegistry documents before mutation: ${reason}`);
}

const unexpectedRegistryIds = existingRegistry.docs
  .map((doc) => doc.id)
  .filter((id) => !ids.has(id))
  .sort();
if (unexpectedRegistryIds.length) {
  fail(`Refusing to seed while unexpected systemRegistry documents exist: ${unexpectedRegistryIds.join(', ')}.`);
}

const batch = firestore.batch();
for (const system of SYSTEM_REGISTRY_RECORDS) {
  batch.set(firestore.collection('systemRegistry').doc(system.id), {
    ...system,
    registryEvidenceDate: REGISTRY_EVIDENCE_DATE,
    registryDigest,
    sourceSha: expectedSha,
    seededBy: 'scripts/seed-system-registry.mjs',
    seededActor: actor,
    updatedAt: now,
  }, { merge: false });
}

batch.set(firestore.collection('adminOperationalEvents').doc(), {
  actor,
  action: 'systemRegistry.seed',
  target: { type: 'collection', id: 'systemRegistry' },
  metadata: {
    projectId,
    count: SYSTEM_REGISTRY_RECORDS.length,
    evidenceDate: REGISTRY_EVIDENCE_DATE,
    registryDigest,
    sourceSha: expectedSha,
    script: 'scripts/seed-system-registry.mjs',
    allowNonProduction,
    preflightExistingCount: existingRegistry.size,
  },
  createdAt: now,
});

await batch.commit();
console.log(`Seeded ${SYSTEM_REGISTRY_RECORDS.length} canonical URAI registry records into ${projectId} at ${expectedSha}. Digest: ${registryDigest}`);
