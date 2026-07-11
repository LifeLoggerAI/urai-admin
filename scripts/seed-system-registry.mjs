#!/usr/bin/env node

import crypto from 'node:crypto';
import process from 'node:process';
import admin from 'firebase-admin';
import { REGISTRY_EVIDENCE_DATE, SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';

const projectId = process.env.URAI_ADMIN_FIREBASE_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'urai-4dc1d';
const allowNonProduction = process.env.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED === '1';
const actor = process.env.URAI_ADMIN_SEED_ACTOR || process.env.URAI_ADMIN_OWNER_EMAIL || 'system-registry-seed';
const expectedSha = process.env.URAI_ADMIN_SEED_SHA || '';
const guardPassed = process.env.URAI_ADMIN_SEED_GUARD_PASSED === 'run-system-registry-seed.mjs';
const shaPattern = /^[0-9a-f]{40}$/;
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
if (process.env.URAI_ADMIN_SEED_CONFIRM !== 'SEED_SYSTEM_REGISTRY') fail('URAI_ADMIN_SEED_CONFIRM must equal SEED_SYSTEM_REGISTRY.');
if (!shaPattern.test(expectedSha)) fail('URAI_ADMIN_SEED_SHA must be a full lowercase 40-character SHA.');
if (projectId !== 'urai-4dc1d' && !allowNonProduction) fail(`Refusing to seed non-production project ${projectId} without URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1.`);

const ids = new Set();
for (const record of SYSTEM_REGISTRY_RECORDS) {
  for (const field of requiredFields) {
    if (!(field in record)) fail(`Registry record ${record.id || '<unknown>'} is missing ${field}.`);
  }
  if (!record.id || ids.has(record.id)) fail(`Registry record id is missing or duplicated: ${record.id || '<empty>'}.`);
  ids.add(record.id);
  if (!allowedStatuses.has(record.status)) fail(`Registry record ${record.id} has unsupported status ${record.status}.`);
  if (record.status === 'production_ready' && (!record.lastReleaseSha || !record.rollbackSha || record.lastSmokeResult !== 'pass' || !record.monitoringUrl)) {
    fail(`Registry record ${record.id} cannot be production_ready without deployed SHA, rollback SHA, passing smoke and monitoring evidence.`);
  }
}

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch {
    fail('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }
  if (serviceAccount.project_id && serviceAccount.project_id !== projectId) {
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
  },
  createdAt: now,
});

await batch.commit();
console.log(`Seeded ${SYSTEM_REGISTRY_RECORDS.length} canonical URAI registry records into ${projectId} at ${expectedSha}. Digest: ${registryDigest}`);
