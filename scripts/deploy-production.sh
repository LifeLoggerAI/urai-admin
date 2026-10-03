#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

DEPLOY_MARKER="${URAI_ADMIN_DEPLOY_MARKER:-tmp/urai-admin-target-deployed.json}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[[ "${GITHUB_ACTIONS:-}" == "true" ]] || fail "Direct local production deploy is disabled. Use the protected Deploy URAI Admin GitHub Actions workflow."
[[ "${GITHUB_REF:-}" == "refs/heads/main" ]] || fail "Production deploy must run from the protected main workflow context."
[[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]] || fail "Production deploy requires the temporary WIF/ADC credential file created by google-github-actions/auth."
[[ "${URAI_ADMIN_TARGET_SHA:-}" =~ ^[0-9a-f]{40}$ ]] || fail "URAI_ADMIN_TARGET_SHA must be the approved exact 40-character SHA."
[[ "$(git rev-parse HEAD)" == "${URAI_ADMIN_TARGET_SHA}" ]] || fail "Checked-out source does not match URAI_ADMIN_TARGET_SHA."

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
