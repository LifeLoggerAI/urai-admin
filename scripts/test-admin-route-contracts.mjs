#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const appRoot = 'apps/urai-admin/src/app';
const failures = [];

const expectedRoutePaths = [
  'page.tsx',
  'login/page.tsx',
  'login/LoginClient.tsx',
  'features/page.tsx',
  'security/page.tsx',
  'pricing/page.tsx',
  'contact/page.tsx',
  'admin/page.tsx',
  'admin/users/page.tsx',
  'admin/projects/page.tsx',
  'admin/jobs/page.tsx',
  'admin/job-runs/page.tsx',
  'admin/dead-letters/page.tsx',
  'admin/feature-flags/page.tsx',
  'admin/policies/page.tsx',
  'admin/privacy-requests/page.tsx',
  'admin/system/page.tsx',
  'admin/audit/page.tsx',
  'admin/settings/page.tsx',
];

const expectedApiPaths = [
  'api/health/route.ts',
  'api/auth/login/route.ts',
  'api/auth/logout/route.ts',
  'api/auth/session/route.ts',
  'api/auth/admin-session/route.ts',
  'api/admin/users/route.ts',
  'api/admin/collection/route.ts',
];

for (const route of [...expectedRoutePaths, ...expectedApiPaths]) {
  const pathname = join(appRoot, route);
  if (!existsSync(pathname)) failures.push(`missing expected route file: ${pathname}`);
}

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const pathname = join(dir, entry);
    const stats = statSync(pathname);
    if (stats.isDirectory()) out.push(...collectFiles(pathname));
    if (stats.isFile()) out.push(pathname);
  }
  return out;
}

const files = collectFiles(appRoot).filter((pathname) => /\.(js|jsx|ts|tsx)$/.test(pathname));
const joined = files.map((pathname) => readFileSync(pathname, 'utf8')).join('\n').toLowerCase();

for (const requiredText of [
  'admin',
  'audit',
  'users',
  'project',
  'jobs',
  'feature',
  'system',
  'settings',
  'privacy',
  'login',
  'firebase',
  'session',
  'error',
]) {
  if (!joined.includes(requiredText)) failures.push(`app source missing required admin concept: ${requiredText}`);
}

const loginClientPath = join(appRoot, 'login/LoginClient.tsx');
if (existsSync(loginClientPath)) {
  const loginClient = readFileSync(loginClientPath, 'utf8');
  for (const expected of [
    'getClientAuth',
    'getFirebaseConfigStatus',
    'signInWithEmailAndPassword',
    'signInWithPopup',
    'signInWithRedirect',
    '/api/auth/login',
    'window.location.assign',
  ]) {
    if (!loginClient.includes(expected)) failures.push(`login client missing expected behavior: ${expected}`);
  }
}

const sessionRoutePath = join(appRoot, 'api/auth/session/route.ts');
if (existsSync(sessionRoutePath)) {
  const sessionRoute = readFileSync(sessionRoutePath, 'utf8');
  for (const expected of ['__session', 'setCustomUserClaims', 'admin: true', 'ADMIN_ROLES', 'DELETE']) {
    if (!sessionRoute.includes(expected)) failures.push(`session endpoint missing expected behavior: ${expected}`);
  }
}

const healthRoutePath = join(appRoot, 'api/health/route.ts');
if (existsSync(healthRoutePath)) {
  const healthRoute = readFileSync(healthRoutePath, 'utf8');
  for (const expected of ['service', 'urai-admin', 'Cache-Control', 'no-store']) {
    if (!healthRoute.includes(expected)) failures.push(`health endpoint missing expected behavior: ${expected}`);
  }
}

const collectionRoutePath = join(appRoot, 'api/admin/collection/route.ts');
if (existsSync(collectionRoutePath)) {
  const collectionRoute = readFileSync(collectionRoutePath, 'utf8');
  for (const expected of ['COLLECTIONS', 'privacyRequests', 'SENSITIVE_KEY_PATTERN', 'REDACTED', 'requireAdminSession']) {
    if (!collectionRoute.includes(expected)) failures.push(`collection API missing expected behavior: ${expected}`);
  }
}

if (failures.length) {
  console.error('Admin route contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');