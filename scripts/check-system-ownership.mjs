#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';

const failures = [];

function fail(message) {
  failures.push(message);
}

function requireFile(path) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    fail(`Missing required file: ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const content = requireFile(path);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`Invalid JSON in ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function includesAll(haystack, needles, context) {
  for (const needle of needles) {
    if (!haystack.includes(needle)) fail(`${context} missing ${needle}`);
  }
}

console.log('--- Checking URAI system ownership boundaries ---');

const manifest = readJson('config/system-ownership.manifest.json');
const packageJson = readJson('package.json');
const adminCollectionRoute = requireFile('apps/urai-admin/src/app/api/admin/collection/route.ts');
const deployScript = requireFile('scripts/deploy-production.sh');
const launchScript = requireFile('scripts/launch-production.sh');
const reconciliationDoc = requireFile('docs/SYSTEM_OF_SYSTEMS_RECONCILIATION.md');

if (manifest?.firebaseProject !== 'urai-4dc1d') {
  fail('Ownership manifest must target firebaseProject urai-4dc1d');
}

if (manifest?.currentRepo !== 'LifeLoggerAI/urai-admin') {
  fail('Ownership manifest currentRepo must be LifeLoggerAI/urai-admin');
}

if (manifest?.resourcePolicy?.adminDeploysMustNotDeleteSharedFunctions !== true) {
  fail('Manifest must prohibit admin deploys deleting shared functions');
}

if (manifest?.resourcePolicy?.adminDeploysMustNotDeleteSharedIndexes !== true) {
  fail('Manifest must prohibit admin deploys deleting shared indexes');
}

const owners = manifest?.owners ?? {};
const adminOwner = owners['LifeLoggerAI/urai-admin'];
if (!adminOwner) fail('Manifest must define LifeLoggerAI/urai-admin owner block');

const adminFunctions = adminOwner?.functions ?? [];
for (const fn of ['aggregateAnalytics', 'api_health', 'admin_whoami', 'nextServer']) {
  if (!adminFunctions.includes(fn)) fail(`Admin owner block must include function ${fn}`);
}

const sharedFunctions = manifest?.knownSharedLiveFunctionsNotOwnedByAdmin ?? [];
for (const fn of sharedFunctions) {
  if (adminFunctions.includes(fn)) fail(`Shared function ${fn} must not be listed as owned by urai-admin`);
}

const sharedIndexCollections = manifest?.knownSharedIndexesNotOwnedByAdmin ?? [];
if (sharedIndexCollections.length < 10) {
  fail('Manifest shared index list is unexpectedly small');
}

includesAll(adminCollectionRoute, ['privacyRequests', 'SENSITIVE_KEY_PATTERN', 'REDACTED', 'Cache-Control', 'no-store'], 'admin collection route');
includesAll(deployScript, ['pnpm launch:production'], 'deploy-production.sh');
includesAll(launchScript, ['pnpm run deploy', 'pnpm smoke-test', 'pnpm verify:production'], 'launch-production.sh');
includesAll(reconciliationDoc, ['LifeLoggerAI/UrAi', 'LifeLoggerAI/UrAiProd', 'LifeLoggerAI/asset-factory', 'must not delete'], 'system reconciliation doc');

const scripts = packageJson?.scripts ?? {};
if (!String(scripts['check:ownership'] ?? '').includes('check-system-ownership.mjs')) {
  fail('package.json must expose check:ownership');
}
if (!String(scripts['release:lock'] ?? '').includes('check:ownership')) {
  fail('release:lock must include check:ownership');
}

const adminDeployCommand = String(scripts.deploy ?? '');
if (!adminDeployCommand.includes('firebase deploy')) {
  fail('deploy script must remain the raw Firebase deploy command used by launch-production.sh');
}
if (adminDeployCommand.includes('--force')) {
  fail('deploy script must not use --force because it can bypass destructive prompts');
}
if (adminDeployCommand.includes('functions:delete')) {
  fail('deploy script must not delete functions');
}

if (failures.length) {
  console.error('System ownership check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: System ownership boundaries are documented and guarded.');
