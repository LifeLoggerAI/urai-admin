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

echo "--- URAI Admin production preflight ---"

require_file "firebase.json"
require_file "firestore.rules"
require_file "firestore.indexes.json"
require_file "apps/urai-admin/package.json"
require_file "apps/urai-admin/src/app/api/auth/login/route.ts"
require_file "apps/urai-admin/src/app/api/auth/logout/route.ts"
require_file "apps/urai-admin/src/lib/admin/require-admin-session.ts"
require_file "apps/urai-admin/src/hooks/useAuth.tsx"
require_file "functions/package.json"
require_file "functions/src/index.ts"

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
fi

if ! grep -q '"source": "apps/urai-admin"' firebase.json; then
  echo "ERROR: firebase.json hosting source must be apps/urai-admin" >&2
  missing=1
else
  echo "OK: firebase.json hosting source points to apps/urai-admin"
fi

if ! grep -q '"runtime": "nodejs20"' firebase.json; then
  echo "ERROR: firebase.json functions runtime must be nodejs20" >&2
  missing=1
else
  echo "OK: firebase.json functions runtime is nodejs20"
fi

if [[ "${missing}" != "0" ]]; then
  echo "--- Production preflight failed ---" >&2
  exit 1
fi

echo "--- Production preflight passed ---"
