#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

BASE_URL="${URAI_ADMIN_BASE_URL:-https://urai-admin.web.app}"
FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"
EVIDENCE_DIR="${URAI_ADMIN_EVIDENCE_DIR:-tmp}"
EVIDENCE_FILE="${EVIDENCE_DIR}/urai-admin-launch-evidence.md"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
COMMIT_SHA="$(git rev-parse HEAD 2>/dev/null || echo unknown)"

mkdir -p "${EVIDENCE_DIR}"

run_step() {
  local label="$1"
  shift
  echo "--- ${label} ---"
  "$@"
}

{
  echo "# URAI Admin launch evidence"
  echo
  echo "Started at: ${STARTED_AT}"
  echo "Commit SHA: ${COMMIT_SHA}"
  echo "Firebase project: urai-4dc1d"
  echo "Base URL: ${BASE_URL}"
  echo "Functions base URL: ${FUNCTIONS_BASE_URL}"
  echo
  echo "## Commands"
} > "${EVIDENCE_FILE}"

record_success() {
  local command_label="$1"
  echo "- PASS: ${command_label}" >> "${EVIDENCE_FILE}"
}

record_failure() {
  local command_label="$1"
  echo "- FAIL: ${command_label}" >> "${EVIDENCE_FILE}"
  echo >> "${EVIDENCE_FILE}"
  echo "Completed at: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "${EVIDENCE_FILE}"
  echo "Final status: FAILED" >> "${EVIDENCE_FILE}"
}

run_and_record() {
  local label="$1"
  shift
  if run_step "${label}" "$@"; then
    record_success "${label}"
  else
    record_failure "${label}"
    echo "Launch lock failed at: ${label}" >&2
    echo "Evidence written to ${EVIDENCE_FILE}" >&2
    exit 1
  fi
}

run_and_record "pnpm preflight:production" pnpm preflight:production
run_and_record "pnpm release:lock" pnpm release:lock
run_and_record "pnpm run deploy:production" pnpm run deploy:production
run_and_record "pnpm verify:production" env URAI_ADMIN_BASE_URL="${BASE_URL}" URAI_ADMIN_FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL}" pnpm verify:production
run_and_record "pnpm test:smoke" env URAI_ADMIN_BASE_URL="${BASE_URL}" URAI_ADMIN_FUNCTIONS_BASE_URL="${FUNCTIONS_BASE_URL}" pnpm test:smoke

{
  echo
  echo "Completed at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Final status: PASSED"
} >> "${EVIDENCE_FILE}"

echo "--- URAI Admin launch lock passed ---"
echo "Evidence written to ${EVIDENCE_FILE}"