#!/bin/bash
set -euo pipefail
echo "--- RUNNING SMOKE TESTS ---"
HOSTING_URL=$(firebase hosting:channel:list --project urai-4dc1d | grep 'admin' | grep 'Live' | awk '{print $3}')
FUNCTIONS_BASE_URL="https://us-central1-urai-4dc1d.cloudfunctions.net"

echo "--- Testing Hosting URL: ${HOSTING_URL}/admin/ ---"
curl -sSfL --fail-with-body "${HOSTING_URL}/admin/" | grep -q "URAI Admin"
echo "HOSTING: OK"

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
