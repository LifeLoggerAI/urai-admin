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

echo "--- URAI Admin security gate ---"

require_file "firestore.rules"
require_file "storage.rules"
require_file "apps/urai-admin/src/lib/admin/require-admin-session.ts"
require_file "apps/urai-admin/src/app/api/auth/login/route.ts"
require_file "apps/urai-admin/src/app/api/auth/logout/route.ts"
require_file "apps/urai-admin/src/middleware.ts"

forbidden_pattern "firestore.rules" "allow[[:space:]]+(read|write|create|update|delete|list|get)(,[[:space:]]*(read|write|create|update|delete|list|get))*:[[:space:]]*if[[:space:]]+true"
forbidden_pattern "storage.rules" "allow[[:space:]]+(read|write|create|update|delete|list|get)(,[[:space:]]*(read|write|create|update|delete|list|get))*:[[:space:]]*if[[:space:]]+true"

required_pattern "firestore.rules" "match /\{document=\*\*\}"
required_pattern "firestore.rules" "allow read, write: if false"
required_pattern "firestore.rules" "request.auth.token.role in \['owner', 'admin', 'viewer'\]"
required_pattern "firestore.rules" "request.auth.token.admin == true"
required_pattern "storage.rules" "allow read, write: if false"
required_pattern "apps/urai-admin/src/lib/admin/require-admin-session.ts" "verifySessionCookie"
required_pattern "apps/urai-admin/src/lib/admin/require-admin-session.ts" "isActive"
required_pattern "apps/urai-admin/src/app/api/auth/login/route.ts" "verifyIdToken"
required_pattern "apps/urai-admin/src/app/api/auth/login/route.ts" "createSessionCookie"
required_pattern "apps/urai-admin/src/app/api/auth/logout/route.ts" "maxAge: 0"
required_pattern "apps/urai-admin/src/middleware.ts" "__session"

if grep -R "NEXT_PUBLIC_.*SECRET\|SECRET_KEY\|PRIVATE_KEY" apps/urai-admin/src functions/src 2>/dev/null; then
  fail "Potential secret-like public variable or hardcoded secret marker found"
fi

echo "--- Security gate passed ---"
