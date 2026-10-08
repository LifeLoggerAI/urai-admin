#!/bin/bash
set -euo pipefail

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"
EXPECTED_SHA="${URAI_ADMIN_EXPECTED_LIVE_SHA:-${URAI_ADMIN_TARGET_SHA:-}}"
HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

fail() { echo "ERROR: $1" >&2; exit 1; }
[[ "${EXPECTED_SHA}" =~ ^[0-9a-f]{40}$ ]] || fail "An approved exact URAI_ADMIN_EXPECTED_LIVE_SHA (or URAI_ADMIN_TARGET_SHA) is required."

node --input-type=module - "${HOSTING_URL}" "${FUNCTIONS_BASE_URL}" <<'NODE'
const [hosting, functions] = process.argv.slice(2).map((value) => new URL(value));
for (const url of [hosting, functions]) {
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Live verification requires HTTPS origins without credentials, query or path.');
  }
}
if (functions.origin !== 'https://us-central1-urai-4dc1d.cloudfunctions.net') {
  throw new Error('Admin Functions verification must use the current canonical urai-4dc1d region/project.');
}
NODE

VERIFY_TMP="$(mktemp -d "${TMPDIR:-/tmp}/urai-admin-live-verify.XXXXXX")"
trap 'rm -rf "${VERIFY_TMP}"' EXIT
BODY="${VERIFY_TMP}/body"
HEADERS="${VERIFY_TMP}/headers"

fetch_response() {
  local url="$1"
  if ! STATUS=$(curl --proto '=https' --tlsv1.2 --connect-timeout 10 --max-time 30 -sS -D "${HEADERS}" -o "${BODY}" -w '%{http_code}' "${url}"); then
    fail "Request failed for ${url}"
  fi
}

expect_status() {
  local url="$1" expected="$2"
  fetch_response "${url}"
  [[ "${STATUS}" == "${expected}" ]] || fail "Expected ${expected} from ${url}, got ${STATUS}."
  echo "OK: ${url} returned ${STATUS}"
}

expect_json() {
  local url="$1" contract="$2"
  expect_status "${url}" 200
  node --input-type=module - "${BODY}" "${contract}" "${EXPECTED_SHA}" <<'NODE'
import assert from 'node:assert/strict';
import fs from 'node:fs';
const [filename, contract, expectedSha] = process.argv.slice(2);
const body = JSON.parse(fs.readFileSync(filename, 'utf8'));
if (contract === 'app-health') {
  assert.equal(body.service, 'urai-admin');
  assert.equal(body.ok, true);
  assert.equal(body.environment, 'production');
  assert.equal(body.version, expectedSha, 'served Admin source differs from the approved exact SHA');
} else if (contract === 'firebase-runtime') {
  assert.equal(body.projectId, 'urai-4dc1d');
  assert.equal(typeof body.authDomain, 'string');
  assert.ok(body.authDomain.length > 0);
} else if (contract === 'functions-health') {
  assert.equal(body.service, 'urai-admin');
  assert.equal(body.status, 'ok');
  assert.equal(body.projectIdentityPresent, true);
  assert.equal(body.revisionPresent, true);
} else if (contract === 'functions-readiness') {
  assert.equal(body.service, 'urai-admin');
  assert.equal(body.status, 'ready');
  for (const key of ['projectIdentity','runtimeRevision','productionOriginHttps','allowedOriginsPresent','allowedOriginsHttps','productionOriginAllowed','packagedAdminApp']) {
    assert.equal(body.checks?.[key], true, `readiness check ${key} must pass`);
  }
} else {
  throw new Error('Unknown live response contract');
}
NODE
}

echo "--- Verifying public URAI Admin source/readiness checks ---"
echo "Approved source SHA: ${EXPECTED_SHA}"
expect_status "${HOSTING_URL}/" 200
expect_status "${HOSTING_URL}/login" 200
expect_json "${HOSTING_URL}/api/health" app-health
expect_json "${HOSTING_URL}/__/firebase/init.json" firebase-runtime

fetch_response "${HOSTING_URL}/admin"
[[ "${STATUS}" =~ ^(302|303|307|308)$ ]] || fail "Anonymous /admin must redirect to login, got ${STATUS}."
node --input-type=module - "${HEADERS}" "${HOSTING_URL}" <<'NODE'
import assert from 'node:assert/strict';
import fs from 'node:fs';
const [filename, base] = process.argv.slice(2);
const location = fs.readFileSync(filename, 'utf8').split(/\r?\n/).find((line) => /^location:/i.test(line))?.replace(/^location:\s*/i, '').trim();
assert.ok(location, 'Protected Admin redirect must include a Location header');
const url = new URL(location, base);
assert.equal(url.origin, new URL(base).origin);
assert.equal(url.pathname, '/login');
NODE

expect_status "${HOSTING_URL}/api/admin/collection?collection=adminUsers" 401
expect_status "${HOSTING_URL}/api/admin/users" 401
expect_status "${HOSTING_URL}/api/auth/admin-session" 401
expect_json "${FUNCTIONS_BASE_URL}/health" functions-health
expect_json "${FUNCTIONS_BASE_URL}/readiness" functions-readiness

echo "--- Public source/readiness checks passed; authenticated RBAC, lifecycle, provider and recovery acceptance remain separate. ---"
