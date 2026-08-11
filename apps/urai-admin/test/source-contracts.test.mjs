import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const appRoot = fileURLToPath(new URL('../', import.meta.url));

async function read(pathname) {
  return readFile(new URL(`../${pathname}`, import.meta.url), 'utf8');
}

async function readRoot(pathname) {
  return readFile(new URL(`../../../${pathname}`, import.meta.url), 'utf8');
}

async function walk(dir) {
  const root = fileURLToPath(new URL(`../${dir}`, import.meta.url));
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

function isServerFirebaseAdminSource(source) {
  return /firebase-admin\/(app|firestore|auth)/.test(source) || /from ["']firebase-admin["']/.test(source);
}

const requireAdminSession = await read('src/lib/admin/require-admin-session.ts');
assert.match(requireAdminSession, /verifySessionCookie\(sessionCookie,\s*true\)/, 'admin sessions must verify revocation-aware Firebase session cookies');
assert.match(requireAdminSession, /adminUsers/, 'admin sessions must check the adminUsers collection');
assert.match(requireAdminSession, /isActive\s*!==\s*true/, 'inactive admin users must be rejected');
assert.match(requireAdminSession, /adminUser\?\.role\s*!==\s*role/, 'custom claim role must match adminUsers role');
assert.match(requireAdminSession, /allowedRoles\.includes\(role\)/, 'admin sessions must enforce route-specific allowed roles');
assert.match(requireAdminSession, /__session/, 'admin sessions must be based on the hardened Firebase session cookie');
assert.match(requireAdminSession, /requireSameOrigin/, 'admin mutations must reject untrusted origins');
assert.match(requireAdminSession, /URAI_ADMIN_ALLOWED_ORIGINS/, 'production origin authority must come from explicit configuration');
assert.match(requireAdminSession, /Production admin origins must use HTTPS/, 'production origin configuration must require HTTPS');
assert.match(requireAdminSession, /Admin origin allowlist is not configured/, 'production must fail closed without configured origins');
assert.match(requireAdminSession, /isLoopbackOrigin/, 'non-production may allow only explicit loopback development origins');
assert.doesNotMatch(requireAdminSession, /x-forwarded-host|x-forwarded-proto/i, 'forwarded request headers must not define trusted admin origins');
assert.doesNotMatch(requireAdminSession, /new Set<string>\(\[req\.nextUrl\.origin\]\)/, 'request-derived origin must not seed the production allowlist');
assert.match(requireAdminSession, /decodedToken\.auth_time/, 'session creation must require recent authentication');
assert.match(requireAdminSession, /ageSeconds >= -MAX_CLOCK_SKEW_SECONDS/, 'future-dated authentication must be bounded by explicit clock skew');
assert.match(requireAdminSession, /refreshRequired:\s*true/, 'stale claims must require a refreshed ID token');
assert.match(requireAdminSession, /tokenClaimsMatch/, 'a stale token must not mint an admin cookie');
assert.match(requireAdminSession, /sameSite:\s*'strict'/, 'admin cookies must use strict same-site policy');

const loginRoute = await read('src/app/api/auth/login/route.ts');
assert.match(loginRoute, /exchangeAdminIdToken/, 'login must use the canonical two-pass exchange');
assert.match(loginRoute, /auth\.verifyIdToken/, 'login must fail closed without token verification support');
assert.match(loginRoute, /auth\.createSessionCookie/, 'login must fail closed without cookie exchange support');

const loginClient = await read('src/app/login/LoginClient.tsx');
assert.match(loginClient, /exchange\.response\.status === 409/, 'client must recognize the claim synchronization response');
assert.match(loginClient, /exchange\.payload\.refreshRequired === true/, 'client must require the explicit refresh flag');
assert.equal((loginClient.match(/credential\.user\.getIdToken\(true\)/g) ?? []).length, 2, 'client must allow exactly one forced-token retry path');
assert.doesNotMatch(loginClient, /while\s*\(/, 'admin claim refresh must not loop indefinitely');

const sessionRoute = await read('src/app/api/auth/session/route.ts');
assert.match(sessionRoute, /exchangeAdminIdToken/, 'session refresh must use the canonical exchange');
assert.match(sessionRoute, /response\.cookies\.set\('__session'/, 'session refresh must support session clearing');
assert.match(sessionRoute, /export\s+async\s+function\s+DELETE/, 'session endpoint must support session clearing');
assert.match(sessionRoute, /requireSameOrigin/, 'session clearing must reject untrusted origins');

const collectionRoute = await read('src/app/api/admin/collection/route.ts');
assert.match(collectionRoute, /const\s+COLLECTIONS\s*=/, 'collection route must use an explicit allow-list');
assert.match(collectionRoute, /auditLogs:\s*\{[^}]*orderBy:\s*'createdAt'/s, 'audit logs must order by the canonical createdAt field');
assert.match(collectionRoute, /SENSITIVE_KEY_PATTERN/, 'generic collection reads must define sensitive key redaction');
assert.match(collectionRoute, /REDACTED/, 'generic collection reads must redact secret-like fields');
assert.doesNotMatch(collectionRoute, /collection\(collectionKey\)/, 'collection route must not query arbitrary client-provided collection names');

const roleService = await read('src/lib/admin/update-admin-role.ts');
assert.match(roleService, /Cannot change your own role/, 'role mutation must prevent self-demotion');
assert.match(roleService, /userRecord\.customClaims/, 'role mutation must preserve unrelated custom claims');
assert.match(roleService, /auth\.revokeRefreshTokens\(uid\)/, 'role mutation must revoke existing sessions');
assert.match(roleService, /auth\.setCustomUserClaims\(uid, previousClaims\)/, 'role mutation must compensate after a Firestore failure');
assert.match(roleService, /roleMutation:\s*\{\s*id:\s*mutationId,\s*status:\s*'pending'/s, 'role mutation must reserve the target before changing claims');
assert.match(roleService, /Admin role update already in progress/, 'concurrent role mutations must fail closed');
assert.match(roleService, /transaction\.set\(auditRef/, 'successful role mutation must commit its audit record atomically');
assert.match(roleService, /transaction\.set\(failureAuditRef/, 'failed role mutation must commit a durable failure audit');
assert.match(roleService, /status:\s*'rollback-required'/, 'incomplete compensation must leave explicit rollback-required evidence');
assert.doesNotMatch(roleService, /await\s+writeAuditLog\s*\(/, 'role mutation audit must not be detached from the canonical transaction');

const roleRoute = await read('src/app/api/admin/users/[uid]/role/route.ts');
assert.match(roleRoute, /requireAdminMutationSession\(req, \['owner'\]\)/, 'role mutation must require owner role and trusted origin');
assert.match(roleRoute, /updateAdminRole/, 'canonical role route must use the shared mutation service');
assert.match(roleRoute, /z\.enum\(\['owner', 'admin', 'viewer'\]\)/, 'role mutation must schema-check allowed roles');

const legacyRoleRoute = await read('src/app/api/admin/update-user-role/route.ts');
assert.match(legacyRoleRoute, /requireAdminMutationSession\(request, \['owner'\]\)/, 'legacy role route must use the same origin and owner guard');
assert.match(legacyRoleRoute, /updateAdminRole/, 'legacy role route must not implement a second role authority');
assert.doesNotMatch(legacyRoleRoute, /runTransaction/, 'legacy role route must not retain independent mutation logic');

const activeRoute = await read('src/app/api/admin/set-user-active/route.ts');
assert.match(activeRoute, /requireAdminMutationSession/, 'active-state mutation must require trusted origin');
assert.match(activeRoute, /Only an owner can change another owner or admin account/, 'admin role hierarchy must be enforced');
assert.match(activeRoute, /auth\.revokeRefreshTokens\(payload\.uid\)/, 'active-state changes must revoke sessions');
assert.match(activeRoute, /auth\.setCustomUserClaims\(payload\.uid, previousClaims\)/, 'active-state failures must restore claims');
assert.match(activeRoute, /Admin user changed during active-state update/, 'active-state writes must detect concurrent role/state changes');
assert.match(activeRoute, /sessionsRevoked:\s*true/, 'active-state audit/result must expose revocation');

const firebaseAdmin = await read('src/lib/firebase/admin.ts');
for (const method of ['verifySessionCookie', 'verifyIdToken', 'createSessionCookie', 'setCustomUserClaims', 'revokeRefreshTokens', 'getUser']) {
  assert.ok(firebaseAdmin.includes(method), `build Firebase Admin stub missing ${method}`);
}
assert.match(firebaseAdmin, /runTransaction/, 'build Firestore stub must expose transaction surface');

const firestoreRules = await readRoot('firestore.rules');
assert.match(firestoreRules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/s, 'Firestore rules must default-deny all unmatched documents');
assert.match(firestoreRules, /function\s+adminRecord\(\)\s*\{\s*return get\(\/databases\/\$\(database\)\/documents\/adminUsers\/\$\(request\.auth\.uid\)\)\.data;\s*\}/s, 'Firestore rules must resolve the canonical adminUsers record');
assert.match(firestoreRules, /function\s+hasActiveAdminRecord\(\)\s*\{[\s\S]*exists\(\/databases\/\$\(database\)\/documents\/adminUsers\/\$\(request\.auth\.uid\)\)[\s\S]*adminRecord\(\)\.isActive\s*==\s*true;\s*\}/, 'Firestore admin access must require an existing active adminUsers record');
assert.match(firestoreRules, /function\s+tokenRoleMatchesRecord\(\)\s*\{[\s\S]*request\.auth\.token\.admin\s*==\s*true[\s\S]*request\.auth\.token\.role\s*==\s*adminRecord\(\)\.role;\s*\}/, 'Firestore admin access must require the admin claim and canonical role parity');
assert.match(firestoreRules, /allow write: if false;/, 'client-side Firestore writes to protected admin collections must remain disabled');
assert.doesNotMatch(firestoreRules, /allow\s+(read|write|create|update|delete)(,\s*(read|write|create|update|delete))*:\s*if\s*true/, 'Firestore rules must not allow unconditional access');

const storageRules = await readRoot('storage.rules');
assert.match(storageRules, /allow read, write: if false;/, 'Storage must remain deny-all until explicit admin storage paths are designed and tested');
assert.doesNotMatch(storageRules, /allow\s+(read|write|create|update|delete)(,\s*(read|write|create|update|delete))*:\s*if\s*true/, 'Storage rules must not allow unconditional access');

const securityGate = await readRoot('scripts/security-gate.sh');
assert.match(securityGate, /urai_admin_finish\.sh/, 'security gate must block unsafe legacy finish script patterns');

const firebaseClient = await read('src/lib/firebase/client.ts');
assert.match(firebaseClient, /__\/firebase\/init\.json/, 'browser Firebase client must fall back to Firebase Hosting runtime config');
assert.match(firebaseClient, /getFirebaseApp\(\)/, 'browser Firebase client must expose async app initialization');
assert.match(firebaseClient, /getClientAuth\(\)/, 'browser Firebase client must expose async auth initialization');
assert.match(firebaseClient, /getClientFirestore\(\)/, 'browser Firebase client must expose async Firestore initialization');
assert.match(firebaseClient, /getFirebaseConfigStatus\(\)/, 'browser Firebase client must expose config readiness status');
assert.match(firebaseClient, /PASTE_/, 'browser Firebase client must reject placeholder Firebase config values');

const activeSources = await walk('src');
for (const fsPath of activeSources) {
  const rel = path.relative(appRoot, fsPath);
  const source = await readFile(fsPath, 'utf8');
  if (rel.endsWith('src/lib/firebase/client.ts')) continue;
  assert.doesNotMatch(source, /PASTE_AUTH_DOMAIN_HERE|YOUR_API_KEY|YOUR_AUTH_DOMAIN/, `${rel} must not contain placeholder Firebase config`);
  if (!isServerFirebaseAdminSource(source)) {
    assert.doesNotMatch(source, /initializeApp\s*\(/, `${rel} must not initialize a separate Firebase client app`);
  }
}

console.log('app admin source contract checks passed');
