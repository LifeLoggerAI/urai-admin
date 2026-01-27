#!/bin/bash
set -e -o pipefail

# Log file setup
TIMESTAMP=$(date +%s)
LOG_FILE="/tmp/urai_admin_finish_${TIMESTAMP}.log"
exec &> >(tee -a "${LOG_FILE}")

echo "--- Script started at $(date) ---"

# Tool versions
echo "--- Tool Versions ---"
node -v
pnpm -v
firebase --version

# Backup modified files
echo "--- Backing up files ---"
FILES_TO_BACKUP=(
  "apps/urai-admin/package.json"
  "firebase.json"
)
for FILE in "${FILES_TO_BACKUP[@]}"; do
  if [ -f "$FILE" ]; then
    cp "$FILE" "${FILE}.bak.${TIMESTAMP}"
    echo "Backed up $FILE to ${FILE}.bak.${TIMESTAMP}"
  fi
done

# Apply patches
echo "--- Applying patches ---"
patch -p1 < urai_admin_health_endpoint.diff
patch -p1 < urai_admin_middleware.diff
patch -p1 < urai_admin_package_json.diff
patch -p1 < urai_admin_dashboard.diff
patch -p1 < urai_admin_system_status.diff
patch -p1 < firebase_json.diff
patch -p1 < env_example.diff

# Clean artifacts
echo "--- Cleaning artifacts ---"
rm -rf apps/urai-admin/node_modules apps/urai-admin/.next apps/urai-admin/dist

# Install dependencies
echo "--- Installing dependencies ---"
pnpm install --frozen-lockfile || pnpm install

# Typecheck and build
echo "--- Typechecking and building ---"
pnpm -F urai-admin typecheck
pnpm -F urai-admin build

# Run local smoke test
echo "--- Running local smoke test ---"
pnpm -F urai-admin start &
SERVER_PID=$!
sleep 5 # wait for server to start
pnpm -F urai-admin smoke
kill $SERVER_PID

# Deploy to Firebase
echo "--- Deploying to Firebase ---"
firebase deploy --only hosting --project urai-admin

# Post-deploy smoke tests
echo "--- Running post-deploy smoke tests ---"
LIVE_URL=$(firebase hosting:channel:open --project urai-admin | grep -o 'https://.*')
echo "Live URL: $LIVE_URL"
curl --fail "${LIVE_URL}/api/health"
curl -s -o /dev/null -w '%{http_code}' "${LIVE_URL}/admin" | grep -E '200|302'

echo "--- Script finished at $(date) ---"
echo "LOG=${LOG_FILE}"
echo "STATUS=OK"
