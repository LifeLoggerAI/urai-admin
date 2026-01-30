#!/bin/bash
set -euo pipefail

# --- CONFIGURATION ---
TIMESTAMP=$(date +"%Y%m%dT%H%M%S")
PROJECT_ID="urai-admin"
REPO_ROOT=""
LOG_FILE="/tmp/${PROJECT_ID}_ship_lock_${TIMESTAMP}.log"
EMULATOR_PIDS=""

# --- LOGGING ---
exec > >(tee -a "$LOG_FILE") 2>&1
echo "LOG=START: Firebase Studio Shipmaster for ${PROJECT_ID} - ${TIMESTAMP}"

# --- CLEANUP ---
cleanup() {
  echo "LOG=CLEANUP: Starting cleanup..."
  if [ -n "$EMULATOR_PIDS" ]; then
    echo "LOG=CLEANUP: Stopping Firebase Emulators (PIDs: $EMULATOR_PIDS)..."
    kill $EMULATOR_PIDS || true
  fi
  echo "LOG=CLEANUP: Done."
  echo "LOG=END: Script finished."
}
trap cleanup EXIT

# --- REPO DISCOVERY ---
echo "LOG=INFO: Discovering project repo root..."
# Find directories containing firebase.json with the correct project ID
CANDIDATE_DIRS=$(find /home/user -name "firebase.json" -exec grep -l -E "\\"\\"${PROJECT_ID}\\"\\"" {} + 2>/dev/null | xargs -I {} dirname {})

for dir in $CANDIDATE_DIRS; do
  # Check for strong indicators of being the correct project root
  if [ -f "$dir/pnpm-workspace.yaml" ] && [ -d "$dir/apps/urai-admin" ] && [ -f "$dir/apps/urai-admin/package.json" ]; then
    REPO_ROOT="$dir"
    break
  fi
done

if [ -z "$REPO_ROOT" ]; then
  echo "LOG=ERROR: Could not find a valid repo root for project ${PROJECT_ID}." >&2
  echo "LOG=ERROR: Searched for a directory with 'firebase.json' (containing '${PROJECT_ID}'), 'pnpm-workspace.yaml', and the 'apps/urai-admin' directory." >&2
  exit 1
fi

cd "$REPO_ROOT"
echo "LOG=SUCCESS: Found and validated repo root at ${REPO_ROOT}"

# --- FILE EXISTENCE CHECK ---
echo "LOG=INFO: Verifying required files and directories exist..."
REQUIRED_FILES=(
  "firebase.json"
  "firestore.rules"
  "storage.rules"
  "apps/urai-admin/package.json"
  "functions/package.json"
  "functions/src/index.ts"
)
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ] && [ ! -d "$file" ]; then
    echo "LOG=ERROR: Required file or directory not found: $file" >&2
    exit 1
  fi
done
# Ensure middleware file exists before backup, create if not
mkdir -p apps/urai-admin/src
touch apps/urai-admin/src/middleware.ts
echo "LOG=SUCCESS: All required files and directories are present."

# --- BACKUPS ---
echo "LOG=INFO: Creating timestamped backups..."
BACKUP_DIR="${REPO_ROOT}/urai_backups/${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
cp firebase.json "$BACKUP_DIR/firebase.json.bak"
cp firestore.rules "$BACKUP_DIR/firestore.rules.bak"
cp storage.rules "$BACKUP_DIR/storage.rules.bak"
cp apps/urai-admin/src/middleware.ts "$BACKUP_DIR/middleware.ts.bak"
cp functions/src/index.ts "$BACKUP_DIR/index.ts.bak"
echo "LOG=SUCCESS: Backups created in ${BACKUP_DIR}"

# --- DEPENDENCIES ---
echo "LOG=INFO: Installing dependencies with pnpm..."
pnpm install
echo "LOG=SUCCESS: Dependencies installed."

