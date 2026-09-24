#!/bin/bash
set -euo pipefail

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

if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
  if [[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" || ! -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]]; then
    fail "GitHub rollback requires the temporary WIF/ADC credential file created by google-github-actions/auth."
  fi
else
  echo "INFO: Local rollback requires approved Google Application Default Credentials. Firebase CLI tokens are not supported."
fi

if [[ -z "${HOSTING_SITE}" ]]; then
  fail "URAI_ADMIN_HOSTING_SITE is required. Set it to the Firebase Hosting site ID for urai-admin."
fi

if [[ -z "${ROLLBACK_RELEASE}" && -z "${ROLLBACK_COMMIT}" ]]; then
  fail "Set URAI_ADMIN_ROLLBACK_RELEASE for Firebase Hosting rollback or URAI_ADMIN_ROLLBACK_COMMIT for code/rules rollback guidance."
fi

echo "Hosting site: ${HOSTING_SITE}"

if [[ -n "${ROLLBACK_RELEASE}" ]]; then
  echo "Rollback release: ${ROLLBACK_RELEASE}"
  echo "About to clone Firebase Hosting version from release ${ROLLBACK_RELEASE}."
  firebase hosting:clone "${HOSTING_SITE}:${ROLLBACK_RELEASE}" "${HOSTING_SITE}:live" --project "${PROJECT_ID}"
  echo "OK: Firebase Hosting rollback command completed."
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

Direct local `pnpm deploy` is not production rollback authority.
EOF
fi

echo "--- Rollback helper completed ---"