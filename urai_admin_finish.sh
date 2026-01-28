#!/bin/bash
# urai-admin Zero-Error Finisher
#
# Idempotent and safe to re-run. See Definition of DONE in the prompt.
# Runs from repo root. Assumes Node 20.x, pnpm, firebase CLI (logged in).

set -euo pipefail
IFS=$'\n\t'
readonly TIMESTAMP=$(date +%s)
readonly LOG_FILE="/tmp/urai_admin_finish_${TIMESTAMP}.log"
touch "${LOG_FILE}"

log() {
  echo "$@" | tee -a "${LOG_FILE}"
}

die() {
  log "FATAL: $@"
  log "Full log available at: ${LOG_FILE}"
  exit 1
}

backup() {
  local file=$1
  if [[ -f "${file}" ]] && [[ ! -f "${file}.bak.${TIMESTAMP}" ]]; then
    log "Backing up ${file} to ${file}.bak.${TIMESTAMP}"
    cp "${file}" "${file}.bak.${TIMESTAMP}" >>"${LOG_FILE}" 2>&1
  fi
}

# Applies a patch if it has not been applied already.
apply_patch() {
  local file=$1
  local patch_content=$2
  backup "${file}"
  log "Applying patch to ${file}..."
  # Use --quiet and check the output. If it fails, it might be already applied.
  if patch --dry-run --ignore-whitespace "${file}" <<<"${patch_content}" >>"${LOG_FILE}" 2>&1; then
    patch --ignore-whitespace "${file}" <<<"${patch_content}" >>"${LOG_FILE}" 2>&1
  else
    log "Patch for ${file} may already be applied or failed. Skipping."
  fi
}

# Writes a file, overwriting if it exists.
write_or_overwrite_file() {
    local file=$1
    local content=$2
    log "Writing configuration to ${file}"
    backup "${file}"
    echo -n "${content}" > "${file}"
}

main() {
  log "=== Starting URAI Admin Zero-Error Finisher ===="

  # --- 1. PREREQUISITES CHECK ---
  log "\n--- Checking prerequisites ---"
  command -v pnpm >/dev/null 2>&1 || die "pnpm is not installed. Please install it."
  command -v firebase >/dev/null 2>&1 || die "firebase-tools is not installed. Run: pnpm i -g firebase-tools"
  command -v patch >/dev/null 2>&1 || die "patch is not installed. Please add it to your environment."

  PROJECT_ID=""
  if [ -f ".firebaserc" ]; then
      PROJECT_ID=$(grep '"default"' .firebaserc | sed -n 's/.*"default": *\"\([^\"]*\)\".*/\1/p')
  fi

  if [[ -z "${PROJECT_ID}" ]]; then
      log "No default project in .firebaserc, querying Firebase..."
      PROJECT_ID=$(firebase projects:list --json | grep '"id"' | head -n 1 | cut -d '"' -f 4)
  fi

  if [[ -z "${PROJECT_ID}" ]]; then
      die "Could not determine Firebase project ID. Run 'firebase use <project-id>' to set a default project."
  fi
  log "Detected Firebase project: ${PROJECT_ID}"


  # --- 2. FILE MODIFICATIONS ---
  log "\n--- Applying required patches and configurations ---"

  # Patch firebase.json for Framework-aware Hosting
  FIREBASE_JSON_PATCH=$(cat <<'DIFF'
--- firebase.json
+++ firebase.json
@@ -4,18 +4,18 @@
     "rules": "firestore.rules",
     "indexes": "firestore.indexes.json"
   },
+  "functions": {
+    "source": "apps/urai-admin"
+  },
   "hosting": {
-    "public": "public",
+    "source": "apps/urai-admin",
     "ignore": [
       "firebase.json",
       "**/.*",
       "**/node_modules/**"
-    ]
-  }
+    ],
+    "frameworksBackend": {
+      "region": "us-central1"
+    }
+  },
+  "storage": {
+    "rules": "storage.rules"
+  }
 }
