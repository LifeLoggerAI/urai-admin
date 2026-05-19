#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const requiredFiles = [
  'README.md',
  'package.json',
  'firebase.json',
  '.firebaserc',
  'firestore.rules',
  'firestore.indexes.json',
  'storage.rules',
  '.env.production.example',
  'FINAL_LOCK.md',
  'docs/ARCHITECTURE.md',
  'docs/PRODUCTION_AUDIT.md',
  'docs/DEPLOYMENT.md',
  'docs/SECURITY.md',
  'docs/ADMIN_OPERATIONS.md',
  'docs/SYSTEM_OF_SYSTEMS.md',
  'docs/TESTING.md',
  'docs/RUNBOOK.md',
  'scripts/test-firestore-rules-contract.mjs',
  'scripts/test-admin-route-contracts.mjs'
];

const requiredScripts = [
  'check:types',
  'lint',
  'test:unit',
  'test:rules',
  'test:e2e',
  'test:smoke',
  'build',
  'verify:release',
  'preflight',
  'release:lock',
  'preflight:production',
  'bootstrap:owner',
  'deploy',
  'verify:production',
  'rollback:production'
];

const requiredEnvKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'URAI_ADMIN_OWNER_UID',
  'URAI_ADMIN_OWNER_EMAIL',
  'URAI_ADMIN_FIREBASE_PROJECT',
  'URAI_ADMIN_HOSTING_SITE',
  'URAI_ADMIN_PRODUCTION_URL'
];

const requiredRuleCollections = [
  'adminUsers',
  'adminAuditLogs',
  'adminSystemHealth',
  'adminReleaseEvidence',
  'adminNotifications',
  'adminSettings',
  'adminReviewQueue',
  'adminIntegrations',
  'adminOperationalEvents',
  'partnerAccounts',
  'systemRegistry',
  'releaseSignoffs',
  'governanceEvidence'
];

const requiredRoutes = [
  '/',
  '/login',
  '/privacy',
  '/terms',
  '/admin',
  '/admin/users',
  '/admin/projects',
  '/admin/feature-flags',
  '/admin/jobs',
  '/admin/job-runs',
  '/admin/dead-letters',
  '/admin/system',
  '/admin/audit',
  '/admin/policies',
  '/admin/settings'
];

const failures = [];
const warnings = [];

function read(path) {
  return readFileSync(path, 'utf8');
}

function requireFile(path) {
  if (!existsSync(path)) failures.push(`missing required file: ${path}`);
}

for (const file of requiredFiles) requireFile(file);

if (existsSync('package.json')) {
  const pkg = JSON.parse(read('package.json'));
  for (const script of requiredScripts) {
    if (!pkg.scripts?.[script]) failures.push(`missing package script: ${script}`);
  }
}

if (existsSync('.env.production.example')) {
  const env = read('.env.production.example');
  for (const key of requiredEnvKeys) {
    if (!env.includes(`${key}=`)) failures.push(`missing env example key: ${key}`);
  }
}

if (existsSync('firestore.rules')) {
  const rules = read('firestore.rules');
  if (!rules.includes('match /{document=**}')) failures.push('firestore.rules must include catch-all deny rule');
  if (!rules.includes('allow read, write: if false')) failures.push('firestore.rules must deny by default');
  for (const collection of requiredRuleCollections) {
    if (!rules.includes(`match /${collection}/`)) failures.push(`firestore.rules missing collection rule: ${collection}`);
  }
  if (!rules.includes('allow update, delete: if false')) warnings.push('firestore.rules should explicitly block audit/event mutation');
}

if (existsSync('docs/SYSTEM_OF_SYSTEMS.md')) {
  const systems = read('docs/SYSTEM_OF_SYSTEMS.md');
  const requiredSystems = ['URAI Admin', 'URAI Analytics', 'URAI Communications', 'URAI Privacy', 'URAI Foundation', 'URAI Spatial', 'URAI Studio', 'URAI Asset Factory', 'URAI B2B Portal'];
  for (const system of requiredSystems) {
    if (!systems.includes(system)) failures.push(`SYSTEM_OF_SYSTEMS missing system: ${system}`);
  }
}

if (existsSync('FINAL_LOCK.md')) {
  const lock = read('FINAL_LOCK.md');
  if (!/Current verdict:\s*\*\*(BLOCKED|STAGING READY|PRODUCTION READY)\*\*/.test(lock)) {
    failures.push('FINAL_LOCK.md must state Current verdict as BLOCKED, STAGING READY, or PRODUCTION READY');
  }
  for (const gate of ['Clean install', 'Typecheck', 'Lint', 'Unit tests', 'Rules tests', 'E2E tests', 'Smoke tests', 'Build', 'Staging deploy', 'Owner approval']) {
    if (!lock.includes(gate)) failures.push(`FINAL_LOCK.md missing gate: ${gate}`);
  }
}

if (existsSync('README.md')) {
  const readme = read('README.md');
  for (const route of requiredRoutes) {
    if (!readme.includes(route)) warnings.push(`README route map may not mention ${route}`);
  }
  if (!readme.includes('Privacy boundary')) warnings.push('README should include privacy boundary section');
}

const secretPatterns = [
  /AIza[0-9A-Za-z_-]{35}/,
  /-----BEGIN PRIVATE KEY-----/,
  /firebase-adminsdk/,
  /ghp_[0-9A-Za-z_]{30,}/,
  /xox[baprs]-[0-9A-Za-z-]+/
];
for (const path of ['README.md', 'FINAL_LOCK.md', '.env.production.example', 'docs/DEPLOYMENT.md', 'docs/SECURITY.md']) {
  if (!existsSync(path)) continue;
  const text = read(path);
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) failures.push(`possible committed secret in ${path}`);
  }
}

if (process.env.URAI_ADMIN_VERIFIER_RUN_COMMANDS === '1') {
  for (const command of ['pnpm check:types', 'pnpm lint', 'pnpm test:unit', 'pnpm test:rules', 'pnpm build']) {
    try {
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      failures.push(`command failed: ${command}`);
    }
  }
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (failures.length) {
  console.error('\nURAI Admin release verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: URAI Admin release verifier passed.');
