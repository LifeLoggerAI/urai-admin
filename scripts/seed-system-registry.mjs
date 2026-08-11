#!/usr/bin/env node

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import admin from 'firebase-admin';
import { REGISTRY_EVIDENCE_DATE, SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';
import {
  prepareConfinedRegistryCloudReceiptTarget,
  validateRegistryCloudAuthority,
  writeConfinedRegistryCloudReceipt,
} from './system-registry-cloud-policy.mjs';

const PRODUCTION_PROJECT_ID = 'urai-4dc1d';
const EMULATOR_PROJECT_ID = 'urai-admin-emulator';
const SEED_CONFIRMATION = 'SEED_SYSTEM_REGISTRY';
const PRODUCTION_APPROVAL = 'APPROVE_URAI_ADMIN_PRODUCTION';
const STAGING_APPROVAL = 'APPROVE_URAI_ADMIN_STAGING';
const EMULATOR_APPROVAL = 'APPROVE_URAI_ADMIN_EMULATOR';
const CLOUD_RECEIPT_SCHEMA = 'urai-admin-system-registry-cloud-receipt-1';
const explicitProjectId = process.env.URAI_ADMIN_FIREBASE_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const projectId = explicitProjectId || PRODUCTION_PROJECT_ID;
const stagingProjectId = process.env.URAI_ADMIN_STAGING_FIREBASE_PROJECT || '';
const allowNonProduction = process.env.URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED === '1';
const emulatorMode = process.env.URAI_ADMIN_FIRESTORE_EMULATOR === '1';
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || '';
const actor = process.env.URAI_ADMIN_SEED_ACTOR || process.env.URAI_ADMIN_OWNER_EMAIL || 'system-registry-seed';
const expectedSha = process.env.URAI_ADMIN_SEED_SHA || '';
const guardPassed = process.env.URAI_ADMIN_SEED_GUARD_PASSED === 'run-system-registry-seed.mjs';
const shaPattern = /^[0-9a-f]{40}$/;
const projectPattern = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;
const loopbackEmulatorPattern = /^(?:127\.0\.0\.1|localhost|\[::1\]):[1-9][0-9]{0,4}$/;
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

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function sameValue(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

if (!guardPassed) fail('Direct seed execution is disabled. Use pnpm seed:system-registry through the guarded wrapper.');
if (process.env.URAI_ADMIN_SEED_APPLY !== '1') fail('URAI_ADMIN_SEED_APPLY=1 is required.');
if (!explicitProjectId) fail('Apply mode requires URAI_ADMIN_FIREBASE_PROJECT or NEXT_PUBLIC_FIREBASE_PROJECT_ID to explicitly select the target project.');
if (process.env.URAI_ADMIN_SEED_CONFIRM !== SEED_CONFIRMATION) fail(`URAI_ADMIN_SEED_CONFIRM must equal ${SEED_CONFIRMATION}.`);
if (!shaPattern.test(expectedSha)) fail('URAI_ADMIN_SEED_SHA must be a full lowercase 40-character SHA.');
if (!projectPattern.test(projectId)) fail(`Firebase project id is invalid: ${projectId}.`);

let actualSha;
let worktree;
let repoRoot;
try {
  actualSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  worktree = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
  repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(`Failed to inspect the current git checkout: ${reason}`);
}

if (actualSha !== expectedSha) fail(`Checked-out SHA ${actualSha} does not match URAI_ADMIN_SEED_SHA ${expectedSha}.`);
if (worktree) fail('Registry seed requires a clean worktree.');
if (!emulatorMode && emulatorHost) fail('Cloud registry seed forbids FIRESTORE_EMULATOR_HOST.');

if (emulatorMode) {
  if (projectId !== EMULATOR_PROJECT_ID) fail(`Emulator seed target must exactly equal ${EMULATOR_PROJECT_ID}.`);
  if (!loopbackEmulatorPattern.test(emulatorHost)) {
    fail('Emulator seed requires FIRESTORE_EMULATOR_HOST to be an explicit loopback host and port.');
  }
  if (process.env.URAI_ADMIN_EMULATOR_APPROVAL !== EMULATOR_APPROVAL) {
    fail(`Emulator seed requires URAI_ADMIN_EMULATOR_APPROVAL=${EMULATOR_APPROVAL}.`);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    fail('Emulator seed forbids cloud service-account credentials.');
  }
} else if (projectId === PRODUCTION_PROJECT_ID) {
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

let cloudAuthority = null;
let preparedCloudReceipt = null;
if (!emulatorMode) {
  try {
    cloudAuthority = validateRegistryCloudAuthority({ env: process.env, projectId });
    preparedCloudReceipt = prepareConfinedRegistryCloudReceiptTarget({
      receiptPath: cloudAuthority.receiptPath,
      repoRoot,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Cloud authority or immutable receipt preflight failed before mutation: ${reason}`);
  }
}

const validatedCloudCredential = cloudAuthority?.credential || null;
const validatedCloudCredentialDigest = validatedCloudCredential
  ? crypto.createHash('sha256').update(JSON.stringify(stable(validatedCloudCredential))).digest('hex')
  : null;

if (admin.apps.length) fail('Registry seed requires a fresh process with no preinitialized Firebase Admin app.');
if (emulatorMode) {
  admin.initializeApp({ projectId });
} else {
  if (validatedCloudCredential?.type !== 'external_account') {
    fail('Cloud registry seed requires validated WIF external_account ADC.');
  }
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Validated WIF/ADC identity could not initialize Firebase Admin: ${reason}`);
  }
}

const firestore = admin.firestore();
const registryCollection = firestore.collection('systemRegistry');
const eventRef = firestore.collection('adminOperationalEvents').doc();
const now = admin.firestore.FieldValue.serverTimestamp();
const registryDigest = crypto
  .createHash('sha256')
  .update(JSON.stringify({ evidenceDate: REGISTRY_EVIDENCE_DATE, records: SYSTEM_REGISTRY_RECORDS }))
  .digest('hex');

let preflightExistingCount = 0;
let unexpectedRegistryIds = [];
try {
  await firestore.runTransaction(async (transaction) => {
    const existingRegistry = await transaction.get(registryCollection);
    preflightExistingCount = existingRegistry.size;
    unexpectedRegistryIds = existingRegistry.docs
      .map((doc) => doc.id)
      .filter((id) => !ids.has(id))
      .sort();

    if (unexpectedRegistryIds.length) {
      throw new Error(`Refusing to seed while unexpected systemRegistry documents exist: ${unexpectedRegistryIds.join(', ')}.`);
    }

    for (const system of SYSTEM_REGISTRY_RECORDS) {
      transaction.set(registryCollection.doc(system.id), {
        ...system,
        registryEvidenceDate: REGISTRY_EVIDENCE_DATE,
        registryDigest,
        sourceSha: expectedSha,
        seededBy: 'scripts/seed-system-registry.mjs',
        seededActor: actor,
        updatedAt: now,
      }, { merge: false });
    }

    transaction.set(eventRef, {
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
        emulatorMode,
        preflightExistingCount,
      },
      createdAt: now,
    });
  });
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(`Atomic registry preflight and mutation failed: ${reason}`);
}

let verifiedRegistry;
let verifiedEvent;
try {
  [verifiedRegistry, verifiedEvent] = await Promise.all([
    registryCollection.get(),
    eventRef.get(),
  ]);
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(`Registry mutation committed but post-commit read-back failed: ${reason}`);
}

if (verifiedRegistry.size !== SYSTEM_REGISTRY_RECORDS.length) {
  fail(`Post-commit registry count ${verifiedRegistry.size} does not equal ${SYSTEM_REGISTRY_RECORDS.length}.`);
}
const verifiedById = new Map(verifiedRegistry.docs.map((doc) => [doc.id, doc.data()]));
for (const expected of SYSTEM_REGISTRY_RECORDS) {
  const observed = verifiedById.get(expected.id);
  if (!observed) fail(`Post-commit registry is missing ${expected.id}.`);
  for (const field of requiredFields) {
    if (!sameValue(observed[field], expected[field])) {
      fail(`Post-commit registry field mismatch for ${expected.id}.${field}.`);
    }
  }
  if (observed.registryEvidenceDate !== REGISTRY_EVIDENCE_DATE) fail(`Post-commit evidence date mismatch for ${expected.id}.`);
  if (observed.registryDigest !== registryDigest) fail(`Post-commit digest mismatch for ${expected.id}.`);
  if (observed.sourceSha !== expectedSha) fail(`Post-commit source SHA mismatch for ${expected.id}.`);
  if (observed.seededBy !== 'scripts/seed-system-registry.mjs') fail(`Post-commit seededBy mismatch for ${expected.id}.`);
}

if (!verifiedEvent.exists) fail('Post-commit operational event is missing.');
const event = verifiedEvent.data();
if (event?.action !== 'systemRegistry.seed') fail('Post-commit operational event action mismatch.');
if (event?.metadata?.projectId !== projectId) fail('Post-commit operational event project mismatch.');
if (event?.metadata?.registryDigest !== registryDigest) fail('Post-commit operational event digest mismatch.');
if (event?.metadata?.sourceSha !== expectedSha) fail('Post-commit operational event source SHA mismatch.');
if (event?.metadata?.count !== SYSTEM_REGISTRY_RECORDS.length) fail('Post-commit operational event count mismatch.');

if (cloudAuthority) {
  const receipt = {
    schemaVersion: CLOUD_RECEIPT_SCHEMA,
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY || 'LifeLoggerAI/urai-admin',
    exactSha: expectedSha,
    projectId,
    environment: projectId === PRODUCTION_PROJECT_ID ? 'production' : 'staging',
    registryDigest,
    expectedRegistryCount: SYSTEM_REGISTRY_RECORDS.length,
    observedRegistryCount: verifiedRegistry.size,
    operationalEventId: eventRef.id,
    credentialSource: cloudAuthority.credentialSource,
    credentialProjectId: cloudAuthority.credentialProjectId,
    credentialMaterialDigest: validatedCloudCredentialDigest,
    credentialProjectVerified: true,
    credentialConfigurationVerifiedBeforeInitialization: true,
    atomicPreflightAndMutationVerified: true,
    postCommitReadbackVerified: true,
    unexpectedRegistryIdsBeforeMutation: unexpectedRegistryIds,
    productionMutationPerformed: projectId === PRODUCTION_PROJECT_ID,
    stagingMutationPerformed: projectId !== PRODUCTION_PROJECT_ID,
    emulatorMode: false,
    secretValuesIncluded: false,
  };
  try {
    const writtenPath = writeConfinedRegistryCloudReceipt({
      receiptPath: cloudAuthority.receiptPath,
      content: `${JSON.stringify(receipt, null, 2)}\n`,
      repoRoot,
    });
    if (writtenPath !== preparedCloudReceipt?.absolutePath) {
      fail('Cloud receipt path changed between preflight and exclusive creation.');
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Registry mutation committed and verified, but immutable receipt creation failed: ${reason}`);
  }
}

const targetKind = emulatorMode ? 'isolated emulator' : projectId;
const receiptMessage = cloudAuthority ? ` Receipt: ${cloudAuthority.receiptPath}.` : '';
console.log(`Seeded and read-back verified ${SYSTEM_REGISTRY_RECORDS.length} canonical URAI registry records into ${targetKind} at ${expectedSha}. Digest: ${registryDigest}.${receiptMessage}`);