# --- ADMIN AUTHENTICATION LOCK ---
echo "LOG=INFO: Hardening admin authentication lock via middleware..."
cat << \'EOF\' > apps/urai-admin/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // Protect all routes under /admin
  if (pathname.startsWith('/admin')) {
    // If no session cookie, redirect to login
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Server-side verification of the cookie
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Cookie: `__session=${session}`,
        },
      });
      const userData = await response.json();

      // If user is not an admin, deny access
      if (userData.admin !== true) {
        return NextResponse.redirect(new URL('/not-authorized', request.url));
      }
    } catch (e) {
      // Verification failed, likely an invalid cookie
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
EOF
echo "LOG=SUCCESS: Admin middleware hardened in apps/urai-admin/src/middleware.ts"

# --- SECURITY RULES ---
echo "LOG=INFO: Hardening Firestore and Storage security rules..."
cat << \'EOF\' > firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins can read/write their own user info and all admin data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId && request.auth.token.admin == true;
    }
    match /admin-data/{docId=**} {
      allow read, write: if request.auth.token.admin == true;
    }
    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
EOF

cat << \'EOF\' > storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin-only access to all files
    match /{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
EOF

echo "LOG=INFO: Validating security rules..."
firebase-tools rules:check --project "${PROJECT_ID}"
echo "LOG=SUCCESS: Security rules hardened and validated."

# --- FUNCTIONS HARDENING ---
echo "LOG=INFO: Hardening Cloud Functions with an authenticated health check..."
mkdir -p functions/src
cat << \'EOF\' > functions/src/health.ts
import * as functions from "firebase-functions";

export const healthCheck = functions.https.onCall((data, context) => {
  // Enforce admin-only access
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'This function can only be called by an administrative user.'
    );
  }
  return { status: "ok", timestamp: new Date().toISOString() };
});
EOF

# Ensure health check is exported
if ! grep -q "from './health'" functions/src/index.ts; then
  echo "export * from './health';" >> functions/src/index.ts
fi
echo "LOG=SUCCESS: Functions hardened."

# --- TESTS ---
echo "LOG=INFO: Running tests..."
echo "LOG=INFO: Running typecheck..."
pnpm typecheck
echo "LOG=SUCCESS: Typecheck passed."
echo "LOG=INFO: Building Next.js admin panel..."
pnpm --filter=urai-admin build
echo "LOG=SUCCESS: Next.js build passed."
echo "LOG=INFO: Building functions..."
pnpm --filter=functions build
echo "LOG=SUCCESS: Functions build passed."

# --- EMULATORS ---
echo "LOG=INFO: Starting Firebase Emulators..."
# Ensure firebase.json has host set to 127.0.0.1 for security
jq '.emulators.auth.host = "127.0.0.1" | .emulators.firestore.host = "127.0.0.1" | .emulators.hosting.host = "127.0.0.1" | .emulators.functions.host = "127.0.0.1"' firebase.json > firebase.json.tmp && mv firebase.json.tmp firebase.json

firebase emulators:start --project "${PROJECT_ID}" --import=./tmp/emulator-data --export-on-exit ./tmp/emulator-data-export --host 127.0.0.1 &
EMULATOR_PIDS=$!
echo "LOG=INFO: Waiting for emulators to start (PID: $EMULATOR_PIDS)..."
sleep 20 # Wait for emulators to initialize

echo "LOG=INFO: Running emulator smoke tests..."
AUTH_PORT=$(jq -r '.emulators.auth.port // 9099' firebase.json)
FIRESTORE_PORT=$(jq -r '.emulators.firestore.port // 8080' firebase.json)
HOSTING_PORT=$(jq -r '.emulators.hosting.port // 5000' firebase.json)
FUNCTIONS_PORT=$(jq -r '.emulators.functions.port // 5001' firebase.json)

echo "LOG=TEST: Verifying hosting serves login page on http://127.0.0.1:${HOSTING_PORT}/login"
if ! curl -s --fail "http://127.0.0.1:${HOSTING_PORT}/login" | grep -q "Login"; then
  echo "LOG=ERROR: Emulator smoke test failed. Login page did not load correctly." >&2
  exit 1
fi
echo "LOG=SUCCESS: Login page test passed."

