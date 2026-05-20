#!/bin/bash
set -euo pipefail

echo "--- RUNNING URAI ADMIN SMOKE TESTS ---"

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

BODY_FILE="/tmp/urai-admin-smoke-body.txt"

fetch_body() {
  local url="$1"
  curl -sSL "$url" -o "$BODY_FILE"
}

expect_body_contains() {
  local url="$1"
  local pattern="$2"
  local label="$3"
  if ! fetch_body "$url"; then
    echo "${label}: FAILED - request failed"
    cat "$BODY_FILE" || true
    exit 1
  fi
  if ! grep -q "$pattern" "$BODY_FILE"; then
    echo "${label}: FAILED - response did not contain ${pattern}"
    cat "$BODY_FILE" || true
    exit 1
  fi
  echo "${label}: OK"
}

echo "--- Testing public product homepage: ${HOSTING_URL}/ ---"
expect_body_contains "${HOSTING_URL}/" "URAI" "PUBLIC SITE"

echo "--- Testing public health endpoint: ${HOSTING_URL}/api/health ---"
expect_body_contains "${HOSTING_URL}/api/health" '"status":"ok"' "HEALTH ENDPOINT"

echo "--- Testing Firebase Hosting runtime config: ${HOSTING_URL}/__/firebase/init.json ---"
expect_body_contains "${HOSTING_URL}/__/firebase/init.json" '"projectId"' "FIREBASE RUNTIME CONFIG"

echo "--- Testing login page: ${HOSTING_URL}/login ---"
expect_body_contains "${HOSTING_URL}/login" "sign" "LOGIN PAGE"

echo "--- Testing protected admin route: ${HOSTING_URL}/admin ---"
ADMIN_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "${HOSTING_URL}/admin")
if [[ "${ADMIN_STATUS}" != "200" && "${ADMIN_STATUS}" != "302" && "${ADMIN_STATUS}" != "307" && "${ADMIN_STATUS}" != "308" ]]; then
  echo "ADMIN ROUTE: FAILED - Expected 200/302/307/308, got ${ADMIN_STATUS}"
  exit 1
fi
echo "ADMIN ROUTE: OK"

echo "--- Testing admin collection API auth block: ${HOSTING_URL}/api/admin/collection?collection=adminUsers ---"
API_STATUS=$(curl -sS -o /tmp/urai-admin-api-smoke.json -w "%{http_code}" "${HOSTING_URL}/api/admin/collection?collection=adminUsers")
if [[ "${API_STATUS}" != "401" ]]; then
  echo "ADMIN COLLECTION API AUTH: FAILED - Expected 401, got ${API_STATUS}"
  cat /tmp/urai-admin-api-smoke.json || true
  exit 1
fi
echo "ADMIN COLLECTION API AUTH: OK"

echo "--- Testing Functions Health URL: ${FUNCTIONS_BASE_URL}/api_health ---"
expect_body_contains "${FUNCTIONS_BASE_URL}/api_health" '"status":"ok"' "FUNCTIONS HEALTH"

echo "--- Testing legacy Functions Auth diagnostic: ${FUNCTIONS_BASE_URL}/admin_whoami ---"
LEGACY_STATUS=$(curl -sS -o /tmp/urai-admin-whoami-smoke.json -w "%{http_code}" -X POST -H "Content-Type: application/json" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}' || true)
if grep -q '"error":{"status":"UNAUTHENTICATED"}' /tmp/urai-admin-whoami-smoke.json || grep -q '"error":"UNAUTHENTICATED"' /tmp/urai-admin-whoami-smoke.json; then
  echo "FUNCTIONS AUTH: OK - Correctly blocked unauthenticated request."
else
  echo "FUNCTIONS AUTH: WARN - Legacy endpoint returned status ${LEGACY_STATUS} with unexpected envelope."
  cat /tmp/urai-admin-whoami-smoke.json || true
fi

echo "--- SMOKE TESTS PASSED ---"