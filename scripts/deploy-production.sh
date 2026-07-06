#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

DEPLOY_MARKER="${URAI_ADMIN_DEPLOY_MARKER:-tmp/urai-admin-target-deployed.json}"

echo "--- URAI Admin production deploy ---"
echo "--- Verifying production readiness before deploy ---"
pnpm preflight:production

echo "--- Building production artifacts ---"
pnpm build

echo "--- Deploying Firebase hosting, functions, Firestore, and Storage to urai-4dc1d ---"
firebase deploy --only hosting,functions,firestore,storage -P urai-4dc1d

mkdir -p "$(dirname "${DEPLOY_MARKER}")"
cat > "${DEPLOY_MARKER}" <<EOF
{
  "project": "urai-4dc1d",
  "commitSha": "$(git rev-parse HEAD)",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "--- Verifying live production deployment ---"
pnpm verify:production
pnpm smoke-test

echo "--- URAI Admin production deploy complete ---"
