#!/bin/bash
set -euo pipefail

export URAI_ADMIN_BASE_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
export URAI_ADMIN_FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"
export URAI_ADMIN_FIREBASE_PROJECT="${URAI_ADMIN_FIREBASE_PROJECT:-urai-4dc1d}"

EVIDENCE_DIR="${URAI_ADMIN_EVIDENCE_DIR:-.launch-evidence}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
EVIDENCE_FILE="${EVIDENCE_DIR}/production-launch-${TIMESTAMP}.log"
mkdir -p "${EVIDENCE_DIR}"

deployed=0

print_unwind() {
  local status="$?"
  echo
  echo "--- URAI Admin launch stopped ---"
  echo "Exit code: ${status}"
  echo "Evidence log: ${EVIDENCE_FILE}"
  echo
  echo "Unwind / recovery:"
  if [[ "${deployed}" == "1" ]]; then
    echo "1. Inspect Firebase Hosting releases: firebase hosting:releases:list --project ${URAI_ADMIN_FIREBASE_PROJECT}"
    echo "2. Roll back Hosting if needed: URAI_ADMIN_HOSTING_SITE=<site-id> URAI_ADMIN_ROLLBACK_RELEASE=<release-id> pnpm rollback:production"
    echo "3. If code/rules need rollback: URAI_ADMIN_ROLLBACK_COMMIT=<bad-commit-sha> pnpm rollback:production"
  else
    echo "1. No deploy completed before failure. Fix the failing gate and rerun: pnpm launch:production"
    echo "2. Verify auth/env locally: pnpm preflight:production"
  fi
  echo
  exit "${status}"
}
trap print_unwind ERR

run_step() {
  local name="$1"
  shift
  echo
  echo "--- ${name} ---"
  "$@"
}

{
  echo "--- URAI Admin production launch ---"
  echo "Timestamp UTC: ${TIMESTAMP}"
  echo "Hosting URL: ${URAI_ADMIN_BASE_URL}"
  echo "Functions URL: ${URAI_ADMIN_FUNCTIONS_BASE_URL}"
  echo "Firebase project: ${URAI_ADMIN_FIREBASE_PROJECT}"
  echo "Git commit: $(git rev-parse HEAD 2>/dev/null || echo unknown)"
  echo "Git branch: $(git branch --show-current 2>/dev/null || echo unknown)"

  if ! command -v pnpm >/dev/null 2>&1; then
    echo "ERROR: pnpm is required. Run: corepack enable && corepack prepare pnpm@9.15.0 --activate" >&2
    exit 1
  fi

  run_step "Install dependencies" pnpm install --frozen-lockfile=false

  if ! command -v firebase >/dev/null 2>&1; then
    if [[ -x "node_modules/.bin/firebase" ]]; then
      export PATH="$(pwd)/node_modules/.bin:${PATH}"
    else
      echo "ERROR: firebase-tools CLI is unavailable after install." >&2
      exit 1
    fi
  fi

  run_step "Full local release check" pnpm full:check
  run_step "Production preflight" pnpm preflight:production
  run_step "Deploy Firebase Hosting, Functions, Firestore, and Storage" pnpm run deploy
  deployed=1
  run_step "Smoke test deployed service" pnpm smoke-test
  run_step "Verify production live" pnpm verify:production

  echo
  echo "--- URAI Admin production launch complete ---"
  echo "Evidence log: ${EVIDENCE_FILE}"
} 2>&1 | tee "${EVIDENCE_FILE}"
