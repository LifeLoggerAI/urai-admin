import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

async function read(pathname) {
  return readFile(new URL(`../${pathname}`, import.meta.url), 'utf8');
}

async function readRoot(pathname) {
  return readFile(new URL(`../../../${pathname}`, import.meta.url), 'utf8');
}

async function walk(dir) {
  const root = new URL(`../${dir}`, import.meta.url);
  const out = [];

  async function visit(fsPath) {
    const entries = await readdir(fsPath, { withFileTypes: true });
    for (const entry of entries) {
      const next = path.join(fsPath, entry.name);
      if (entry.isDirectory()) {
        if (['.next', 'node_modules', 'coverage'].includes(entry.name)) continue;
        await visit(next);
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
        out.push(next);
      }
    }
  }

  await visit(root);
  return out;
}

const requireAdminSession = await read('src/lib/admin/require-admin-session.ts');
assert.match(requireAdminSession, /verifySessionCookie\(sessionCookie,\s*true\)/, 'admin sessions must verify revocation-aware Firebase session cookies');
assert.match(requireAdminSession, /adminUsers/, 'admin sessions must check the adminUsers collection');
assert.match(requireAdminSession, /isActive\s*!==\s*true/, 'inactive admin users must be rejected');
assert.match(requireAdminSession, /adminUser\?\.role\s*!==\s*role/, 'custom claim role must match adminUsers role');
assert.match(requireAdminSession, /allowedRoles\.includes\(role\)/, 'admin sessions must enforce route-specific allowed roles');
assert.match(requireAdminSession, /__session/, 'admin sessions must be based on the hardened Firebase session cookie');

const loginRoute = await read('src/app/api/auth/login/route.ts');
assert.match(loginRoute, /ADMIN_ROLES\s*=\s*\['owner',\s*'admin',\s*'viewer'\]/, 'login must recognize owner, admin, and viewer roles');
assert.match(loginRoute, /admin:\s*true/, 'all active admin roles, including viewer, must receive admin claim for read-only rules access');
assert.match(loginRoute, /role:\s*adminUser\.role/, 'login custom claims must preserve exact adminUsers role');
assert.match(loginRoute, /auth\.setCustomUserClaims/, 'login must refresh Firebase custom claims before session creation');

const sessionRoute = await read('src/app/api/auth/session/route.ts');
assert.match(sessionRoute, /ADMIN_ROLES\s*=\s*\['owner',\s*'admin',\s*'viewer'\]/, 'session refresh must recognize owner, admin, and viewer roles');
assert.match(sessionRoute, /admin:\s*true/, 'session refresh must keep all active admin roles behind the admin claim');
assert.match(sessionRoute, /response\.cookies\.set\('__session'/, 'session refresh must set the hardened __session cookie');
assert.match(sessionRoute, /export\s+async\s+function\s+DELETE/, 'session endpoint must support session clearing');

const collectionRoute = await read('src/app/api/admin/collection/route.ts');
assert.match(collectionRoute, /const\s+COLLECTIONS\s*=/, 'collection route must use an explicit allow-list');
assert.match(collectionRoute, /auditLogs:\s*\{[^}]*orderBy:\s*'createdAt'/s, 'audit logs must order by the canonical createdAt field');
assert.match(collectionRoute, /SENSITIVE_KEY_PATTERN/, 'generic collection reads must define sensitive key redaction');
assert.match(collectionRoute, /REDACTED/, 'generic collection reads must redact secret-like fields');
assert.doesNotMatch(collectionRoute, /collection\(collectionKey\)/, 'collection route must not query arbitrary client-provided collection names');

const roleRoute = await read('src/app/api/admin/users/[uid]/role/route.ts');
assert.match(roleRoute, /requireAdminSession\(req,\s*\['owner'\]\)/, 'role mutation must require owner role');
assert.match(roleRoute, /Cannot change your own role/, 'role mutation must prevent self-demotion');
assert.match(roleRoute, /z\.enum\(\['owner',\s*'admin',\s*'viewer'\]\)/, 'role mutation must use schema validation for allowed roles');
assert.match(roleRoute, /auth\.setCustomUserClaims\(uid,\s*\{\s*admin:\s*true,\s*role\s*\}/s, 'role mutation must keep viewer behind admin claim while preserving exact role');
assert.match(roleRoute, /previousRole/, 'role mutation audit metadata must include previous role');
assert.match(roleRoute, /writeAuditLog/, 'role mutation must write an audit log');

const firestoreRules = await readRoot('firestore.rules');
assert.match(firestoreRules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/s, 'Firestore rules must default-deny all unmatched documents');
assert.match(firestoreRules, /request\.auth\.token\.admin\s*==\s*true/, 'Firestore admin access must require the admin custom claim');
assert.match(firestoreRules, /get\(\/databases\/\$\(database\)\/documents\/adminUsers\/\$\(request\.auth\.uid\)\)\.data\.isActive\s*==\s*true/, 'Firestore admin access must require active adminUsers record');
assert.match(firestoreRules, /allow write: if false;/, 'client-side Firestore writes to protected admin collections must remain disabled');
assert.doesNotMatch(firestoreRules, /allow\s+(read|write|create|update|delete)(,\s*(read|write|create|update|delete))*:\s*if\s*true/, 'Firestore rules must not allow unconditional access');

const storageRules = await readRoot('storage.rules');
assert.match(storageRules, /allow read, write: if false;/, 'Storage must remain deny-all until explicit admin storage paths are designed and tested');
assert.doesNotMatch(storageRules, /allow\s+(read|write|create|update|delete)(,\s*(read|write|create|update|delete))*:\s*if\s*true/, 'Storage rules must not allow unconditional access');

const securityGate = await readRoot('scripts/security-gate.sh');
assert.match(securityGate, /urai_admin_finish\.sh/, 'security gate must block unsafe legacy finish script patterns');

const firebaseClient = await read('src/lib/firebase/client.ts');
assert.match(firebaseClient, /__\/firebase\/init\.json/, 'browser Firebase client must fall back to Firebase Hosting runtime config');
assert.match(firebaseClient, /getClientAuth\(\)/, 'browser Firebase client must expose async auth initialization');
assert.match(firebaseClient, /PASTE_/, 'browser Firebase client must reject placeholder Firebase config values');

const activeSources = await walk('src');
for (const fsPath of activeSources) {
  const rel = path.relative(new URL('../', import.meta.url).pathname, fsPath);
  const source = await readFile(fsPath, 'utf8');
  if (rel.endsWith('src/lib/firebase/client.ts')) continue;
  assert.doesNotMatch(source, /PASTE_AUTH_DOMAIN_HERE|YOUR_API_KEY|YOUR_AUTH_DOMAIN/, `${rel} must not contain placeholder Firebase config`);
  assert.doesNotMatch(source, /initializeApp\s*\(/, `${rel} must not initialize a separate Firebase app`);
}

console.log('app admin source contract checks passed');