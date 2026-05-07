# URAI Admin Standalone Readiness

URAI Admin is now structured as a standalone product at `uraiadmin.com` plus a protected `/admin/*` operations console.

## Public product surface

Expected public routes:

- `/`
- `/features`
- `/pricing`
- `/security`
- `/docs`
- `/contact`
- `/privacy`
- `/terms`
- `/login`

## Protected admin surface

Expected protected routes:

- `/admin`
- `/admin/users`
- `/admin/projects`
- `/admin/feature-flags`
- `/admin/jobs`
- `/admin/job-runs`
- `/admin/dead-letters`
- `/admin/system`
- `/admin/audit`
- `/admin/policies`
- `/admin/settings`

Middleware must protect:

- `/admin/:path*`
- `/api/admin/:path*`

## Required Firebase/Auth setup

In Firebase Auth, add authorized domains:

- `uraiadmin.com`
- `www.uraiadmin.com`

In hosting/DNS, point:

- `uraiadmin.com`
- `www.uraiadmin.com`

at the Firebase Hosting site for `apps/urai-admin`.

## Required environment variables

Use `apps/urai-admin/.env.example` as the source of truth.

Minimum production values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uraiadmin.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=urai-4dc1d`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `URAI_ADMIN_BASE_URL=https://uraiadmin.com`
- `URAI_ADMIN_FUNCTIONS_BASE_URL=https://us-central1-urai-4dc1d.cloudfunctions.net`

For local development, also provide:

- `FIREBASE_SERVICE_ACCOUNT_KEY`

## Admin auth flow

1. User signs in with Google on `/login`.
2. Client sends Firebase ID token to `/api/auth/login`.
3. Server verifies the token.
4. Server checks `adminUsers/{uid}`.
5. Server requires `isActive === true` and a valid role.
6. Server sets custom claims and creates the `__session` cookie.
7. Middleware allows `/admin/*` and `/api/admin/*` only when `__session` exists.
8. Protected admin APIs verify the session cookie with `requireAdminSession`.

## Admin mutation routes

Protected routes currently include:

- `/api/admin/set-flag`
- `/api/admin/update-user-role`
- `/api/admin/set-user-active`
- `/api/admin/users`

All sensitive admin mutations should:

- call `requireAdminSession`
- validate request payloads with Zod
- use Firebase Admin SDK server-side writes
- write to `auditLogs`
- avoid direct client writes to protected collections

## Single-org mode today

Current flat collections remain supported:

- `adminUsers`
- `roles`
- `auditLogs`
- `featureFlags`
- `jobs`
- `jobRuns`
- `deadLetters`
- `systemConfig`
- `projectRegistry`

The default org scaffold uses:

- `DEFAULT_INTERNAL_ORG_ID = urai-internal`
- `URAI_ADMIN_DEFAULT_ORG_ID`

## Multi-tenant path later

Future org-scoped collections should use this structure:

```text
organizations/{orgId}/adminUsers/{uid}
organizations/{orgId}/roles/{roleId}
organizations/{orgId}/auditLogs/{logId}
organizations/{orgId}/featureFlags/{flagId}
organizations/{orgId}/jobs/{jobId}
organizations/{orgId}/jobRuns/{runId}
organizations/{orgId}/deadLetters/{letterId}
organizations/{orgId}/systemConfig/{configId}
organizations/{orgId}/projectRegistry/{projectId}
```

Do not migrate production collections until the app has org context selection, invite flow, and org-scoped Firestore rules.

## Local release gates

Run from the repo root:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke-test
```

Smoke test defaults to:

```bash
URAI_ADMIN_BASE_URL=https://uraiadmin.com
URAI_ADMIN_FUNCTIONS_BASE_URL=https://us-central1-urai-4dc1d.cloudfunctions.net
```

Override them for preview channels or local staging.

## Deploy

```bash
pnpm deploy
```

Then manually verify:

- `https://uraiadmin.com/`
- `https://uraiadmin.com/features`
- `https://uraiadmin.com/pricing`
- `https://uraiadmin.com/security`
- `https://uraiadmin.com/login`
- `https://uraiadmin.com/admin`
- `https://uraiadmin.com/admin/users`
- `https://uraiadmin.com/admin/feature-flags`
- `https://uraiadmin.com/api/admin/users` returns `401` when unauthenticated
