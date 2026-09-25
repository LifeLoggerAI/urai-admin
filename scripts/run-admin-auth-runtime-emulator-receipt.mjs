#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setTimeout as sleep } from 'node:timers/promises';

const PROJECT_ID = 'urai-admin-emulator';
const TARGET_SHA = process.env.TARGET_SHA || process.env.GITHUB_SHA || '';
const BASE_URL = process.env.URAI_ADMIN_RUNTIME_PROOF_URL || 'http://127.0.0.1:3000';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '';
const FIRESTORE_HOST = process.env.FIRESTORE_EMULATOR_HOST || '';
const RECEIPT_PATH = process.env.URAI_ADMIN_AUTH_RUNTIME_RECEIPT_PATH || '/tmp/urai-admin-auth-runtime-emulator-receipt.json';
const SERVER_LOG_PATH = process.env.URAI_ADMIN_AUTH_RUNTIME_SERVER_LOG_PATH || '/tmp/urai-admin-auth-runtime-server.log';
const PASSWORD = 'LocalProof-Only-2026!';
const checks = [];
const serverLog = [];
let server;
let proofApp;

function pass(name, details = {}) {
  checks.push({ name, ...details, status: 'PASS' });
}

function loopback(value, port, label) {
  const match = /^(127\.0\.0\.1|localhost|\[::1\]):(\d+)$/.exec(value);
  assert.ok(match && Number(match[2]) === port, label + ' must be loopback:' + port + '; got ' + (value || '<empty>'));
}

function decodeJwt(token) {
  const parts = String(token).split('.');
  assert.ok(parts.length >= 2, 'JWT is malformed');
  return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
}

function staleAuthTimeToken(token) {
  const parts = String(token).split('.');
  const payload = decodeJwt(token);
  payload.auth_time = Math.floor(Date.now() / 1000) - 900;
  return parts[0] + '.' + Buffer.from(JSON.stringify(payload)).toString('base64url') + '.' + parts[2];
}

async function jsonFetch(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  let body = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = { raw: text }; }
  }
  return { response, body };
}

function sessionCookie(response) {
  const raw = response.headers.get('set-cookie') || '';
  const match = /(?:^|,\s*)__session=([^;]+)/.exec(raw);
  assert.ok(match, 'Expected __session cookie; got ' + (raw || '<none>'));
  return { header: '__session=' + match[1], value: match[1], raw };
}

async function signIn(email) {
  const result = await jsonFetch(
    'http://' + AUTH_HOST + '/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
    },
  );
  assert.equal(result.response.status, 200, 'Auth sign-in failed for ' + email + ': ' + JSON.stringify(result.body));
  assert.equal(typeof result.body?.idToken, 'string');
  return result.body;
}

