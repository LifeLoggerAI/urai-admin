#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const requiredFiles = [
  'README.md',
  'package.json',
  'firebase.json',
  'apphosting.yaml',
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
  'scripts/test-admin-route-contracts.mjs',
  'scripts/test-system-registry-contract.mjs',
  'scripts/seed-system-registry.mjs',
  'scripts/smoke-test.sh',
  'scripts/verify-production-live.sh',
  'apps/urai-admin/src/app/api/health/route.ts',
  'apps/urai-admin/src/app/api/admin/collection/route.ts',
  'apps/urai-admin/src/lib/firebase/client.ts'
];

const requiredScripts = [
  'check:types', 'lint', 'test:unit', 'test:rules', 'test:e2e', 'test:registry', 'test:smoke',
  'build', 'verify:release', 'preflight', 'release:lock', 'seed:system-registry',
  'preflight:production', 'bootstrap:owner', 'deploy', 'verify:production', 'rollback:production'
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
  'adminUsers', 'adminAuditLogs', 'adminSystemHealth', 'adminReleaseEvidence', 'adminNotifications',
  'adminSettings', 'adminReviewQueue', 'adminIntegrations', 'adminOperationalEvents', 'partnerAccounts',
  'systemRegistry', 'releaseSignoffs', 'governanceEvidence'
];

const requiredAppRoutes = [
  'apps/urai-admin/src/app/page.tsx',
  'apps/urai-admin/src/app/login/page.tsx',
  'apps/urai-admin/src/app/features/page.tsx',
  'apps/urai-admin/src/app/security/page.tsx',
  'apps/urai-admin/src/app/pricing/page.tsx',
  'apps/urai-admin/src/app/contact/page.tsx',
  'apps/urai-admin/src/app/admin/page.tsx',
  'apps/urai-admin/src/app/admin/users/page.tsx',
  'apps/urai-admin/src/app/admin/projects/page.tsx',
  'apps/urai-admin/src/app/admin/jobs/page.tsx',
  'apps/urai-admin/src/app/admin/job-runs/page.tsx',
  'apps/urai-admin/src/app/admin/dead-letters/page.tsx',
  'apps/urai-admin/src/app/admin/feature-flags/page.tsx',
  'apps/urai-admin/src/app/admin/policies/page.tsx',
  'apps/urai-admin/src/app/admin/system/page.tsx',
  'apps/urai-admin/src/app/admin/settings/page.tsx',
  'apps/urai-admin/src/app/admin/audit/page.tsx'
];

const requiredPublicUrls = [
  '/', '/login', '/features', '/security', '/pricing', '/contact', '/admin', '/admin/users',
  '/admin/projects', '/admin/jobs', '/admin/job-runs', '/admin/dead-letters', '/admin/feature-flags',
  '/admin/policies', '/admin/system', '/admin/settings', '/admin/audit', '/api/health',
  '/api/admin/collection?collection=adminUsers'
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
for (const file of requiredAppRoutes) requireFile(file);

if (existsSync('package.json')) {
  const pkg = JSON.parse(read('package.json'));
  for (const script of requiredScripts) {
    if (!pkg.scripts?.[script]) failures.push(`missing package script: ${script}`);
  }
  if (pkg.scripts?.deploy && !pkg.scripts.deploy.includes('-P urai-4dc1d')) {
    failures.push('deploy script must explicitly target urai-4dc1d');
  }
}

if (existsSync('.env.production.example')) {
  const env = read('.env.production.example');
  for (const key of requiredEnvKeys) {
    if (!env.includes(`${key}=`)) failures.push(`missing env example key: ${key}`);
  }
}

if (existsSync('apphosting.yaml')) {
  const apphosting = read('apphosting.yaml');
  for (const expected of ['pnpm --dir apps/urai-admin start', 'NODE_ENV', 'production', 'https://urai-admin.web.app', 'us-central1-urai-4dc1d.cloudfunctions.net']) {
    if (!apphosting.includes(expected)) failures.push(`apphosting.yaml missing expected production config: ${expected}`);
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

if (existsSync('apps/urai-admin/src/lib/firebase/client.ts')) {
  const firebaseClient = read('apps/urai-admin/src/lib/firebase/client.ts');
  for (const expected of ['__/firebase/init.json', 'getClientAuth', 'getFirebaseConfigStatus', 'PASTE_', 'YOUR_', '_HERE']) {
    if (!firebaseClient.includes(expected)) failures.push(`runtime Firebase client missing expected guard/fallback: ${expected}`);
  }
}

if (existsSync('apps/urai-admin/src/app/api/health/route.ts')) {
  const health = read('apps/urai-admin/src/app/api/health/route.ts');
  for (const expected of ['urai-admin', 'Cache-Control', 'no-store', '/__/firebase/init.json']) {
    if (!health.includes(expected)) failures.push(`health endpoint missing expected production signal: ${expected}`);
  }
}

if (existsSync('scripts/smoke-test.sh')) {
  const smoke = read('scripts/smoke-test.sh');
  for (const expected of ['/api/health', '/__/firebase/init.json', '/api/admin/collection?collection=adminUsers', 'https://urai-admin.web.app']) {
    if (!smoke.includes(expected)) failures.push(`smoke-test missing expected live check: ${expected}`);
  }
}

if (existsSync('scripts/verify-production-live.sh')) {
  const verifier = read('scripts/verify-production-live.sh');
  for (const expected of ['/api/health', '/__/firebase/init.json', '/api/admin/collection?collection=adminUsers', 'https://urai-admin.web.app']) {
    if (!verifier.includes(expected)) failures.push(`production verifier missing expected live check: ${expected}`);
  }
}

if (existsSync('scripts/seed-system-registry.mjs')) {
  const seed = read('scripts/seed-system-registry.mjs');
  for (const system of ['URAI Admin', 'URAI Analytics', 'URAI Communications', 'URAI Privacy', 'URAI Foundation', 'URAI Spatial', 'URAI Studio', 'URAI Asset Factory', 'URAI B2B Portal']) {
    if (!seed.includes(system)) failures.push(`seed-system-registry missing system: ${system}`);
  }
  for (const field of ['systemRegistry', 'adminOperationalEvents', 'dataBoundary', 'privacyClassification', 'operationalRisk']) {
    if (!seed.includes(field)) failures.push(`seed-system-registry missing field/collection: ${field}`);
  }
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
  for (const route of requiredPublicUrls) {
    if (!readme.includes(route)) warnings.push(`README route map may not mention ${route}`);
  }
  if (!readme.includes('Privacy boundary')) warnings.push('README should include privacy boundary section');
}

const secretPatterns = [/AIza[0-9A-Za-z_-]{35}/, /-----BEGIN PRIVATE KEY-----/, /firebase-adminsdk/, /ghp_[0-9A-Za-z_]{30,}/, /xox[baprs]-[0-9A-Za-z-]+/];
for (const path of ['README.md', 'FINAL_LOCK.md', '.env.production.example', 'docs/DEPLOYMENT.md', 'docs/SECURITY.md']) {
  if (!existsSync(path)) continue;
  const text = read(path);
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) failures.push(`possible committed secret in ${path}`);
  }
}

if (process.env.URAI_ADMIN_VERIFIER_RUN_COMMANDS === '1') {
  for (const command of ['pnpm check:types', 'pnpm lint', 'pnpm test:unit', 'pnpm test:rules', 'pnpm test:registry', 'pnpm build']) {
    try {
      execSync(command, { stdio: 'inherit' });
    } catch {
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