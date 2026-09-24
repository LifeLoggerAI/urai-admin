# URAI Admin Standalone Readiness

URAI Admin is structured as a standalone product at `uraiadmin.com` plus a protected `/admin/*` operations console. Source structure is not production authority; provider, deployment, runtime, and live-readback evidence remain separate gates.

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

Authorized domains, hosting targets, DNS, TLS, and Firebase project identity must be verified through the protected provider/domain lanes before any production claim. Source references to `uraiadmin.com`, `www.uraiadmin.com`, or `urai-4dc1d` are intended configuration, not proof that the live provider state matches them.

## Required application environment values

Use `apps/urai-admin/.env.example` as the application configuration source of truth.

Expected application values include:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `URAI_ADMIN_BASE_URL`
- `URAI_ADMIN_FUNCTIONS_BASE_URL`

## Provider identity authority

Do not provide `FIREBASE_SERVICE_ACCOUNT_KEY`, raw service-account JSON, `credentials_json`, or `FIREBASE_TOKEN` as a local/server/CI credential path.

- Authorized local/server operator work uses Google Application Default Credentials after the active account and project are verified.
- Governed GitHub provider/deployment workflows use OIDC + Workload Identity Federation and short-lived credentials from protected environment variables.
- Credential JSON must not be copied into application `.env` files, repository files, workflow artifacts, or command history.
- A missing WIF/ADC identity is a blocker; do not bypass it with a long-lived credential.

## Admin auth flow

1. User signs in with Google on `/login`.
2. Client sends Firebase ID token to `/api/auth/login`.
3. Server verifies the token.
4. Server checks `adminUsers/{uid}`.
5. Server requires `isActive === true` and a valid role.
6. Server requires canonical Auth claims to already match Firestore; mismatches fail closed with governed repair/refresh states. Only after claims and token state agree does it create the `__session` cookie.
7. Middleware allows `/admin/*` and `/api/admin/*` only under the governed session contract.
8. Protected admin APIs verify the session cookie with `requireAdminSession`.

## Admin mutation routes

Protected routes currently include:

- `/api/admin/set-flag`
- canonical role mutation: `PUT /api/admin/users/[uid]/role`
- deprecated compatibility alias only: `POST /api/admin/update-user-role`
- `/api/admin/set-user-active`
- `/api/admin/users`

All sensitive admin mutations should:

- call `requireAdminMutationSession` when they mutate state and `requireAdminSession` for protected reads
- validate request payloads with Zod
- use Firebase Admin SDK server-side writes under ADC-managed runtime identity
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

Do not migrate production collections until the app has org context selection, invite flow, org-scoped Firestore rules, protected provider authority, rollback evidence, and the required approvals.

## Local source gates

Run the repository's supported install/lint/typecheck/test/build/smoke commands and retain exact-head CI evidence. Local success does not substitute for protected provider/runtime verification.

## Deploy authority

Do not treat an ad hoc local `pnpm deploy`, Firebase CLI invocation, or historical backup script as production authority. Deployment must pass through the current governed WIF-based workflow with exact target identity, exact source SHA, required approval, and rollback/readback evidence.

## Post-deploy verification

After an authorized deployment, verify the canonical public and protected routes, including that unauthenticated access to `/api/admin/users` is denied. Record exact deployed SHA, provider target, timestamp, live readback, monitoring/recovery status, and a distinct rollback revision before claiming completion.
