# URAI Admin Console

URAI Admin is the privileged administrative control plane for the URAI ecosystem. It includes protected dashboards, role-based administration, feature flag control, operational job visibility, audit logging, and system management.

This README is intentionally conservative: do not treat the admin system as production-ready unless every release gate below is verified with evidence.

## Canonical repo structure

- Repository: `LifeLoggerAI/urai-admin`
- Default branch: `main`
- App source: `apps/urai-admin`
- Functions source: `functions`
- Shared packages: `packages/*`
- Firebase config: `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`

## Source-of-truth warning

The repo currently references `urai-4dc1d` as the intended admin project in release scripts and readiness docs. `.firebaserc` also contains a separate `default` project value. Before any production deployment, an authorized operator must verify the active Firebase project, hosting site, DNS, Auth domains, and secrets.

Do not deploy from a shell where the active Firebase project is uncertain.

## Prerequisites

- Node.js 20 or later
- pnpm 9.15.0 or compatible with the root `packageManager`
- Firebase CLI with access to the intended Firebase project
- Access to required admin environment variables and service account credentials
- Approval to run deploy commands against the selected environment

## Local setup

Install dependencies from the repo root:

```bash
pnpm install
```

Copy and fill the admin app environment file:

```bash
cp apps/urai-admin/.env.example apps/urai-admin/.env.local
```

The standalone readiness doc lists the expected production values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `URAI_ADMIN_BASE_URL`
- `URAI_ADMIN_FUNCTIONS_BASE_URL`
- `FIREBASE_SERVICE_ACCOUNT_KEY` for local/server admin flows where required

## Bootstrap first admin

Use the repo bootstrap command after the target Firebase project and credentials are verified:

```bash
pnpm bootstrap:owner
```

Do not bootstrap against production unless the UID/email and project ID have been independently checked.

## Required release gates

Run from the repo root and record evidence in `docs/EVIDENCE_LOG.md`:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke-test
```

Also verify Firestore and Storage rules with emulator-backed tests where available. Rules are not GREEN until denial and allow cases are proven for unauthenticated users, authenticated non-admin users, and active admins.

## Deployment

Use the documented deployment runbook, not ad hoc shell commands:

- `docs/DEPLOYMENT_RUNBOOK.md`
- `docs/URAI_ADMIN_STANDALONE_READINESS.md`

After all gates are GREEN and deployment is authorized:

```bash
pnpm deploy
```

Do not run production deployment if any of these are unresolved:

- Firebase project is uncertain
- Hosting target/site is uncertain
- Required env/secrets are missing or unverified
- CI/build/test gates fail without explicit documented override
- Firestore or Storage rules are untested
- Admin auth/session enforcement is unverified
- Rollback path is missing

## Post-deploy smoke checks

Verify the public and protected surfaces documented in `docs/URAI_ADMIN_STANDALONE_READINESS.md`, including that unauthenticated access to `/api/admin/users` returns `401`.

## Unsafe legacy paths

Do not use legacy references to `apps/admin-web/public`. The canonical app source is `apps/urai-admin`.

Do not use `urai_admin_finish.sh` as a production deployment path. It is not a safe admin release gate and must not replace the documented release process.

## Verification checklist

- [ ] Correct GitHub repo and branch verified
- [ ] Correct Firebase project verified
- [ ] Correct hosting site/target verified
- [ ] Env/secrets verified
- [ ] First admin bootstrap target verified
- [ ] Lint passing
- [ ] Typecheck passing
- [ ] Tests passing
- [ ] Build passing
- [ ] Firestore rules tested
- [ ] Storage rules tested
- [ ] Smoke tests passing
- [ ] Rollback path documented
- [ ] Evidence recorded
