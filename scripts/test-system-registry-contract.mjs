#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const seed = readFileSync('scripts/seed-system-registry.mjs', 'utf8');
const docs = readFileSync('docs/SYSTEM_OF_SYSTEMS.md', 'utf8');
const page = readFileSync('apps/urai-admin/app/admin/system/page.jsx', 'utf8');
const failures = [];

const requiredSystems = [
  'URAI Main Experience',
  'URAI Admin',
  'URAI Analytics',
  'URAI Communications',
  'URAI Privacy',
  'URAI Foundation',
  'URAI Spatial',
  'URAI Studio',
  'URAI Jobs',
  'URAI Investors',
  'URAI Marketing',
  'URAI Asset Factory',
  'URAI B2B Portal',
];

const requiredFields = [
  'id',
  'name',
  'repo',
  'runtime',
  'owner',
  'status',
  'productionUrl',
  'stagingUrl',
  'firebaseTarget',
  'lastReleaseSha',
  'lastSmokeResult',
  'healthEndpoint',
  'requiredSecrets',
  'knownBlockers',
  'integrationContracts',
  'dataBoundary',
  'privacyClassification',
  'operationalRisk',
  'updatedAt',
];

for (const system of requiredSystems) {
  if (!seed.includes(system)) failures.push(`seed script missing system: ${system}`);
  if (!docs.includes(system)) failures.push(`system docs missing system: ${system}`);
}

for (const field of requiredFields) {
  if (!seed.includes(field)) failures.push(`seed script missing registry field: ${field}`);
}

for (const status of ['not_connected', 'blocked', 'unknown']) {
  if (!seed.includes(status)) failures.push(`seed script missing safe default status/result: ${status}`);
}

if (!seed.includes('adminOperationalEvents')) failures.push('seed script must write adminOperationalEvents audit evidence');
if (!seed.includes('URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED')) failures.push('seed script must include staging override guard');
if (!page.includes('systemRegistry')) failures.push('admin system page must read or mention systemRegistry live source');
if (!page.includes('Not connected') && !page.includes('not connected')) failures.push('admin system page must preserve safe not-connected display');

if (failures.length) {
  console.error('System registry contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: System registry contract passed.');
