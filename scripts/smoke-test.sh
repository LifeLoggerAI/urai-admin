#!/bin/bash
set -euo pipefail

echo "--- RUNNING URAI ADMIN SMOKE TESTS ---"

HOSTING_URL="${URAI_ADMIN_BASE_URL:-https://uraiadmin.com}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

HOSTING_URL="${HOSTING_URL%/}"
FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL%/}"

TMP_DIR="${TMPDIR:-/tmp}"
PUBLIC_BODY="${TMP_DIR}/urai-admin-public-smoke.html"
API_BODY="${TMP_DIR}/urai-admin-api-smoke.json"
FUNCTIONS_BODY="${TMP_DIR}/urai-admin-functions-smoke.json"
AUTH_BODY="${TMP_DIR}/urai-admin-functions-auth-smoke.json"

http_get() {
  local url="$1"
  local body_path="$2"
  curl -sSL -o "${body_path}" -w "%{http_code}" "${url}"
}

echo "--- Testing public product homepage: ${HOSTING_URL}/ ---"
PUBLIC_STATUS=$(http_get "${HOSTING_URL}/" "${PUBLIC_BODY}")
if [[ "${PUBLIC_STATUS}" != "200" ]]; then
  echo "PUBLIC SITE: FAILED - Expected 200, got ${PUBLIC_STATUS}"
  cat "${PUBLIC_BODY}" || true
  exit 1
fi
grep -q "URAI Admin" "${PUBLIC_BODY}"
echo "PUBLIC SITE: OK"

echo "--- Testing protected admin redirect: ${HOSTING_URL}/admin ---"
ADMIN_STATUS=$(curl -sSL -o /dev/null -w "%{http_code}" "${HOSTING_URL}/admin")
if [[ "${ADMIN_STATUS}" != "200" && "${ADMIN_STATUS}" != "302" && "${ADMIN_STATUS}" != "307" && "${ADMIN_STATUS}" != "308" ]]; then
  echo "ADMIN ROUTE: FAILED - Expected 200/302/307/308, got ${ADMIN_STATUS}"
  exit 1
fi
echo "ADMIN ROUTE: OK"

echo "--- Testing admin API auth block: ${HOSTING_URL}/api/admin/users ---"
API_STATUS=$(http_get "${HOSTING_URL}/api/admin/users" "${API_BODY}")
if [[ "${API_STATUS}" != "401" ]]; then
  echo "ADMIN API AUTH: FAILED - Expected 401, got ${API_STATUS}"
  cat "${API_BODY}" || true
  exit 1
fi
echo "ADMIN API AUTH: OK"

echo "--- Testing Functions Health URL: ${FUNCTIONS_BASE_URL}/api_health ---"
FUNCTIONS_STATUS=$(http_get "${FUNCTIONS_BASE_URL}/api_health" "${FUNCTIONS_BODY}")
if [[ "${FUNCTIONS_STATUS}" != "200" ]]; then
  echo "FUNCTIONS HEALTH: FAILED - Expected 200, got ${FUNCTIONS_STATUS}"
  cat "${FUNCTIONS_BODY}" || true
  exit 1
fi
grep -q '"status":"ok"' "${FUNCTIONS_BODY}"
echo "FUNCTIONS HEALTH: OK"

echo "--- Testing Functions Auth (whoami): ${FUNCTIONS_BASE_URL}/admin_whoami ---"
AUTH_STATUS=$(curl -sSL -X POST -H "Content-Type: application/json" -o "${AUTH_BODY}" -w "%{http_code}" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}')
if [[ "${AUTH_STATUS}" != "401" && "${AUTH_STATUS}" != "403" ]]; then
  echo "FUNCTIONS AUTH: FAILED - Expected 401/403, got ${AUTH_STATUS}"
  cat "${AUTH_BODY}" || true
  exit 1
fi
if grep -Eq 'UNAUTHENTICATED|PERMISSION_DENIED|unauthenticated|permission' "${AUTH_BODY}"; then
  echo "FUNCTIONS AUTH: OK - Correctly blocked unauthenticated request."
else
  echo "FUNCTIONS AUTH: FAILED - Auth endpoint returned ${AUTH_STATUS} without an expected auth-denial marker."
  cat "${AUTH_BODY}" || true
  exit 1
fi

echo "--- SMOKE TESTS PASSED ---"