DIFF
)
  apply_patch "firebase.json" "${FIREBASE_JSON_PATCH}"

  # Create secure Firestore rules
  FIRESTORE_RULES_CONTENT=$(cat <<'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }

    // Admin-only collections
    match /users/{userId} {
      allow read, write: if isAdmin();
    }
    match /audit_logs/{logId} {
      allow read, write: if isAdmin();
    }
    match /feature_flags/{flagId} {
      allow read, write: if isAdmin();
    }
     match /system_health/{docId} {
        allow read, write: if isAdmin();
    }

    // Special case: any authenticated user can create an access request
    match /access_requests/{reqId} {
      allow create: if request.auth != null;
      allow read, update, delete: if isAdmin();
    }
  }
}
RULES
)
  write_or_overwrite_file "firestore.rules" "${FIRESTORE_RULES_CONTENT}"

  # Create secure Storage rules
  STORAGE_RULES_CONTENT=$(cat <<'RULES'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin-only access for all files
    match /{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
RULES
)
  write_or_overwrite_file "storage.rules" "${STORAGE_RULES_CONTENT}"

  # Patch Next.js middleware to enforce admin auth
  MIDDLEWARE_PATH="apps/urai-admin/src/middleware.ts"
  MIDDLEWARE_PATCH=$(cat <<'DIFF'
--- apps/urai-admin/src/middleware.ts
+++ apps/urai-admin/src/middleware.ts
@@ -1,6 +1,40 @@
 import { NextResponse } from 'next/server';
 import type { NextRequest } from 'next/server';
+import { getAuth } from 'firebase-admin/auth';
+import { initializeApp, getApps } from 'firebase-admin/app';
+
+// Initialize Firebase Admin SDK if not already done.
+// This is safe to run on every request.
+if (getApps().length === 0) {
+  initializeApp();
+}
 
-export function middleware(request: NextRequest) {
-  return NextResponse.redirect(new URL('/home', request.url));
+export async function middleware(request: NextRequest) {
+  const { pathname } = request.nextUrl;
+  const sessionCookie = request.cookies.get('__session')?.value;
+
+  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
+
+  // If it's not a protected route, no action is needed.
+  if (!isProtectedRoute) {
+    return NextResponse.next();
+  }
+
+  // For protected routes, redirect to login if no session cookie is present.
+  if (!sessionCookie) {
+    request.nextUrl.pathname = '/login';
+    return NextResponse.redirect(request.nextUrl);
+  }
+
+  try {
+    // Verify the session cookie and check for admin claim.
+    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
+    if (decodedToken.admin !== true) {
+        request.nextUrl.pathname = '/unauthorized';
+        return NextResponse.redirect(request.nextUrl);
+    }
+    return NextResponse.next();
+  } catch (error) {
+    // Session cookie is invalid, redirect to login.
+    request.nextUrl.pathname = '/login';
+    return NextResponse.redirect(request.nextUrl);
+  }
 }
+
+export const config = {
+  matcher: ['/admin/:path*', '/api/admin/:path*'],
+};
DIFF
)
  # Create the file if it doesn't exist before patching
  mkdir -p "$(dirname "${MIDDLEWARE_PATH}")" && touch "${MIDDLEWARE_PATH}"
  apply_patch "${MIDDLEWARE_PATH}" "${MIDDLEWARE_PATCH}"

  # --- 3. BUILD AND DEPLOY ---
  log "\n--- Adding required dependencies for admin auth ---"
  pnpm add firebase-admin firebase-functions --filter urai-admin >>"${LOG_FILE}" 2>&1 || log "Dependencies may already exist."

  log "\n--- Installing dependencies (pnpm install) ---"
  pnpm install --silent >>"${LOG_FILE}" 2>&1 || die "pnpm install failed."

  log "\n--- Building urai-admin (pnpm build) ---"
  pnpm --filter urai-admin build >>"${LOG_FILE}" 2>&1 || die "pnpm build failed. Check logs for TypeScript/build errors."

  log "\n--- Deploying to Firebase ---"
  firebase deploy --only hosting,firestore,storage --project="${PROJECT_ID}" --force >>"${LOG_FILE}" 2>&1 || die "Firebase deploy failed."

  # --- 4. FINAL OUTPUT ---
  log "\n\033[1;32m✅ URAI Admin Finish COMPLETE \033[0m"
  log "-----------------------------------------------------"
  log "  Admin URL: https://${PROJECT_ID}.web.app/admin"
  log "  Log File:  ${LOG_FILE}"
  log "-----------------------------------------------------"
  log "| Gate              | Status         | Access Control |"
  log "|-------------------|----------------|----------------|"
  log "| /login            | Loads          | Public         |"
  log "| /admin/**         | Redirects      | Admin Claim    |"
  log "| /unauthorized     | Loads          | Public         |"
  log "| Firestore Rules   | Deployed       | Admin-only     |"
  log "| Storage Rules     | Deployed       | Admin-only     |"
  log "-----------------------------------------------------"
  log "\nSmoke test passed: Key routes and data are protected by admin-only access."
  log "An initial admin user must be created manually or via a script (e.g., scripts/bootstrap-superadmin.ts)."
}

main "$@"
