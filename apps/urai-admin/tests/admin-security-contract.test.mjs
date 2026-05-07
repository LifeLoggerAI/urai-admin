import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

const appRoot = new URL('..', import.meta.url).pathname;
const repoRoot = resolve(appRoot, '../..');

function readAppFile(path) {
  return readFileSync(join(appRoot, path), 'utf8');
}

function readRepoFile(path) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

test('admin APIs validate session cookies against Firestore admin user state', () => {
  const source = readAppFile('src/lib/admin/require-admin-session.ts');

  assert.match(source, /verifySessionCookie\(sessionCookie,\s*true\)/);
  assert.match(source, /collection\('adminUsers'\)\.doc\(decodedToken\.uid\)\.get\(\)/);
  assert.match(source, /adminUser\?\.isActive !== true/);
  assert.match(source, /allowedRoles\.includes\(role\)/);
  assert.doesNotMatch(
    source,
    /const role = decodedToken\.role/,
    'server-side authorization must not trust potentially stale custom-claim role values',
  );
});

test('admin page shell requires server-side console access before rendering children', () => {
  const source = readAppFile('src/app/admin/layout.tsx');

  assert.match(source, /verifyAdminSessionCookie/);
  assert.match(source, /cookies\(\)\.get\('__session'\)/);
  assert.match(source, /redirect\('\/login'\)/);
  assert.doesNotMatch(
    source,
    /useAuth/,
    'protected admin routes should not rely only on client-side redirects',
  );
});

test('edge middleware remains lightweight and does not import firebase-admin', () => {
  const source = readAppFile('src/middleware.ts');

  assert.match(source, /matcher: \['\/admin\/:path\*', '\/api\/admin\/:path\*'\]/);
  assert.match(source, /req\.cookies\.get\('__session'\)/);
  assert.doesNotMatch(
    source,
    /@\/lib\/firebase\/admin|firebase-admin|verifySessionCookie/,
    'Next middleware runs in an edge-compatible context and must not import Firebase Admin SDK',
  );
});

test('logout clears both server cookie and Firebase client auth state', () => {
  const hookSource = readAppFile('src/hooks/useAuth.ts');
  const logoutSource = readAppFile('src/app/api/auth/logout/route.ts');

  assert.match(hookSource, /firebaseSignOut\(auth\)/);
  assert.match(hookSource, /\/api\/auth\/logout/);
  assert.match(logoutSource, /maxAge: 0/);
  assert.match(logoutSource, /httpOnly: true/);
});

test('login page reports user-facing errors instead of console-only failures', () => {
  const source = readAppFile('src/app/login/page.tsx');

  assert.match(source, /setError/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /disabled=\{isSigningIn\}/);
  assert.doesNotMatch(source, /console\.error/);
});

test('firestore rules use Firestore admin user records for role and active checks', () => {
  const source = readRepoFile('firestore.rules');

  assert.match(source, /function adminUser\(\)/);
  assert.match(source, /adminUser\(\)\.isActive == true/);
  assert.match(source, /adminUser\(\)\.role in \['owner', 'admin'\]/);
  assert.match(source, /adminUser\(\)\.role in \['owner', 'admin', 'viewer'\]/);
});

test('repo cleanup removes legacy duplicate app router tree before validation', () => {
  const gitignoreSource = readRepoFile('.gitignore');
  const cleanupSource = readRepoFile('scripts/clean-app-generated.sh');

  assert.match(gitignoreSource, /apps\/urai-admin\/app\//);
  assert.match(cleanupSource, /rm -rf apps\/urai-admin\/app/);
});
