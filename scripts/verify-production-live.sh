#!/bin/bash
set -euo pipefail

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"
VERIFY_BODY="${TMPDIR:-/tmp}/urai-admin-verify-body.txt"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

fetch_body() {
  local url="$1"
  curl -sSL "${url}" -o "${VERIFY_BODY}"
}

expect_status() {
  local url="$1"
  local expected="$2"
  local status
  status=$(curl -sSL -o "${VERIFY_BODY}" -w "%{http_code}" "$url" || true)
  if [[ "$status" != "$expected" ]]; then
    echo "Response body from ${url}:" >&2
    cat "${VERIFY_BODY}" >&2 || true
    fail "Expected ${expected} from ${url}, got ${status}"
  fi
  echo "OK: ${url} returned ${status}"
}

expect_status_any() {
  local url="$1"
  shift
  local status
  status=$(curl -sSL -o "${VERIFY_BODY}" -w "%{http_code}" "$url" || true)
  for expected in "$@"; do
    if [[ "$status" == "$expected" ]]; then
      echo "OK: ${url} returned ${status}"
      return 0
    fi
  done
  echo "Response body from ${url}:" >&2
  cat "${VERIFY_BODY}" >&2 || true
  fail "Expected one of [$*] from ${url}, got ${status}"
}

echo "--- Verifying URAI Admin production live deployment ---"
echo "Hosting URL: ${HOSTING_URL}"
echo "Functions URL: ${FUNCTIONS_BASE_URL}"

echo "--- HTTPS homepage ---"
fetch_body "${HOSTING_URL}/"
grep -Eq "URAI Admin|URAI|urai-admin" "${VERIFY_BODY}" || fail "Homepage did not include URAI Admin/URAI"
echo "OK: Homepage loads and contains URAI Admin/URAI"

echo "--- Login page ---"
fetch_body "${HOSTING_URL}/login"
grep -qi "sign\|login\|auth" "${VERIFY_BODY}" || fail "Login page did not render expected sign-in content"
echo "OK: Login page loads"

echo "--- Protected admin page ---"
expect_status_any "${HOSTING_URL}/admin" 200 302 307 308

echo "--- Protected admin API blocks anonymous access ---"
expect_status "${HOSTING_URL}/api/admin/users" 401

echo "--- Functions health endpoint ---"
fetch_body "${FUNCTIONS_BASE_URL}/api_health"
grep -q '"status":"ok"' "${VERIFY_BODY}" || fail "Functions health did not return ok"
echo "OK: Functions health is ok"

echo "--- Functions auth blocks anonymous access ---"
AUTH_STATUS=$(curl -sSL -X POST -H "Content-Type: application/json" -o "${VERIFY_BODY}" -w "%{http_code}" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}')
if [[ "${AUTH_STATUS}" != "401" && "${AUTH_STATUS}" != "403" ]]; then
  cat "${VERIFY_BODY}" >&2 || true
  fail "Functions auth endpoint returned ${AUTH_STATUS}; expected 401/403"
fi
if grep -Eq 'UNAUTHENTICATED|PERMISSION_DENIED|unauthenticated|permission|Unauthorized|Forbidden' "${VERIFY_BODY}"; then
  echo "OK: Functions auth blocks anonymous access"
else
  cat "${VERIFY_BODY}" >&2 || true
  fail "Functions auth endpoint did not return an expected auth-denial marker"
fi

echo "--- Production live verification passed ---"
