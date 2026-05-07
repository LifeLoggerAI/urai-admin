#!/bin/bash
set -euo pipefail

echo "--- RUNNING URAI ADMIN SMOKE TESTS ---"

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://uraiadmin.com}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

echo "--- Testing public product homepage: ${HOSTING_URL}/ ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/" | grep -q "URAI Admin"
echo "PUBLIC SITE: OK"

echo "--- Testing protected admin redirect: ${HOSTING_URL}/admin ---"
ADMIN_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "${HOSTING_URL}/admin")
if [[ "${ADMIN_STATUS}" != "200" && "${ADMIN_STATUS}" != "302" && "${ADMIN_STATUS}" != "307" && "${ADMIN_STATUS}" != "308" ]]; then
  echo "ADMIN ROUTE: FAILED - Expected 200/302/307/308, got ${ADMIN_STATUS}"
  exit 1
fi
echo "ADMIN ROUTE: OK"

echo "--- Testing admin API auth block: ${HOSTING_URL}/api/admin/users ---"
API_STATUS=$(curl -sS -o /tmp/urai-admin-api-smoke.json -w "%{http_code}" "${HOSTING_URL}/api/admin/users")
if [[ "${API_STATUS}" != "401" ]]; then
  echo "ADMIN API AUTH: FAILED - Expected 401, got ${API_STATUS}"
  cat /tmp/urai-admin-api-smoke.json || true
  exit 1
fi
echo "ADMIN API AUTH: OK"

echo "--- Testing Functions Health URL: ${FUNCTIONS_BASE_URL}/api_health ---"
curl -sSfL "${FUNCTIONS_BASE_URL}/api_health" | grep -q '"status":"ok"'
echo "FUNCTIONS HEALTH: OK"

echo "--- Testing Functions Auth (whoami): ${FUNCTIONS_BASE_URL}/admin_whoami ---"
if curl -sSfL -X POST -H "Content-Type: application/json" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}' 2>&1 | grep -q '"error":{"status":"UNAUTHENTICATED"}'; then
  echo "FUNCTIONS AUTH: OK - Correctly blocked unauthenticated request."
else
  echo "FUNCTIONS AUTH: FAILED - Did not block unauthenticated request."
  exit 1
fi

echo "--- SMOKE TESTS PASSED ---"
