# URAI Admin Production Launch Runbook

This runbook defines the minimum gates required before URAI Admin can be called live, cohesive, and production-ready at `https://www.uraiadmin.com`.

## Production target

- Public site: `https://www.uraiadmin.com`
- Firebase project: `urai-4dc1d`
- Hosting source: `apps/urai-admin`
- Functions source: `functions`
- Runtime: Node.js 20

## Required GitHub configuration

Set these repository or environment secrets before running the deploy workflow:

- `FIREBASE_TOKEN`: Firebase CLI token or deploy credential with access to project `urai-4dc1d`.

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
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke-test
```

## Deployment

Preferred path:

1. Go to GitHub Actions.
2. Run `Deploy URAI Admin`.
3. Confirm validation passes.
4. Confirm Firebase deploy succeeds.
5. Confirm production smoke test succeeds.

Manual fallback:

```bash
pnpm deploy
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com pnpm smoke-test
```

## Production smoke test expectations

The smoke test must verify:

- Public homepage returns successfully and includes `URAI Admin`.
- `/admin` is protected and redirects or blocks unauthenticated access.
- `/api/admin/users` returns `401` without a valid session.
- Functions health endpoint returns `{"status":"ok"}`.
- Functions auth endpoint blocks unauthenticated access.

## Launch acceptance criteria

URAI Admin is launch-ready only when all of these are true:

- GitHub CI is green on `main`.
- Deploy workflow is green.
- `https://www.uraiadmin.com` loads over HTTPS.
- Admin login works with a real Firebase Google account.
- Non-admin users cannot access `/admin` or `/api/admin/*`.
- Active owner/admin users can access the dashboard.
- Logout clears the session and returns the user to `/login`.
- Firestore audit logs are written for login and admin API access.
- No production secrets are committed to the repository.
- Firebase Hosting, Functions, Firestore rules, and Storage rules are deployed from the repo.

## Do not claim launch complete if

- DNS is pending.
- SSL is pending.
- `FIREBASE_TOKEN` is missing.
- Firebase project permissions are unknown.
- No active `owner` admin user exists.
- CI or deploy workflow has not run.
- Smoke tests have not passed against the live domain.
