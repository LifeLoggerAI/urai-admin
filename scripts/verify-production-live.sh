#!/bin/bash
set -euo pipefail

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://www.uraiadmin.com}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

expect_status() {
  local url="$1"
  local expected="$2"
  local status
  status=$(curl -sS -o /tmp/urai-admin-verify-body.txt -w "%{http_code}" "$url" || true)
  if [[ "$status" != "$expected" ]]; then
    echo "Response body from ${url}:" >&2
    cat /tmp/urai-admin-verify-body.txt >&2 || true
    fail "Expected ${expected} from ${url}, got ${status}"
  fi
  echo "OK: ${url} returned ${status}"
}

expect_status_any() {
  local url="$1"
  shift
  local status
  status=$(curl -sS -o /tmp/urai-admin-verify-body.txt -w "%{http_code}" "$url" || true)
  for expected in "$@"; do
    if [[ "$status" == "$expected" ]]; then
      echo "OK: ${url} returned ${status}"
      return 0
    fi
  done
  echo "Response body from ${url}:" >&2
  cat /tmp/urai-admin-verify-body.txt >&2 || true
  fail "Expected one of [$*] from ${url}, got ${status}"
}

echo "--- Verifying URAI Admin production live deployment ---"
echo "Hosting URL: ${HOSTING_URL}"
echo "Functions URL: ${FUNCTIONS_BASE_URL}"

echo "--- HTTPS homepage ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/" | grep -q "URAI Admin" || fail "Homepage did not include URAI Admin"
echo "OK: Homepage loads and contains URAI Admin"

echo "--- Login page ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/login" | grep -qi "sign" || fail "Login page did not render expected sign-in content"
echo "OK: Login page loads"

echo "--- Protected admin page ---"
expect_status_any "${HOSTING_URL}/admin" 200 302 307 308

echo "--- Protected admin API blocks anonymous access ---"
expect_status "${HOSTING_URL}/api/admin/users" 401

echo "--- Functions health endpoint ---"
curl -sSfL --fail-with-body "${FUNCTIONS_BASE_URL}/api_health" | grep -q '"status":"ok"' || fail "Functions health did not return ok"
echo "OK: Functions health is ok"

echo "--- Functions auth blocks anonymous access ---"
if curl -sSfL -X POST -H "Content-Type: application/json" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}' 2>&1 | grep -q '"error":{"status":"UNAUTHENTICATED"}'; then
  echo "OK: Functions auth blocks anonymous access"
else
  fail "Functions auth endpoint did not block anonymous access"
fi

echo "--- Production live verification passed ---"
