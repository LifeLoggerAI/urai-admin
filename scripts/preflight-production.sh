#!/bin/bash
set -euo pipefail

missing=0

load_env_file() {
  local path="$1"
  if [[ ! -f "${path}" ]]; then
    return 0
  fi

  echo "OK: loading environment from ${path}"
  set -a
  # shellcheck disable=SC1090
  source "${path}"
  set +a
}

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

# Load local env files in the same spirit as Next/Firebase tooling, without
# committing secret values to the repository. Later files override earlier ones.
load_env_file ".env"
load_env_file ".env.local"
load_env_file ".env.production"
load_env_file ".env.production.local"
load_env_file "apps/urai-admin/.env"
load_env_file "apps/urai-admin/.env.local"
load_env_file "apps/urai-admin/.env.production"
load_env_file "apps/urai-admin/.env.production.local"

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
else
  echo "OK: production Firebase project is urai-4dc1d"
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
