#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

PROJECT_ID="${URAI_ADMIN_FIREBASE_PROJECT:-urai-4dc1d}"
HOSTING_SITE="${URAI_ADMIN_HOSTING_SITE:-}"
ROLLBACK_RELEASE="${URAI_ADMIN_ROLLBACK_RELEASE:-}"
ROLLBACK_COMMIT="${URAI_ADMIN_ROLLBACK_COMMIT:-}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

echo "--- URAI Admin production rollback helper ---"
echo "Project: ${PROJECT_ID}"

[[ "${GITHUB_ACTIONS:-}" == "true" ]] || fail "Direct local production rollback is disabled. Use the protected production workflow."
[[ "${GITHUB_REF:-}" == "refs/heads/main" ]] || fail "Production rollback must run from the protected main workflow context."
[[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]] || fail "GitHub rollback requires the temporary WIF/ADC credential file created by google-github-actions/auth."
[[ "${PROJECT_ID}" == "urai-4dc1d" ]] || fail "Admin rollback project must be urai-4dc1d."
[[ "${URAI_ADMIN_TARGET_SHA:-}" =~ ^[0-9a-f]{40}$ ]] || fail "URAI_ADMIN_TARGET_SHA must name the approved exact current source."
[[ "$(git rev-parse HEAD)" == "${URAI_ADMIN_TARGET_SHA}" ]] || fail "Checked-out source does not match approved current source."

if [[ -z "${HOSTING_SITE}" ]]; then
  fail "URAI_ADMIN_HOSTING_SITE is required. Set it to the Firebase Hosting site ID for urai-admin."
fi

if [[ -z "${ROLLBACK_RELEASE}" && -z "${ROLLBACK_COMMIT}" ]]; then
  fail "Set URAI_ADMIN_ROLLBACK_RELEASE for Firebase Hosting rollback or URAI_ADMIN_ROLLBACK_COMMIT for code/rules rollback guidance."
fi

[[ "${ROLLBACK_COMMIT}" =~ ^[0-9a-f]{40}$ ]] || fail "URAI_ADMIN_ROLLBACK_COMMIT must name the approved exact known-good source, including Hosting release rollback."
[[ "${ROLLBACK_COMMIT}" != "${URAI_ADMIN_TARGET_SHA}" ]] || fail "Known-good rollback source must differ from current source."
git merge-base --is-ancestor "${ROLLBACK_COMMIT}" "${URAI_ADMIN_TARGET_SHA}" || fail "Known-good rollback source must be an ancestor of the approved current source."
node scripts/validate-admin-hosting-target.mjs --require-bound

echo "Hosting site: ${HOSTING_SITE}"

if [[ -n "${ROLLBACK_RELEASE}" ]]; then
  echo "Rollback release: ${ROLLBACK_RELEASE}"
  echo "About to clone Firebase Hosting version from release ${ROLLBACK_RELEASE}."
  firebase hosting:clone "${HOSTING_SITE}:${ROLLBACK_RELEASE}" "${HOSTING_SITE}:live" --project "${PROJECT_ID}"
  echo "OK: Firebase Hosting rollback command completed."
  URAI_ADMIN_EXPECTED_LIVE_SHA="${ROLLBACK_COMMIT}" bash scripts/verify-production-live.sh
fi

if [[ -n "${ROLLBACK_COMMIT}" ]]; then
  echo "Rollback commit: ${ROLLBACK_COMMIT}"
  cat <<EOF
Code/rules rollback requires a Git revert or redeploy from the known-good commit.

Recommended governed recovery steps:
1. identify the exact known-good rollback SHA and current failed/live SHA;
2. prepare a reviewed main-line recovery commit or use the protected workflow's approved automatic rollback path;
3. run fresh exact-head verification on the recovery authority;
4. dispatch production recovery only from the protected GitHub production environment using WIF/ADC;
5. verify the exact deployed revision, protected auth boundary, monitoring, and provider readback;
6. record the workflow run, principal, target/rollback identities, verification result, and audit evidence in docs/EVIDENCE_LOG.md.

Direct local package-manager deployment is not production rollback authority.
EOF
fi

echo "--- Rollback helper completed ---"
