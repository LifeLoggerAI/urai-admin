#!/bin/bash
set -euo pipefail

echo "--- RUNNING URAI ADMIN SMOKE TESTS ---"

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

echo "--- Testing public product homepage: ${HOSTING_URL}/ ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/" | grep -q "URAI Admin"
echo "PUBLIC SITE: OK"

echo "--- Testing public health endpoint: ${HOSTING_URL}/api/health ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/api/health" | grep -q '"service":"urai-admin"'
echo "HEALTH ENDPOINT: OK"

echo "--- Testing Firebase Hosting runtime config: ${HOSTING_URL}/__/firebase/init.json ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/__/firebase/init.json" | grep -q '"projectId"'
echo "FIREBASE RUNTIME CONFIG: OK"

echo "--- Testing login page: ${HOSTING_URL}/login ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/login" | grep -q "URAI Admin"
echo "LOGIN PAGE: OK"

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