#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { REGISTRY_EVIDENCE_DATE, SYSTEM_REGISTRY_RECORDS } from './system-registry-data.mjs';

const seed = readFileSync('scripts/seed-system-registry.mjs', 'utf8');
const wrapper = readFileSync('scripts/run-system-registry-seed.mjs', 'utf8');
const guardTests = readFileSync('scripts/test-system-registry-seed-guard.mjs', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const docs = readFileSync('docs/SYSTEM_OF_SYSTEMS.md', 'utf8');
const page = readFileSync('apps/urai-admin/src/app/admin/system/page.tsx', 'utf8');
const collectionTable = readFileSync('apps/urai-admin/src/app/admin/_components/AdminCollectionTable.tsx', 'utf8');
const collectionRoute = readFileSync('apps/urai-admin/src/app/api/admin/collection/route.ts', 'utf8');
const failures = [];

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
if (!seed.includes('unexpectedRegistryIds')) failures.push('seed child must reject unexpected stale registry documents before mutation');
if (!wrapper.includes('export function runSystemRegistrySeed')) failures.push('wrapper must expose dependency-injected guard execution for behavioral tests');
if (!wrapper.includes("git', ['status', '--porcelain']")) failures.push('wrapper must require a clean worktree');
if (!wrapper.includes('APPROVE_URAI_ADMIN_PRODUCTION')) failures.push('wrapper must require explicit production approval');
if (!wrapper.includes('APPROVE_URAI_ADMIN_STAGING')) failures.push('wrapper must require explicit staging approval');
if (!wrapper.includes('URAI_ADMIN_STAGING_FIREBASE_PROJECT')) failures.push('wrapper must bind non-production writes to an explicitly approved staging project');
if (!wrapper.includes('serviceAccount.project_id')) failures.push('wrapper must reject service-account project mismatch');
if (!guardTests.includes('dry-run validates without spawning the seed child')) failures.push('guard tests must prove dry-run nonmutation');
if (!guardTests.includes('apply rejects legacy wildcard repository authority')) failures.push('guard tests must reject legacy wildcard authority');
if (!guardTests.includes('controlled staging apply reaches only the guarded seed child')) failures.push('guard tests must prove controlled non-production apply boundary');
if (!packageJson.scripts?.['test:registry']?.includes('test-system-registry-seed-guard.mjs')) failures.push('test:registry must execute behavioral seed guard tests');
if (!page.includes('collection="systemRegistry"')) failures.push('admin system page must read the live systemRegistry source');
if (!page.includes('Not connected')) failures.push('admin system page must preserve safe Not connected display');
if (!collectionTable.includes("| 'systemRegistry'")) failures.push('admin collection table must allow the systemRegistry collection key');
if (!collectionRoute.includes("systemRegistry: {")) failures.push('authenticated admin collection API must explicitly allowlist systemRegistry');
if (!collectionRoute.includes("collection: 'systemRegistry'")) failures.push('authenticated admin collection API must read the systemRegistry collection');

if (failures.length) {
  console.error('System registry contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`OK: System registry contract passed for ${SYSTEM_REGISTRY_RECORDS.length} records at evidence date ${REGISTRY_EVIDENCE_DATE}.`);