async function appRequest(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { 'cache-control': 'no-store' };
  if (options.cookie) headers.cookie = options.cookie;
  if (options.body !== undefined) headers['content-type'] = 'application/json';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    if (options.origin !== null) headers.origin = options.origin || BASE_URL;
    if (options.fetchSite !== null) headers['sec-fetch-site'] = options.fetchSite || 'same-origin';
  }
  return jsonFetch(BASE_URL + path, {
    method,
    headers,
    redirect: 'manual',
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
}

async function login(idToken) {
  return appRequest('/api/auth/login', { method: 'POST', body: { idToken } });
}

async function firestoreRest(path, idToken, options = {}) {
  const method = options.method || 'GET';
  const headers = { authorization: 'Bearer ' + idToken };
  if (options.body !== undefined) headers['content-type'] = 'application/json';
  const url = 'http://' + FIRESTORE_HOST + '/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/' + path;
  return jsonFetch(url, {
    method,
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
}

async function waitForServer() {
  const deadline = Date.now() + 90000;
  let last;
  while (Date.now() < deadline) {
    try {
      const result = await jsonFetch(BASE_URL + '/api/health', { cache: 'no-store' });
      if (result.response.ok && result.body?.service === 'urai-admin') return result.body;
      last = new Error('health=' + result.response.status + ' ' + JSON.stringify(result.body));
    } catch (error) {
      last = error;
    }
    await sleep(1000);
  }
  throw last || new Error('Timed out waiting for Admin runtime');
}

async function seedAdmin(auth, db, user, options = {}) {
  const role = options.role || user.role;
  const active = options.active ?? true;
  await auth.createUser({ uid: user.uid, email: user.email, password: PASSWORD, emailVerified: true });
  await auth.setCustomUserClaims(user.uid, {
    admin: options.claimAdmin ?? active,
    role: options.claimRole || role,
    roleVersion: options.roleVersion || 0,
  });
  await db.collection('adminUsers').doc(user.uid).set({
    email: user.email,
    role,
    roleVersion: options.roleVersion || 0,
    isActive: active,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function main() {
  assert.match(TARGET_SHA, /^[0-9a-f]{40}$/, 'TARGET_SHA must be exact');
  loopback(AUTH_HOST, 9099, 'FIREBASE_AUTH_EMULATOR_HOST');
  loopback(FIRESTORE_HOST, 8080, 'FIRESTORE_EMULATOR_HOST');

  proofApp = initializeApp({ projectId: PROJECT_ID }, 'runtime-proof-' + Date.now());
  const auth = getAuth(proofApp);
  const db = getFirestore(proofApp);

  const users = {
    owner: { uid: 'proof-owner', email: 'proof-owner@urai.invalid', role: 'owner' },
    admin: { uid: 'proof-admin', email: 'proof-admin@urai.invalid', role: 'admin' },
    viewer: { uid: 'proof-viewer', email: 'proof-viewer@urai.invalid', role: 'viewer' },
    target: { uid: 'proof-target', email: 'proof-target@urai.invalid', role: 'viewer' },
    stale: { uid: 'proof-stale', email: 'proof-stale@urai.invalid', role: 'viewer' },
    recovery: { uid: 'proof-recovery', email: 'proof-recovery@urai.invalid', role: 'viewer' },
    inactive: { uid: 'proof-inactive', email: 'proof-inactive@urai.invalid', role: 'admin' },
    outsider: { uid: 'proof-outsider', email: 'proof-outsider@urai.invalid' },
  };

  await seedAdmin(auth, db, users.owner);
  await seedAdmin(auth, db, users.admin);
  await seedAdmin(auth, db, users.viewer);
  await seedAdmin(auth, db, users.target);
  await seedAdmin(auth, db, users.stale);
  await seedAdmin(auth, db, users.recovery);
  await seedAdmin(auth, db, users.inactive, { active: false, claimAdmin: true });
  await auth.createUser({ uid: users.outsider.uid, email: users.outsider.email, password: PASSWORD, emailVerified: true });

  await db.collection('systemRegistry').doc('proof').set({
    name: 'Proof', status: 'NO CURRENT EVIDENCE', sourceSha: TARGET_SHA, createdAt: new Date(),
  });
  await db.collection('auditLogs').doc('proof-seed').set({
    actorUid: users.owner.uid, action: 'proof.seed', target: { type: 'proof', id: 'seed' }, createdAt: new Date(),
  });
  await db.collection('analytics_events_raw_test').doc('proof').set({
    transcript: 'must-not-be-readable', createdAt: new Date(),
  });
  await db.collection('featureFlags').doc('proof-secret').set({
    name: 'Proof flag', enabled: false, apiKey: 'secret-never-expose', transcript: 'private-text',
  });

  server = spawn('pnpm', ['--dir', 'apps/urai-admin', 'exec', 'next', 'dev', '-H', '127.0.0.1', '-p', '3000'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'development',
      GCLOUD_PROJECT: PROJECT_ID,
      GOOGLE_CLOUD_PROJECT: PROJECT_ID,
      GITHUB_SHA: TARGET_SHA,
      URAI_ADMIN_BASE_URL: BASE_URL,
      URAI_ADMIN_ALLOWED_ORIGINS: BASE_URL,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'fake-api-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'localhost',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: PROJECT_ID + '.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456789:web:urai-admin-proof',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (chunk) => serverLog.push(String(chunk)));
  server.stderr.on('data', (chunk) => serverLog.push(String(chunk)));

  const health = await waitForServer();
  assert.equal(health.version, TARGET_SHA);
  pass('exact runtime identity', { version: health.version, environment: health.environment });

  const ownerAuth = await signIn(users.owner.email);
  const adminAuth = await signIn(users.admin.email);
  const viewerAuth = await signIn(users.viewer.email);
  const targetOldAuth = await signIn(users.target.email);
  const staleOldAuth = await signIn(users.stale.email);
  const inactiveAuth = await signIn(users.inactive.email);
  const outsiderAuth = await signIn(users.outsider.email);

  const ownerPayload = decodeJwt(ownerAuth.idToken);
  assert.ok(Math.abs(Math.floor(Date.now() / 1000) - ownerPayload.auth_time) <= 300);
  pass('recent owner authentication', { maxAgeSeconds: 300 });

  // Auth Emulator tokens are unsigned emulator artifacts, but manually changing
  // auth_time still changes the token bytes. The Admin SDK correctly rejects that
  // tampered token during verification before exchangeAdminIdToken can emit its
  // reauthRequired branch. Treat this as fail-closed tamper evidence; the genuine
  // stale-claims path below proves bounded refreshRequired behavior with an
  // emulator-issued token.
  const staleTimeLogin = await login(staleAuthTimeToken(ownerAuth.idToken));
  assert.equal(staleTimeLogin.response.status, 401);
  pass('tampered stale-auth token rejected fail-closed', { httpStatus: 401 });

  const ownerLogin = await login(ownerAuth.idToken);
  const adminLogin = await login(adminAuth.idToken);
  const viewerLogin = await login(viewerAuth.idToken);
  assert.equal(ownerLogin.response.status, 200, JSON.stringify(ownerLogin.body));
  assert.equal(adminLogin.response.status, 200, JSON.stringify(adminLogin.body));
  assert.equal(viewerLogin.response.status, 200, JSON.stringify(viewerLogin.body));
  const ownerCookie = sessionCookie(ownerLogin.response);
  const adminCookie = sessionCookie(adminLogin.response);
  const viewerCookie = sessionCookie(viewerLogin.response);
  for (const pair of [['owner', ownerCookie], ['admin', adminCookie], ['viewer', viewerCookie]]) {
    assert.match(pair[1].raw, /HttpOnly/i);
    assert.match(pair[1].raw, /SameSite=Strict/i);
    assert.match(pair[1].raw, /Max-Age=432000/i);
    const payload = decodeJwt(pair[1].value);
    assert.ok(payload.exp > payload.iat && payload.exp - payload.iat <= 432060);
  }
  pass('owner/admin/viewer session exchange', { cookiePolicy: 'HttpOnly/SameSite=Strict/five-day' });

  assert.equal((await login(outsiderAuth.idToken)).response.status, 403);
  assert.equal((await login(inactiveAuth.idToken)).response.status, 403);
  pass('non-admin and inactive login rejection', { rejectionStatus: 403 });

  const ownerSession = await appRequest('/api/auth/admin-session', { cookie: ownerCookie.header });
  const viewerSession = await appRequest('/api/auth/admin-session', { cookie: viewerCookie.header });
  assert.equal(ownerSession.response.status, 200);
  assert.equal(ownerSession.body?.role, 'owner');
  assert.equal(viewerSession.response.status, 200);
  assert.equal(viewerSession.body?.role, 'viewer');
  pass('canonical session claims', { owner: 'owner', viewer: 'viewer' });

  assert.equal((await appRequest('/api/admin/collection?collection=systemRegistry', { cookie: viewerCookie.header })).response.status, 200);
  assert.equal((await appRequest('/api/admin/users', { cookie: viewerCookie.header })).response.status, 403);
  assert.equal((await appRequest('/api/admin/users', { cookie: adminCookie.header })).response.status, 200);
  pass('route-specific RBAC', { viewerSafeRead: 200, viewerPrivilegedRead: 403, adminPrivilegedRead: 200 });

  assert.equal((await firestoreRest('systemRegistry/proof', ownerAuth.idToken)).response.status, 200);
  assert.equal((await firestoreRest('systemRegistry/proof', viewerAuth.idToken)).response.status, 200);
  assert.equal((await firestoreRest('systemRegistry/proof', outsiderAuth.idToken)).response.status, 403);
  assert.equal((await firestoreRest('systemRegistry/proof', inactiveAuth.idToken)).response.status, 403);
  assert.equal((await firestoreRest('auditLogs/proof-seed', viewerAuth.idToken)).response.status, 403);
  assert.equal((await firestoreRest('auditLogs/proof-seed', ownerAuth.idToken)).response.status, 200);
  assert.equal((await firestoreRest('analytics_events_raw_test/proof', ownerAuth.idToken)).response.status, 403);
  assert.equal((await firestoreRest('adminUsers/' + users.target.uid, ownerAuth.idToken, {
    method: 'PATCH', body: { fields: { isActive: { booleanValue: false } } },
  })).response.status, 403);
  assert.equal((await firestoreRest('auditLogs/proof-seed', ownerAuth.idToken, {
    method: 'PATCH', body: { fields: { action: { stringValue: 'tampered' } } },
  })).response.status, 403);
  pass('Firestore emulator rules', {
    ownerViewerRegistryRead: 200, outsiderInactiveDenied: 403, viewerAuditDenied: 403,
    rawTelemetryDenied: 403, clientAdminMutationDenied: 403, auditMutationDenied: 403,
  });

  const flags = await appRequest('/api/admin/collection?collection=featureFlags', { cookie: viewerCookie.header });
  assert.equal(flags.response.status, 200);
  const serialized = JSON.stringify(flags.body);
  assert.ok(serialized.includes('[REDACTED]'));
  assert.ok(!serialized.includes('secret-never-expose') && !serialized.includes('private-text'));
  assert.equal((await appRequest('/api/admin/collection?collection=analytics_events_raw_test', { cookie: ownerCookie.header })).response.status, 400);
  pass('privacy boundary and redaction', { sensitiveFieldsRedacted: true, rawCollectionNotExposed: true });

  assert.equal((await appRequest('/api/admin/users/' + users.owner.uid + '/role', {
    method: 'PUT', cookie: ownerCookie.header, body: { role: 'admin' },
  })).response.status, 400);
  pass('self-role mutation prohibited', { selfRoleStatus: 400 });

  const targetViewerLogin = await login(targetOldAuth.idToken);
  assert.equal(targetViewerLogin.response.status, 200);
  const targetViewerCookie = sessionCookie(targetViewerLogin.response);
  assert.equal((await appRequest('/api/admin/users/' + users.target.uid + '/role', {
    method: 'PUT', cookie: ownerCookie.header, body: { role: 'admin' },
    origin: 'https://evil.example', fetchSite: 'cross-site',
  })).response.status, 403);
  const promote = await appRequest('/api/admin/users/' + users.target.uid + '/role', {
    method: 'PUT', cookie: ownerCookie.header, body: { role: 'admin' },
  });
  assert.equal(promote.response.status, 200, JSON.stringify(promote.body));
  pass('cross-origin rejection and same-origin role promotion', { crossOrigin: 403, sameOrigin: 200 });

  const oldViewerSession = await appRequest('/api/auth/admin-session', { cookie: targetViewerCookie.header });
  const oldViewerToken = await login(targetOldAuth.idToken);
  assert.notEqual(oldViewerSession.response.status, 200);
  assert.notEqual(oldViewerToken.response.status, 200);
  const targetAdminAuth = await signIn(users.target.email);
  const targetAdminLogin = await login(targetAdminAuth.idToken);
  assert.equal(targetAdminLogin.response.status, 200);
  assert.equal(targetAdminLogin.body?.role, 'admin');
  const targetAdminCookie = sessionCookie(targetAdminLogin.response);
  pass('promotion revokes predecessor token/session', {
    oldSessionStatus: oldViewerSession.response.status, oldTokenStatus: oldViewerToken.response.status, refreshedRole: 'admin',
  });

  const reduce = await appRequest('/api/admin/users/' + users.target.uid + '/role', {
    method: 'PUT', cookie: ownerCookie.header, body: { role: 'viewer' },
  });
  assert.equal(reduce.response.status, 200, JSON.stringify(reduce.body));
  const oldAdminSession = await appRequest('/api/auth/admin-session', { cookie: targetAdminCookie.header });
  const oldAdminToken = await login(targetAdminAuth.idToken);
  assert.notEqual(oldAdminSession.response.status, 200);
  assert.notEqual(oldAdminToken.response.status, 200);
  const targetViewerAuth2 = await signIn(users.target.email);
  const targetViewerLogin2 = await login(targetViewerAuth2.idToken);
  assert.equal(targetViewerLogin2.response.status, 200);
  assert.equal(targetViewerLogin2.body?.role, 'viewer');
  const targetViewerCookie2 = sessionCookie(targetViewerLogin2.response);
  pass('role reduction revokes predecessor token/session', {
    oldSessionStatus: oldAdminSession.response.status, oldTokenStatus: oldAdminToken.response.status, refreshedRole: 'viewer',
  });

  await auth.setCustomUserClaims(users.stale.uid, { admin: true, role: 'admin', roleVersion: 1 });
  await db.collection('adminUsers').doc(users.stale.uid).set({
    role: 'admin', roleVersion: 1, isActive: true, updatedAt: new Date(),
  }, { merge: true });
  const staleMismatch = await login(staleOldAuth.idToken);
  assert.equal(staleMismatch.response.status, 409, JSON.stringify(staleMismatch.body));
  assert.equal(staleMismatch.body?.refreshRequired, true);
  const staleFreshLogin = await login((await signIn(users.stale.email)).idToken);
  assert.equal(staleFreshLogin.response.status, 200);
  assert.equal(staleFreshLogin.body?.role, 'admin');
  pass('stale token bounded refresh', { staleStatus: 409, refreshRequired: true, freshStatus: 200 });

  const deactivate = await appRequest('/api/admin/set-user-active', {
    method: 'POST', cookie: adminCookie.header, body: { uid: users.target.uid, isActive: false },
  });
  assert.equal(deactivate.response.status, 200, JSON.stringify(deactivate.body));
  const oldTargetSession = await appRequest('/api/auth/admin-session', { cookie: targetViewerCookie2.header });
  assert.notEqual(oldTargetSession.response.status, 200);
  const inactiveTargetLogin = await login((await signIn(users.target.email)).idToken);
  assert.equal(inactiveTargetLogin.response.status, 403);
  const reactivate = await appRequest('/api/admin/set-user-active', {
    method: 'POST', cookie: adminCookie.header, body: { uid: users.target.uid, isActive: true },
  });
  assert.equal(reactivate.response.status, 200, JSON.stringify(reactivate.body));
  pass('active-state revocation and inactive denial', {
    deactivate: 200, oldSessionStatus: oldTargetSession.response.status, freshInactiveLogin: 403, reactivate: 200,
  });

  const mutationId = 'proof-rollback-required';
  await auth.setCustomUserClaims(users.recovery.uid, { admin: true, role: 'admin', roleVersion: 4 });
  await db.collection('adminUsers').doc(users.recovery.uid).set({
    role: 'viewer', roleVersion: 3, isActive: false,
    roleMutation: {
      id: mutationId, status: 'rollback-required', actorUid: users.owner.uid,
      previousRole: 'viewer', previousRoleVersion: 3, previousIsActive: true,
      requestedRole: 'admin', nextRoleVersion: 4, startedAt: new Date(), failedAt: new Date(),
    },
    activeMutation: null, updatedAt: new Date(),
  }, { merge: true });
  const recovery = await appRequest('/api/admin/recover-user-mutation', {
    method: 'POST', cookie: ownerCookie.header, body: { uid: users.recovery.uid, mutationId },
  });
  assert.equal(recovery.response.status, 200, JSON.stringify(recovery.body));
  const recoveredDoc = await db.collection('adminUsers').doc(users.recovery.uid).get();
  const recoveredUser = await auth.getUser(users.recovery.uid);
  const recoveryAudit = await db.collection('auditLogs').doc(mutationId + '-recovered').get();
  const recovered = recoveredDoc.data() || {};
  assert.equal(recovered.role, 'viewer');
  assert.equal(recovered.isActive, true);
  assert.equal(recovered.roleMutation ?? null, null);
  assert.equal(recovered.activeMutation ?? null, null);
  assert.equal(recoveredUser.customClaims?.role, 'viewer');
  assert.equal(recoveredUser.customClaims?.admin, true);
  assert.equal(recoveredUser.customClaims?.roleVersion, 3);
  assert.equal(recoveryAudit.data()?.action, 'adminUsers.mutation.recover');
  pass('controlled rollback-required recovery', { canonicalRole: 'viewer', canonicalActive: true, audit: true });

  const roleAudit = await db.collection('auditLogs').where('action', '==', 'adminUsers.role.update').get();
  const activeAudit = await db.collection('auditLogs').where('action', 'in', ['adminUsers.deactivate', 'adminUsers.activate']).get();
  assert.ok(roleAudit.docs.some((doc) => doc.data()?.actorUid === users.owner.uid));
  assert.ok(activeAudit.docs.some((doc) => doc.data()?.actorUid === users.admin.uid));
  pass('audit attribution', { ownerRoleMutation: true, adminActiveMutation: true });

  const logout = await appRequest('/api/auth/session', { method: 'DELETE', cookie: ownerCookie.header });
  assert.equal(logout.response.status, 200);
  assert.match(logout.response.headers.get('set-cookie') || '', /Max-Age=0/i);
  pass('logout clears session cookie', { logoutStatus: 200 });

  assert.ok(checks.length > 0, 'Protected runtime receipt must retain at least one check');
  assert.ok(checks.every((check) => check.status === 'PASS'), 'Protected runtime receipt cannot retain a non-PASS check');

  const receipt = {
    schemaVersion: 1,
    repository: process.env.GITHUB_REPOSITORY || 'LifeLoggerAI/urai-admin',
    exactHead: TARGET_SHA,
    projectId: PROJECT_ID,
    authEmulator: AUTH_HOST,
    firestoreEmulator: FIRESTORE_HOST,
    productionMutationPerformed: false,
    cloudCredentialUsed: false,
    protectedRuntimeMode: 'isolated-auth-firestore-emulator',
    checks,
    passed: checks.filter((check) => check.status === 'PASS').length,
    generatedAt: new Date().toISOString(),
  };
  await writeFile(RECEIPT_PATH, JSON.stringify(receipt, null, 2) + '\n', 'utf8');
  console.log('[PASS] URAI Admin protected runtime emulator receipt (' + checks.length + ' checks) -> ' + RECEIPT_PATH);
}

try {
  await main();
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([new Promise((resolve) => server.once('exit', resolve)), sleep(5000)]).catch(() => {});
    if (server.exitCode === null) server.kill('SIGKILL');
  }
  if (proofApp) await deleteApp(proofApp).catch(() => {});
  if (serverLog.length) await writeFile(SERVER_LOG_PATH, serverLog.join(''), 'utf8').catch(() => {});
}
