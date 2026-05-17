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

print_preview() {
  local path="$1"
  if [[ -f "${path}" ]]; then
    echo "--- Response preview: ${path} ---"
    head -c 1200 "${path}" || true
    echo
    echo "--- End response preview ---"
  fi
}

http_get() {
  local url="$1"
  local body_path="$2"
  curl -sSL -o "${body_path}" -w "%{http_code}" "${url}"
}

echo "--- Testing public product homepage: ${HOSTING_URL}/ ---"
PUBLIC_STATUS=$(http_get "${HOSTING_URL}/" "${PUBLIC_BODY}")
echo "PUBLIC SITE STATUS: ${PUBLIC_STATUS}"
if [[ "${PUBLIC_STATUS}" != "200" ]]; then
  echo "PUBLIC SITE: FAILED - Expected 200, got ${PUBLIC_STATUS}"
  print_preview "${PUBLIC_BODY}"
  exit 1
fi
if ! grep -Eq "URAI Admin|URAI|urai-admin" "${PUBLIC_BODY}"; then
  echo "PUBLIC SITE: FAILED - Expected homepage body to identify URAI Admin/URAI."
  print_preview "${PUBLIC_BODY}"
  exit 1
fi
echo "PUBLIC SITE: OK"

echo "--- Testing protected admin redirect: ${HOSTING_URL}/admin ---"
ADMIN_STATUS=$(curl -sSL -o /dev/null -w "%{http_code}" "${HOSTING_URL}/admin")
echo "ADMIN ROUTE STATUS: ${ADMIN_STATUS}"
if [[ "${ADMIN_STATUS}" != "200" && "${ADMIN_STATUS}" != "302" && "${ADMIN_STATUS}" != "307" && "${ADMIN_STATUS}" != "308" ]]; then
  echo "ADMIN ROUTE: FAILED - Expected 200/302/307/308, got ${ADMIN_STATUS}"
  exit 1
fi
echo "ADMIN ROUTE: OK"

echo "--- Testing admin API auth block: ${HOSTING_URL}/api/admin/users ---"
API_STATUS=$(http_get "${HOSTING_URL}/api/admin/users" "${API_BODY}")
echo "ADMIN API STATUS: ${API_STATUS}"
if [[ "${API_STATUS}" != "401" ]]; then
  echo "ADMIN API AUTH: FAILED - Expected 401, got ${API_STATUS}"
  print_preview "${API_BODY}"
  exit 1
fi
echo "ADMIN API AUTH: OK"

echo "--- Testing Functions Health URL: ${FUNCTIONS_BASE_URL}/api_health ---"
FUNCTIONS_STATUS=$(http_get "${FUNCTIONS_BASE_URL}/api_health" "${FUNCTIONS_BODY}")
echo "FUNCTIONS HEALTH STATUS: ${FUNCTIONS_STATUS}"
if [[ "${FUNCTIONS_STATUS}" != "200" ]]; then
  echo "FUNCTIONS HEALTH: FAILED - Expected 200, got ${FUNCTIONS_STATUS}"
  print_preview "${FUNCTIONS_BODY}"
  exit 1
fi
if ! grep -q '"status":"ok"' "${FUNCTIONS_BODY}"; then
  echo "FUNCTIONS HEALTH: FAILED - Expected JSON status ok."
  print_preview "${FUNCTIONS_BODY}"
  exit 1
fi
echo "FUNCTIONS HEALTH: OK"

echo "--- Testing Functions Auth (whoami): ${FUNCTIONS_BASE_URL}/admin_whoami ---"
AUTH_STATUS=$(curl -sSL -X POST -H "Content-Type: application/json" -o "${AUTH_BODY}" -w "%{http_code}" "${FUNCTIONS_BASE_URL}/admin_whoami" -d '{}')
echo "FUNCTIONS AUTH STATUS: ${AUTH_STATUS}"
if [[ "${AUTH_STATUS}" != "401" && "${AUTH_STATUS}" != "403" ]]; then
  echo "FUNCTIONS AUTH: FAILED - Expected 401/403, got ${AUTH_STATUS}"
  print_preview "${AUTH_BODY}"
  exit 1
fi
if grep -Eq 'UNAUTHENTICATED|PERMISSION_DENIED|unauthenticated|permission' "${AUTH_BODY}"; then
  echo "FUNCTIONS AUTH: OK - Correctly blocked unauthenticated request."
else
  echo "FUNCTIONS AUTH: FAILED - Auth endpoint returned ${AUTH_STATUS} without an expected auth-denial marker."
  print_preview "${AUTH_BODY}"
  exit 1
fi

echo "--- SMOKE TESTS PASSED ---"
