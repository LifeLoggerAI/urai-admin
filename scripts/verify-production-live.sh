#!/bin/bash
set -euo pipefail

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

fetch_body() {
  local url="$1"
  local output="$2"
  curl -sSL "$url" -o "$output"
}

expect_body_contains() {
  local url="$1"
  local pattern="$2"
  local message="$3"
  local body_file="/tmp/urai-admin-verify-body.txt"
  if ! fetch_body "$url" "$body_file"; then
    cat "$body_file" >&2 || true
    fail "${message}: request failed"
  fi
  if ! grep -q "$pattern" "$body_file"; then
    echo "Response body from ${url}:" >&2
    cat "$body_file" >&2 || true
    fail "$message"
  fi
  echo "OK: ${message}"
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
expect_body_contains "${HOSTING_URL}/" "URAI" "Homepage loads and contains URAI"

echo "--- Health endpoint ---"
expect_body_contains "${HOSTING_URL}/api/health" '"service":"urai-admin"' "Health endpoint returns urai-admin"

echo "--- Firebase Hosting runtime config ---"
expect_body_contains "${HOSTING_URL}/__/firebase/init.json" '"projectId"' "Firebase Hosting runtime config is available"

echo "--- Login page ---"
expect_body_contains "${HOSTING_URL}/login" "sign" "Login page loads"

echo "--- Protected admin page ---"
expect_status_any "${HOSTING_URL}/admin" 200 302 307 308

echo "--- Protected admin collection API blocks anonymous access ---"
expect_status "${HOSTING_URL}/api/admin/collection?collection=adminUsers" 401

echo "--- Functions health endpoint ---"
expect_body_contains "${FUNCTIONS_BASE_URL}/api_health" '"status":"ok"' "Functions health is ok"

echo "--- Functions auth blocks anonymous access ---"
if curl -sSL -X POST -H "Content-Type: application/json" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}' 2>&1 | grep -q '"error":{"status":"UNAUTHENTICATED"}'; then
  echo "OK: Functions auth blocks anonymous access"
else
  fail "Functions auth endpoint did not block anonymous access"
fi

echo "--- Production live verification passed ---"
