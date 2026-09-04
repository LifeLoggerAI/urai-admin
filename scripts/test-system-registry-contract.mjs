#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { REGISTRY_EVIDENCE_DATE, SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';

const seed = readFileSync('scripts/seed-system-registry.mjs', 'utf8');
const wrapper = readFileSync('scripts/run-system-registry-seed.mjs', 'utf8');
const cloudPolicy = readFileSync('scripts/system-registry-cloud-policy.mjs', 'utf8');
const cloudReceiptTests = readFileSync('scripts/test-system-registry-cloud-receipt.mjs', 'utf8');
const emulatorReceipt = readFileSync('scripts/run-system-registry-emulator-receipt.mjs', 'utf8');
const guardTests = readFileSync('scripts/test-system-registry-seed-guard.mjs', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const docs = readFileSync('docs/SYSTEM_OF_SYSTEMS.md', 'utf8');
const terminalCommands = readFileSync('docs/PRODUCTION_TERMINAL_COMMANDS.md', 'utf8');
const page = readFileSync('apps/urai-admin/src/app/admin/system/page.tsx', 'utf8');
const collectionTable = readFileSync('apps/urai-admin/src/app/admin/_components/AdminCollectionTable.tsx', 'utf8');
const collectionRoute = readFileSync('apps/urai-admin/src/app/api/admin/collection/route.ts', 'utf8');
const adminCi = readFileSync('.github/workflows/ci.yml', 'utf8');
const validateAdmin = readFileSync('.github/workflows/validate-admin.yml', 'utf8');
const productionVerify = readFileSync('.github/workflows/urai-production-verify.yml', 'utf8');
const failures = [];

const executableCloudEmulatorGuard = /^\s*if\s*\(\s*!emulatorMode\s*&&\s*emulatorHost\s*\)\s*fail\(\s*['"]Cloud registry seed forbids FIRESTORE_EMULATOR_HOST\.['"]\s*\)\s*;?\s*$/m;
const cloudEmulatorGuardMatch = executableCloudEmulatorGuard.exec(seed);
const firebaseInitializationIndex = seed.indexOf('admin.initializeApp(');
const validatedCredentialIndex = seed.indexOf('const validatedCloudCredential =');
const boundCredentialInitializationIndex = seed.indexOf('credential: admin.credential.applicationDefault()');

const requiredSystems = [
  'URAI Main Experience', 'URAI Admin', 'URAI Analytics', 'URAI Communications',
  'URAI Privacy', 'URAI Foundation', 'URAI Spatial', 'URAI Studio', 'URAI Jobs',
  'URAI Investors', 'URAI Marketing', 'URAI Asset Factory', 'URAI Content',
  'URAI B2B Portal', 'URAI Storytime', 'Legacy URAI Demo', 'Legacy Dev/Prod/Staging',
];

const requiredFields = [
  'id', 'name', 'repo', 'runtime', 'owner', 'status', 'productionUrl', 'stagingUrl',
  'firebaseTarget', 'lastReleaseSha', 'rollbackSha', 'lastSmokeResult', 'healthEndpoint',
  'monitoringUrl', 'requiredSecrets', 'knownBlockers', 'integrationContracts', 'dataBoundary',
  'privacyClassification', 'operationalRisk', 'evidenceLinks',
];

const ids = new Set();
for (const record of SYSTEM_REGISTRY_RECORDS) {
  if (ids.has(record.id)) failures.push(`duplicate registry id: ${record.id}`);
  ids.add(record.id);
  for (const field of requiredFields) {
    if (!(field in record)) failures.push(`${record.id} missing field: ${field}`);
  }
  if (record.repo.includes('*')) failures.push(`${record.id} contains wildcard repository authority`);
  if (record.status === 'production_ready') failures.push(`${record.id} must not be predeclared production_ready`);
}

for (const system of requiredSystems) {
  if (!SYSTEM_REGISTRY_RECORDS.some((record) => record.name === system)) failures.push(`registry data missing system: ${system}`);
  if (!docs.includes(system)) failures.push(`system docs missing system: ${system}`);
}

if (SYSTEM_REGISTRY_RECORDS.length !== requiredSystems.length) {
  failures.push(`registry count ${SYSTEM_REGISTRY_RECORDS.length} does not match required count ${requiredSystems.length}`);
}

if (!docs.includes(`Evidence date: ${REGISTRY_EVIDENCE_DATE}.`)) failures.push('docs evidence date must match canonical registry data');
if (docs.includes('PR #433')) failures.push('docs contain stale spatial PR #433 authority');
if (!seed.includes('SYSTEM_REGISTRY_RECORDS')) failures.push('seed must import canonical registry data');
if (!seed.includes('registryDigest')) failures.push('seed must emit immutable registry digest evidence');
if (!seed.includes('sourceSha: expectedSha')) failures.push('seed must bind records to the exact source SHA');
if (!seed.includes('{ merge: false }')) failures.push('seed must replace canonical records rather than preserve stale fields');
if (!seed.includes('URAI_ADMIN_SEED_GUARD_PASSED')) failures.push('seed child must require guarded wrapper context');
if (!seed.includes("execFileSync('git', ['rev-parse', 'HEAD']")) failures.push('seed child must independently verify the checked-out SHA');
if (!seed.includes("execFileSync('git', ['status', '--porcelain']")) failures.push('seed child must independently require a clean worktree');
if (!seed.includes('URAI_ADMIN_PRODUCTION_APPROVAL')) failures.push('seed child must independently require production approval');
if (!seed.includes('URAI_ADMIN_STAGING_FIREBASE_PROJECT')) failures.push('seed child must independently bind non-production writes to approved staging');
if (!seed.includes('URAI_ADMIN_FIRESTORE_EMULATOR')) failures.push('seed child must independently identify emulator mode');
if (!seed.includes('APPROVE_URAI_ADMIN_EMULATOR')) failures.push('seed child must independently require emulator approval');
if (!seed.includes('loopbackEmulatorPattern')) failures.push('seed child must bind emulator writes to loopback');
if (!seed.includes('Emulator seed forbids cloud service-account credentials')) failures.push('seed child must reject cloud credentials in emulator mode');
if (!cloudEmulatorGuardMatch) failures.push('seed child must contain an executable cloud-mode emulator-host rejection');
if (firebaseInitializationIndex === -1) failures.push('seed child must initialize Firebase Admin only after all preflight guards');
if (cloudEmulatorGuardMatch && firebaseInitializationIndex !== -1 && cloudEmulatorGuardMatch.index > firebaseInitializationIndex) {
  failures.push('seed child must reject inherited emulator routing before Firebase Admin initialization');
}
if (validatedCredentialIndex === -1) failures.push('seed child must retain the already-validated cloud credential object');
if (boundCredentialInitializationIndex === -1) failures.push('cloud Firebase initialization must use ADC only after WIF external_account validation');
if (validatedCredentialIndex !== -1 && boundCredentialInitializationIndex !== -1 && validatedCredentialIndex > boundCredentialInitializationIndex) {
  failures.push('cloud credential material must be validated and bound before Firebase Admin initialization');
}
if (seed.includes('const inlineCredential =')) failures.push('seed must not re-read file credentials through application default fallback');
if (!seed.includes('Cloud registry seed requires validated WIF external_account ADC')) failures.push('seed must reject cloud credentials that are not validated WIF external_account ADC');
if (!seed.includes('Registry seed requires a fresh process with no preinitialized Firebase Admin app')) failures.push('seed must reject preinitialized Admin state');
if (!seed.includes('credentialMaterialDigest: validatedCloudCredentialDigest')) failures.push('cloud receipt must bind the non-secret digest of validated credential material');
if (!seed.includes('credentialConfigurationVerifiedBeforeInitialization: true')) failures.push('cloud receipt must attest pre-initialization WIF credential validation');
if (!seed.includes('unexpectedRegistryIds')) failures.push('seed child must reject unexpected stale registry documents before mutation');
if (!seed.includes('conflictingRegistryRecords')) failures.push('seed child must reject conflicting live canonical records before replacement');
if (!seed.includes('Refusing to replace live registry evidence that differs from the candidate snapshot')) failures.push('seed child must fail closed on stale candidate snapshots');
if (!seed.includes('conflictingRegistryRecordsBeforeMutation')) failures.push('cloud receipt must preserve the conflict preflight result');
if (!seed.includes('candidateIsNewer')) failures.push('registry seed must allow a newer canonical evidence snapshot to replace older canonical records');
if (!seed.includes('URAI_ADMIN_REGISTRY_REPLACE_CONFIRM')) failures.push('newer candidate replacement must require an explicit operator confirmation');
if (!seed.includes('replacedOlderRegistryRecords')) failures.push('registry seed must preserve superseded evidence metadata');
if (!seed.includes('await firestore.runTransaction')) failures.push('stale-record inspection and canonical mutation must share one Firestore transaction');
if (!seed.includes('await transaction.get(registryCollection)')) failures.push('transaction must inspect the live registry before writing');
if (!seed.includes('transaction.set(registryCollection.doc')) failures.push('canonical registry writes must occur inside the transaction');
if (seed.includes('firestore.batch()')) failures.push('seed must not use a non-atomic batch after separate stale-record inspection');
if (!seed.includes('atomicPreflightAndMutationVerified: true')) failures.push('cloud receipt must attest atomic stale-record inspection and mutation');
if (!seed.includes('validateRegistryCloudAuthority')) failures.push('seed child must independently validate cloud credential and receipt authority');
if (!seed.includes('Post-commit registry field mismatch')) failures.push('seed child must verify canonical fields after commit');
if (!seed.includes('Post-commit operational event')) failures.push('seed child must verify the exact operational event after commit');
if (!seed.includes("CLOUD_RECEIPT_SCHEMA = 'urai-admin-system-registry-cloud-receipt-1'")) failures.push('seed child must emit a versioned cloud receipt');
if (!seed.includes('postCommitReadbackVerified: true')) failures.push('cloud receipt must assert exact post-commit readback');
if (!seed.includes('credentialProjectVerified: true')) failures.push('cloud receipt must assert credential project binding');
if (!seed.includes('secretValuesIncluded: false')) failures.push('cloud receipt must explicitly exclude secret values');

if (!wrapper.includes('export function runSystemRegistrySeed')) failures.push('wrapper must expose dependency-injected guard execution for behavioral tests');
if (!wrapper.includes("git', ['status', '--porcelain']")) failures.push('wrapper must require a clean worktree');
if (!wrapper.includes('APPROVE_URAI_ADMIN_PRODUCTION')) failures.push('wrapper must require explicit production approval');
if (!wrapper.includes('APPROVE_URAI_ADMIN_STAGING')) failures.push('wrapper must require explicit staging approval');
if (!wrapper.includes('URAI_ADMIN_STAGING_FIREBASE_PROJECT')) failures.push('wrapper must bind non-production writes to an explicitly approved staging project');
if (!wrapper.includes('APPROVE_URAI_ADMIN_EMULATOR')) failures.push('wrapper must require explicit emulator approval');
if (!wrapper.includes('Emulator seed target must exactly equal')) failures.push('wrapper must bind emulator writes to one fixed project id');
if (!wrapper.includes('validateRegistryCloudAuthority')) failures.push('wrapper must validate exact cloud credential and receipt authority before child execution');

for (const [phrase, description] of [
  ['explicit WIF/ADC credential file', 'cloud policy must require an explicit ephemeral ADC credential file'],
  ['requires WIF external_account ADC', 'cloud policy must reject unsupported ADC credential types'],
  ['forbids raw service-account key material', 'cloud policy must reject raw service-account key material'],
  ['does not match target', 'cloud policy must require target/impersonated-service-account project equality'],
  ['Cloud credential project', 'cloud policy must reject credential project mismatch'],
  ['docs/release-evidence/', 'cloud receipt must be confined to release evidence'],
  ['must end in .json', 'cloud receipt must be machine-readable JSON'],
]) {
  if (!cloudPolicy.includes(phrase)) failures.push(description);
}

if (!cloudReceiptTests.includes('rejects long-lived service-account credentials')) failures.push('cloud receipt tests must reject long-lived service-account credentials');
if (!cloudReceiptTests.includes('atomic stale-record/write transaction')) failures.push('cloud receipt tests must prove transaction ordering');
if (!guardTests.includes('dry-run validates without spawning the seed child')) failures.push('guard tests must prove dry-run nonmutation');
if (!guardTests.includes('apply rejects legacy wildcard repository authority')) failures.push('guard tests must reject legacy wildcard authority');
if (!guardTests.includes('controlled staging apply requires project-bound credential and receipt authority')) failures.push('guard tests must prove project-bound staging cloud authority');
if (!guardTests.includes('cloud apply rejects credential project mismatch')) failures.push('guard tests must reject credential project mismatch');
if (!guardTests.includes('cloud apply rejects missing confined receipt path')) failures.push('guard tests must require a cloud receipt path');
if (!guardTests.includes('controlled emulator apply reaches only the guarded seed child')) failures.push('guard tests must prove controlled emulator apply boundary');
if (!emulatorReceipt.includes('schemaVersion: RECEIPT_SCHEMA')) failures.push('emulator receipt must declare a versioned receipt schema');
if (!emulatorReceipt.includes('dryRunNonMutation')) failures.push('emulator receipt must prove dry-run nonmutation');
if (!emulatorReceipt.includes('guardedApplyMutation')) failures.push('emulator receipt must prove guarded apply mutation');
if (!emulatorReceipt.includes('productionMutationPerformed: false')) failures.push('emulator receipt must explicitly deny production mutation');
if (!emulatorReceipt.includes('stagingAuthorityAsserted: false')) failures.push('emulator receipt must not assert staging authority');
if (!packageJson.scripts?.['test:registry']?.includes('test-system-registry-seed-guard.mjs')) failures.push('test:registry must execute behavioral seed guard tests');
if (!packageJson.scripts?.['receipt:system-registry:emulator']?.includes('run-system-registry-emulator-receipt.mjs')) failures.push('package scripts must expose the guarded emulator receipt command');
for (const token of ['URAI_ADMIN_SEED_APPLY=1', 'URAI_ADMIN_SEED_CONFIRM', 'URAI_ADMIN_SEED_SHA', 'URAI_ADMIN_STAGING_APPROVAL', 'URAI_ADMIN_PRODUCTION_APPROVAL', 'GOOGLE_APPLICATION_CREDENTIALS', 'URAI_ADMIN_SEED_RECEIPT_PATH', 'URAI_ADMIN_REGISTRY_REPLACE_CONFIRM']) {
  if (!terminalCommands.includes(token)) failures.push(`production terminal commands missing guarded seed input: ${token}`);
}
if (!String(packageJson.packageManager || '').endsWith('e3944156c4299921a89f976381ee107d41f12cfa4b66681ca9c718f0668fa0831ed4c6d8ba56c')) failures.push('packageManager must retain the full pnpm integrity hash');
if (!page.includes('collection="systemRegistry"')) failures.push('admin system page must read the live systemRegistry source');
if (!page.includes('Not connected')) failures.push('admin system page must preserve safe Not connected display');
if (!collectionTable.includes("| 'systemRegistry'")) failures.push('admin collection table must allow the systemRegistry collection key');
if (!collectionRoute.includes('systemRegistry: {')) failures.push('authenticated admin collection API must explicitly allowlist systemRegistry');
if (!collectionRoute.includes("collection: 'systemRegistry'")) failures.push('authenticated admin collection API must read the systemRegistry collection');

for (const [name, workflow] of [
  ['URAI Admin CI', adminCi],
  ['Validate URAI Admin', validateAdmin],
  ['URAI Production Verify', productionVerify],
]) {
  if (!workflow.includes('TARGET_SHA:')) failures.push(`${name} must resolve an exact target SHA`);
  if (!workflow.includes('ref: ${{ env.TARGET_SHA }}')) failures.push(`${name} must checkout the exact target SHA`);
  if (!workflow.includes('persist-credentials: false')) failures.push(`${name} must not persist checkout credentials`);
  if (!workflow.includes('test "$(git rev-parse HEAD)" = "$TARGET_SHA"')) failures.push(`${name} must prove the checked-out SHA`);
  if (!workflow.includes('git status --porcelain --untracked-files=all')) failures.push(`${name} must prove a clean exact checkout`);
  if (!workflow.includes('pnpm install --frozen-lockfile')) failures.push(`${name} must use the frozen lockfile`);

  const concurrency = workflow.match(/\nconcurrency:\n([\s\S]*?)(?=\nenv:|\njobs:)/)?.[0] || '';
  if (!concurrency) failures.push(`${name} must define exact-head concurrency`);
  if (!concurrency.includes('github.event.pull_request.number || github.ref')) failures.push(`${name} concurrency must identify the PR or ref`);
  if (!concurrency.includes('github.event.pull_request.head.sha || github.sha')) failures.push(`${name} concurrency must isolate evidence by exact reviewed SHA`);
  if (!concurrency.includes('cancel-in-progress: true')) failures.push(`${name} must cancel superseded runs`);
}
if (!adminCi.includes('pnpm receipt:system-registry:emulator')) failures.push('URAI Admin CI must generate the isolated emulator receipt');
if (!adminCi.includes('admin-system-registry-emulator-receipt.json')) failures.push('URAI Admin CI must upload the emulator receipt JSON');
if (!adminCi.includes('retention-days: 365')) failures.push('URAI Admin CI must retain emulator evidence for 365 days');

if (failures.length) {
  console.error('System registry contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`OK: System registry contract passed for ${SYSTEM_REGISTRY_RECORDS.length} records at evidence date ${REGISTRY_EVIDENCE_DATE}.`);
