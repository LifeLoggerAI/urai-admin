#!/bin/bash
set -euo pipefail

missing=0
PRODUCTION_FIREBASE_PROJECT_ID="urai-4dc1d"

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

is_placeholder_or_legacy() {
  local value="${1:-}"
  [[ -z "${value}" || "${value}" == "your_project_id" || "${value}" == "urai-8025b" ]]
}

copy_preferred_env() {
  local target="$1"
  shift

  local current="${!target:-}"
  if ! is_placeholder_or_legacy "${current}"; then
    return 0
  fi

  local source
  for source in "$@"; do
    if [[ -n "${!source:-}" && "${!source}" != "your_project_id" ]]; then
      printf -v "${target}" '%s' "${!source}"
      export "${target}"
      echo "OK: ${target} normalized from ${source}"
      return 0
    fi
  done
}

set_default_env() {
  local target="$1"
  local value="$2"
  if [[ -z "${!target:-}" || "${!target}" == "your_project_id" ]]; then
    printf -v "${target}" '%s' "${value}"
    export "${target}"
    echo "OK: ${target} defaulted for production launch"
  fi
}

prefer_production_project_id() {
  if [[ "${VITE_FIREBASE_PROJECT_ID:-}" == "${PRODUCTION_FIREBASE_PROJECT_ID}" ]]; then
    export NEXT_PUBLIC_FIREBASE_PROJECT_ID="${VITE_FIREBASE_PROJECT_ID}"
    echo "OK: NEXT_PUBLIC_FIREBASE_PROJECT_ID forced from VITE_FIREBASE_PROJECT_ID for production"
    return 0
  fi

  if [[ "${FIREBASE_PROJECT_ID:-}" == "${PRODUCTION_FIREBASE_PROJECT_ID}" ]]; then
    export NEXT_PUBLIC_FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID}"
    echo "OK: NEXT_PUBLIC_FIREBASE_PROJECT_ID forced from FIREBASE_PROJECT_ID for production"
    return 0
  fi
}

normalize_env_aliases() {
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_API_KEY" "VITE_FIREBASE_API_KEY" "FIREBASE_API_KEY" "NEXT_PUBLIC_FIREBASE_APIKEY"
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "VITE_FIREBASE_AUTH_DOMAIN" "FIREBASE_AUTH_DOMAIN" "NEXT_PUBLIC_FIREBASE_AUTHDOMAIN"
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "VITE_FIREBASE_PROJECT_ID" "FIREBASE_PROJECT_ID" "GCLOUD_PROJECT" "GOOGLE_CLOUD_PROJECT" "NEXT_PUBLIC_FIREBASE_PROJECTID"
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "VITE_FIREBASE_STORAGE_BUCKET" "FIREBASE_STORAGE_BUCKET" "NEXT_PUBLIC_FIREBASE_STORAGEBUCKET"
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "VITE_FIREBASE_MESSAGING_SENDER_ID" "FIREBASE_MESSAGING_SENDER_ID" "NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID"
  copy_preferred_env "NEXT_PUBLIC_FIREBASE_APP_ID" "VITE_FIREBASE_APP_ID" "FIREBASE_APP_ID" "NEXT_PUBLIC_FIREBASE_APPID"

  prefer_production_project_id

  set_default_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "${PRODUCTION_FIREBASE_PROJECT_ID}.appspot.com"

  if [[ -z "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:-}" ]]; then
    echo "WARN: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is not set. Continuing because deploy does not require it."
  fi

  if [[ -z "${NEXT_PUBLIC_FIREBASE_APP_ID:-}" ]]; then
    echo "WARN: NEXT_PUBLIC_FIREBASE_APP_ID is not set. Continuing because deploy does not require it."
  fi
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

require_firebase_auth() {
  if [[ -n "${FIREBASE_TOKEN:-}" ]]; then
    echo "OK: FIREBASE_TOKEN is set"
    return 0
  fi

  if command -v firebase >/dev/null 2>&1 && firebase login:list >/dev/null 2>&1; then
    echo "OK: Firebase CLI login is available"
    return 0
  fi

  echo "ERROR: Missing Firebase deploy auth. Set FIREBASE_TOKEN or run firebase login." >&2
  missing=1
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

load_env_file ".env"
load_env_file ".env.local"
load_env_file ".env.production"
load_env_file ".env.production.local"
load_env_file "apps/urai-admin/.env"
load_env_file "apps/urai-admin/.env.local"
load_env_file "apps/urai-admin/.env.production"
load_env_file "apps/urai-admin/.env.production.local"
normalize_env_aliases

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

require_firebase_auth
require_env "NEXT_PUBLIC_FIREBASE_API_KEY"
require_env "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
require_env "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
require_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"

if [[ "${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" != "${PRODUCTION_FIREBASE_PROJECT_ID}" ]]; then
  echo "ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID must be ${PRODUCTION_FIREBASE_PROJECT_ID} for production deploy" >&2
  missing=1
else
  echo "OK: production Firebase project is ${PRODUCTION_FIREBASE_PROJECT_ID}"
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
