#!/usr/bin/env node
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
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
  'admin/jobs/page.tsx',
  'admin/audit/page.tsx',
  'admin/privacy-requests/page.tsx',
];

const expectedApiPaths = [
  'api/auth/login/route.ts',
  'api/auth/logout/route.ts',
  'api/auth/admin-session/route.ts',
  'api/admin/users/route.ts',
];

for (const route of [...expectedRoutePaths, ...expectedApiPaths]) {
  const path = join(appRoot, route);
  if (!existsSync(path)) failures.push(`missing expected route file: ${path}`);
}

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...collectFiles(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}

const files = collectFiles(appRoot).filter((path) => /\.(js|jsx|ts|tsx)$/.test(path));
const joined = files.map((path) => readFileSync(path, 'utf8')).join('\n').toLowerCase();

for (const requiredText of [
  'admin',
  'audit',
  'users',
  'privacy',
  'system',
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
  for (const expected of ['signInWithEmailAndPassword', '/api/auth/login', 'Missing Firebase browser config', 'setError', 'window.location.assign']) {
    if (!loginClient.includes(expected)) failures.push(`login client missing expected behavior: ${expected}`);
  }
}

if (failures.length) {
  console.error('Admin route contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');
