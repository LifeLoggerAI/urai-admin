# URAI Admin Production Launch Runbook

This runbook defines the minimum gates required before URAI Admin can be called live, cohesive, and production-ready at `https://www.uraiadmin.com`.

Related recovery runbook: `docs/ROLLBACK_AND_INCIDENTS.md`.

## Production target

- Public site: `https://www.uraiadmin.com`
- Firebase project: `urai-4dc1d`
- Hosting source: `apps/urai-admin`
- Functions source: `functions`
- Runtime: Node.js 20

## Required GitHub configuration

Set these repository or environment secrets before running the deploy workflow:

- `FIREBASE_TOKEN`: Firebase CLI token or deploy credential with access to project `urai-4dc1d`.
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY` if Application Default Credentials are not sufficient.

Recommended production environment protection:

- Require manual approval for the `production` GitHub environment.
- Restrict deploy workflow access to repository admins/maintainers.
- Require CI to pass before deployment.

## Required Firebase / application environment

Configure the production app with these public Firebase values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Configure server-side Firebase Admin credentials if Application Default Credentials are not available in the hosting/functions runtime:

- `FIREBASE_SERVICE_ACCOUNT_KEY`

## Required Firestore bootstrap

Create at least one active owner before launch.

Preferred scripted path:

```bash
export NEXT_PUBLIC_FIREBASE_PROJECT_ID=urai-4dc1d
export FIREBASE_SERVICE_ACCOUNT_KEY='<service account json>'
export URAI_ADMIN_OWNER_EMAIL='owner@example.com'
pnpm bootstrap:owner
```

If the Firebase Auth user already exists, `pnpm bootstrap:owner` resolves the owner UID from `URAI_ADMIN_OWNER_EMAIL`. You may also set `URAI_ADMIN_OWNER_UID` explicitly when needed.

The script sets Firebase custom claims, writes `adminUsers/{uid}`, and adds an audit log entry.

Manual fallback:

Collection: `adminUsers`

Document id: Firebase Auth UID of the initial admin owner.

Required fields:

```json
{
  "email": "owner@example.com",
  "role": "owner",
  "isActive": true,
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

Allowed roles:

- `owner`
- `admin`
- `viewer`

## Required domain / DNS configuration

In Firebase Hosting, connect the custom domain:

- `www.uraiadmin.com`
- optionally redirect apex `uraiadmin.com` to `www.uraiadmin.com`

DNS must point to Firebase Hosting exactly as shown by Firebase. Do not mark launch complete until Firebase shows the domain as connected and SSL is active.

## Required validation commands

From the repository root:

```bash
pnpm install --frozen-lockfile=false
pnpm preflight:production
pnpm security:gate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify:production
pnpm test:smoke
```

## Deployment

Preferred path:

1. Go to GitHub Actions.
2. Run `Deploy URAI Admin`.
3. Confirm production preflight passes.
4. Confirm security gate passes.
5. Confirm validation passes.
6. Confirm Firebase deploy succeeds.
7. Confirm production live verification succeeds.

Manual fallback:

```bash
pnpm preflight:production
pnpm security:gate
pnpm run deploy:production
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com pnpm verify:production
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com pnpm test:smoke
```

## Production verification expectations

The verifier must confirm:

- Public homepage returns successfully and includes `URAI`.
- `/api/health` returns `{"status":"ok"}`.
- Firebase Hosting runtime config is available at `/__/firebase/init.json`.
- `/login` loads.
- `/admin` is protected and redirects, blocks, or renders the protected shell for unauthenticated access.
- `/api/admin/collection?collection=adminUsers` returns `401` without a valid session.
- Functions health endpoint returns `{"status":"ok"}`.
- Legacy Functions auth diagnostics do not block source-owned production verification.

## Rollback readiness

Before launch, confirm `docs/ROLLBACK_AND_INCIDENTS.md` is understood by the launch owner and that the team can recover through at least one of these paths:

- Git revert and redeploy.
- Firebase Hosting release rollback.
- Functions-only redeploy from a known good SHA.
- Rules-only rollback for Firestore or Storage.

## Launch acceptance criteria

URAI Admin is launch-ready only when all of these are true:

- GitHub CI is green on `main`.
- Production preflight is green.
- Security gate is green.
- Deploy workflow is green.
- `https://www.uraiadmin.com` loads over HTTPS.
- Admin login works with a real Firebase account.
- Non-admin users cannot access `/admin` or `/api/admin/*`.
- Active owner/admin users can access the dashboard.
- Logout clears the session and returns the user to `/login`.
- Firestore audit logs are written for bootstrap, login, and admin API access.
- No production secrets are committed to the repository.
- Firebase Hosting, Functions, Firestore rules, and Storage rules are deployed from the repo.
- Rollback path is documented and understood.

## Do not claim launch complete if

- DNS is pending.
- SSL is pending.
- `FIREBASE_TOKEN` is missing.
- Firebase project permissions are unknown.
- No active `owner` admin user exists.
- CI or deploy workflow has not run.
- Production verification has not passed against the live domain.
- Rollback path is unknown.