echo "LOG=TEST: Verifying /admin redirects to /login when unauthenticated..."
REDIRECT_URL=$(curl -s -o /dev/null -L -w "%{url_effective}" "http://127.0.0.1:${HOSTING_PORT}/admin")
if ! [[ "$REDIRECT_URL" == *"login"* ]]; then
  echo "LOG=ERROR: Emulator smoke test failed. /admin did not redirect to login. Effective URL: $REDIRECT_URL" >&2
  exit 1
fi
echo "LOG=SUCCESS: Admin redirect test passed."
echo "LOG=INFO: Stopping emulators..."
kill $EMULATOR_PIDS
wait $EMULATOR_PIDS || true
EMULATOR_PIDS=""
echo "LOG=SUCCESS: Emulators stopped cleanly."

# --- DEPLOYMENT ---
echo "LOG=INFO: Starting deployment to Firebase project: ${PROJECT_ID}..."
firebase use "${PROJECT_ID}"
firebase deploy --only hosting,functions,firestore,storage --force
echo "LOG=SUCCESS: Deployment completed."

# --- POST-DEPLOYMENT VERIFICATION ---
echo "LOG=INFO: Verifying live deployment..."
HOSTING_URL=$(firebase-tools hosting:sites:get --project "${PROJECT_ID}" --json | jq -r '.sites[0].defaultUrl')
if [ -z "$HOSTING_URL" ]; then
    echo "LOG=ERROR: Could not retrieve hosting URL." >&2
    exit 1
fi
echo "LOG=INFO: Hosting URL is ${HOSTING_URL}"
sleep 5 # Wait a moment for CDN propagation

echo "LOG=TEST: Verifying live login page..."
if ! curl -s --fail "${HOSTING_URL}/login" | grep -q "Login"; then
  echo "LOG=ERROR: Live site verification failed. Login page not found or incorrect." >&2
  exit 1
fi
echo "LOG=SUCCESS: Live login page is accessible."

echo "LOG=TEST: Verifying live /admin redirects..."
LIVE_REDIRECT_URL=$(curl -s -o /dev/null -L -w "%{url_effective}" "${HOSTING_URL}/admin")
if ! [[ "$LIVE_REDIRECT_URL" == *"login"* ]]; then
  echo "LOG=ERROR: Live site verification failed. /admin did not redirect. Effective URL: $LIVE_REDIRECT_URL" >&2
  exit 1
fi
echo "LOG=SUCCESS: Live admin redirect works as expected."

# --- LOCK FILE ---
echo "LOG=INFO: Creating lock file: URAI_ADMIN_LOCK.md..."
cat << EOF > URAI_ADMIN_LOCK.md
# FIREBASE STUDIO SHIPMASTER — URAI Admin LOCK

This file marks a successful and hardened deployment of the URAI Admin project.
Do not modify this file manually. Re-run \`bash urai_admin_ship_lock.sh\` to update.

- **Project ID:** ${PROJECT_ID}
- **Deployed URL(s):**
  - Hosting: ${HOSTING_URL}
- **Admin Enforcement:**
  - Next.js middleware verifies a Firebase Auth session cookie for all routes under \`/admin\`.
  - Unauthenticated users are redirected to \`/login\`.
  - Firestore & Storage rules require a valid Firebase Auth token with a custom claim \`"admin": true\` for all access.
- **Emulator Ports (from last run):**
  - Auth: ${AUTH_PORT}
  - Firestore: ${FIRESTORE_PORT}
  - Hosting: ${HOSTING_PORT}
  - Functions: ${FUNCTIONS_PORT}
- **Tests Run & Passed:**
  - [X] pnpm typecheck
  - [X] pnpm --filter=urai-admin build
  - [X] pnpm --filter=functions build
  - [X] Emulator Smoke Test: Hosting /login (Loads OK)
  - [X] Emulator Smoke Test: /admin redirect to /login
  - [X] Live Site Test: Hosting /login (Loads OK)
  - [X] Live Site Test: /admin redirect to /login
- **Canary Commands:**
  - \`curl -I ${HOSTING_URL}/login\`
  - \`curl -I -L ${HOSTING_URL}/admin\`

**LOCKED AT: ${TIMESTAMP}**
EOF

echo "LOG=SUCCESS: Lock file created."
echo "LOG=DONE"
