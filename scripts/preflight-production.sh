#!/bin/bash
set -euo pipefail

missing=0

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "ERROR: Missing required environment variable: ${name}" >&2
    missing=1
  else
    echo "OK: ${name} is set"
  fi
}

require_file() {
  local path="$1"
  if [[ ! -f "${path}" ]]; then
    echo "ERROR: Missing required file: ${path}" >&2
    missing=1
  else
    echo "OK: ${path} exists"
  fi
}

require_grep() {
  local pattern="$1"
  local path="$2"
  local message="$3"
  if ! grep -qE "${pattern}" "${path}"; then
    echo "ERROR: ${message}" >&2
    missing=1
  else
    echo "OK: ${message}"
  fi
}

echo "--- URAI Admin production preflight ---"

require_file "firebase.json"
require_file ".firebaserc"
require_file "firestore.rules"
require_file "storage.rules"
require_file "firestore.indexes.json"
require_file "apps/urai-admin/package.json"
require_file "apps/urai-admin/.env.example"
require_file "apps/urai-admin/src/app/api/auth/login/route.ts"
require_file "apps/urai-admin/src/app/api/auth/logout/route.ts"
require_file "apps/urai-admin/src/lib/admin/require-admin-session.ts"
require_file "apps/urai-admin/src/hooks/useAuth.tsx"
require_file "functions/package.json"
require_file "functions/src/index.ts"
require_file "docs/DEPLOYMENT_RUNBOOK.md"
require_file "docs/EVIDENCE_LOG.md"
require_file "docs/URAI_ADMIN_STANDALONE_READINESS.md"
require_file "scripts/smoke-test.sh"
require_file "scripts/verify-production-live.sh"

require_env "FIREBASE_TOKEN"
require_env "NEXT_PUBLIC_FIREBASE_API_KEY"
require_env "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
require_env "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
require_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
require_env "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
require_env "NEXT_PUBLIC_FIREBASE_APP_ID"

if [[ "${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" != "urai-4dc1d" ]]; then
  echo "ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID must be urai-4dc1d for production deploy" >&2
  missing=1
else
  echo "OK: production Firebase project is urai-4dc1d"
fi

require_grep '"source": "apps/urai-admin"' "firebase.json" "firebase.json hosting source points to apps/urai-admin"
require_grep '"runtime": "nodejs20"' "firebase.json" "firebase.json functions runtime is nodejs20"
require_grep '"admin": "urai-4dc1d"' ".firebaserc" ".firebaserc has admin project alias for urai-4dc1d"
require_grep 'allow read, write: if false;' "storage.rules" "storage rules remain deny-all by default"
require_grep 'allow read, write: if false;' "firestore.rules" "firestore rules contain default deny"
require_grep 'request.auth.token.admin == true' "firestore.rules" "firestore rules require admin custom claim"
require_grep 'verifySessionCookie\(sessionCookie, true\)' "apps/urai-admin/src/lib/admin/require-admin-session.ts" "admin sessions verify revocation-aware Firebase session cookies"
require_grep 'Previous known-good' "docs/DEPLOYMENT_RUNBOOK.md" "deployment runbook includes rollback evidence requirements"
require_grep 'Final status:' "docs/EVIDENCE_LOG.md" "evidence log includes final status field"

if grep -q '"default": "urai-8025b"' .firebaserc; then
  echo "WARNING: .firebaserc still contains default project urai-8025b. Deploy scripts must use explicit -P urai-4dc1d. Do not rely on firebase use/default." >&2
fi

if [[ "${missing}" != "0" ]]; then
  echo "--- Production preflight failed ---" >&2
  exit 1
fi

echo "--- Production preflight passed ---"
