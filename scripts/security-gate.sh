#!/bin/bash
set -euo pipefail

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

require_file() {
  local path="$1"
  [[ -f "$path" ]] || fail "Missing required file: $path"
}

forbidden_pattern() {
  local path="$1"
  local pattern="$2"
  if grep -Eq "$pattern" "$path"; then
    fail "Forbidden rule pattern found in $path: $pattern"
  fi
}

required_pattern() {
  local path="$1"
  local pattern="$2"
  if ! grep -Eq "$pattern" "$path"; then
    fail "Required rule pattern missing in $path: $pattern"
  fi
}

forbidden_recursive() {
  local pattern="$1"
  local target="$2"
  local message="$3"

  if grep -RInE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git "$pattern" "$target" 2>/dev/null; then
    fail "$message"
  fi
}

echo "--- URAI Admin security gate ---"

require_file "firebase.json"
require_file ".firebaserc"
require_file "firestore.rules"
require_file "storage.rules"
require_file "apps/urai-admin/src/lib/firebase-admin.ts"
require_file "apps/urai-admin/src/lib/firebase/admin.ts"
require_file "apps/urai-admin/src/lib/admin/require-admin-session.ts"
require_file "apps/urai-admin/src/app/api/auth/login/route.ts"
require_file "apps/urai-admin/src/app/api/auth/logout/route.ts"
require_file "apps/urai-admin/src/app/api/auth/admin-session/route.ts"
require_file "apps/urai-admin/src/middleware.ts"
require_file "functions/src/index.ts"
require_file "scripts/package-next-for-functions.sh"

forbidden_pattern "firestore.rules" "allow[[:space:]]+(read|write|create|update|delete|list|get)(,[[:space:]]*(read|write|create|update|delete|list|get))*:[[:space:]]*if[[:space:]]+true"
forbidden_pattern "storage.rules" "allow[[:space:]]+(read|write|create|update|delete|list|get)(,[[:space:]]*(read|write|create|update|delete|list|get))*:[[:space:]]*if[[:space:]]+true"

required_pattern "firestore.rules" "match /\{document=\*\*\}"
required_pattern "firestore.rules" "allow read, write: if false"
required_pattern "firestore.rules" "request.auth.token.role in \['owner', 'admin', 'viewer'\]"
required_pattern "firestore.rules" "request.auth.token.admin == true"
required_pattern "storage.rules" "allow read, write: if false"
required_pattern "firebase.json" '"target": "admin"'
required_pattern "firebase.json" '"public": "apps/urai-admin/public"'
required_pattern "firebase.json" '"function": "nextServer"'
required_pattern "functions/src/index.ts" "const nextApp = next"
required_pattern "functions/src/index.ts" "distDir: \"../.next\""
required_pattern "scripts/package-next-for-functions.sh" "APP_DIR="
required_pattern "scripts/package-next-for-functions.sh" "FUNCTIONS_DIR="
required_pattern "scripts/package-next-for-functions.sh" "NEXT_PACKAGE_DIR="
required_pattern "scripts/package-next-for-functions.sh" "cp -R"
required_pattern "scripts/package-next-for-functions.sh" "\.next"
required_pattern ".firebaserc" '"default": "urai-4dc1d"'
required_pattern ".firebaserc" '"admin": "urai-4dc1d"'
required_pattern ".firebaserc" '"admin": \['
required_pattern ".firebaserc" '"urai-admin"'
required_pattern "apps/urai-admin/src/lib/firebase-admin.ts" "firestore as db|const db = firestore|export const db = firestore"
required_pattern "apps/urai-admin/src/lib/firebase-admin.ts" "adminApp"
required_pattern "apps/urai-admin/src/lib/firebase-admin.ts" "adminDb"
required_pattern "apps/urai-admin/src/lib/firebase-admin.ts" "from './firebase/admin'"
required_pattern "apps/urai-admin/src/lib/admin/require-admin-session.ts" "verifySessionCookie"
required_pattern "apps/urai-admin/src/lib/admin/require-admin-session.ts" "isActive"
required_pattern "apps/urai-admin/src/app/api/auth/login/route.ts" "verifyIdToken"
required_pattern "apps/urai-admin/src/app/api/auth/login/route.ts" "createSessionCookie"
required_pattern "apps/urai-admin/src/app/api/auth/logout/route.ts" "maxAge: 0"
required_pattern "apps/urai-admin/src/app/api/auth/admin-session/route.ts" "requireAdminSession"
required_pattern "apps/urai-admin/src/middleware.ts" "admin-session"
required_pattern "apps/urai-admin/src/middleware.ts" "verification.ok"

forbidden_recursive "headers\.get\(['\"]x-user-id['\"]\)" "apps/urai-admin/src/app/api" "Trusted x-user-id header found in API route"
forbidden_recursive "request\.headers\.get\(['\"]Authorization['\"]\)\?\.split\(['\"]Bearer " "apps/urai-admin/src/app/api/admin" "Admin route using Authorization bearer session parsing found"

if [[ -d "apps/urai-admin/src/app/api/qa" ]]; then
  required_pattern "apps/urai-admin/src/app/api/qa/logs/route.ts" "requireAdminSession"
  required_pattern "apps/urai-admin/src/app/api/qa/logs/route.ts" "\['owner'\]"
fi

# Public client code must never reference secret-like env vars. Server-only Admin SDK
# config may reference FIREBASE_PRIVATE_KEY or service-account env vars intentionally.
if grep -R "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*PRIVATE_KEY\|SECRET_KEY" apps/urai-admin/src functions/src 2>/dev/null; then
  fail "Potential public secret-like variable or hardcoded secret marker found"
fi

if grep -RInE "-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----|AIza[0-9A-Za-z_-]{20,}" apps/urai-admin/src functions/src 2>/dev/null; then
  fail "Potential hardcoded private key or Firebase API key literal found"
fi

echo "--- Security gate passed ---"
