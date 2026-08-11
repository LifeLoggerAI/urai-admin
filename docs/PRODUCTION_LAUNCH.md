# URAI Admin Production Launch Runbook

This runbook defines the minimum gates required before URAI Admin can be called live, cohesive, and production-ready at `https://www.uraiadmin.com`.

Related recovery runbook: `docs/ROLLBACK_AND_INCIDENTS.md`.

## Production target

- Public site: `https://www.uraiadmin.com`
- Verified Firebase Hosting URL: `https://urai-admin.web.app`
- Firebase project: `urai-4dc1d`
- Hosting source: `apps/urai-admin`
- Functions source: `functions`
- Runtime: Node.js 20

## Required GitHub configuration

Set these protected production environment values before running the deploy workflow.

Public Firebase configuration:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Non-secret WIF variables:

- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SERVICE_ACCOUNT`

The deploy workflow uses GitHub OIDC + Google Workload Identity Federation to obtain temporary Application Default Credentials. Do not configure `FIREBASE_TOKEN`, `FIREBASE_SERVICE_ACCOUNT_KEY`, or `credentials_json` as a production deploy fallback.

Recommended production environment protection:

- Require manual approval for the `production` GitHub environment.
- Restrict deploy workflow access to repository admins/maintainers.
- Require CI to pass before deployment.
- Restrict the WIF provider trust condition to the intended repository/environment/ref.
- Grant the deploy service account only the permissions required by the reviewed Firebase deploy and rollback path.

## Required Firebase / application environment

Configure the production app with these public Firebase values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Server-side Firebase Admin uses the managed runtime identity / Application Default Credentials. Do not install a service-account JSON application secret as a fallback.

## Required Firestore bootstrap

Create at least one active owner before launch.

Preferred scripted path uses approved ADC with narrowly scoped Firebase Admin permission:

```bash
export NEXT_PUBLIC_FIREBASE_PROJECT_ID=urai-4dc1d
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
pnpm security:gate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm preflight:production` requires the temporary WIF/ADC credential file when running inside GitHub Actions. A local privileged operator must authenticate with approved ADC before production preflight/deploy commands.

## Deployment

Preferred path:

1. Go to GitHub Actions.
2. Run `Deploy URAI Admin` from `main`.
3. Provide the exact approved target SHA, exact known-good rollback SHA, and confirmation phrase.
4. Confirm the WIF identity gate and Google authentication pass.
5. Confirm production preflight and security gate pass.
6. Confirm Firebase deploy succeeds.
7. Confirm production live verification succeeds.
8. Download the retained deployment evidence artifact.

The workflow fails closed if WIF provider/service-account variables are missing or provider-side trust/IAM is not valid.

Local evidence-producing fallback requires approved ADC:

```bash
bash scripts/launch-lock.sh
```

By default this verifies `https://urai-admin.web.app`. To verify the custom domain after DNS/SSL is live:

```bash
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com bash scripts/launch-lock.sh
```

The launch runner writes evidence to:

```text
tmp/urai-admin-launch-evidence.md
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

- Git revert and redeploy using the approved WIF/ADC identity.
- Firebase Hosting release rollback using the approved WIF/ADC identity.
- Functions-only redeploy from a known good SHA.
- Rules-only rollback for Firestore or Storage.

## Launch acceptance criteria

URAI Admin is launch-ready only when all of these are true:

- GitHub CI is green on the exact release SHA.
- WIF provider trust and deploy-service-account IAM are verified for the protected production path.
- Production preflight is green.
- Security gate is green.
- Deploy workflow is green.
- `https://www.uraiadmin.com` loads over HTTPS, or `https://urai-admin.web.app` is explicitly accepted as the first verified launch URL while custom-domain DNS/SSL is pending.
- Admin login works with a real Firebase account.
- Non-admin users cannot access `/admin` or `/api/admin/*`.
- Active owner/admin users can access the dashboard.
- Logout clears the session and returns the user to `/login`.
- Firestore audit logs are written for bootstrap, login, and admin API access.
- No production secrets are committed to the repository.
- No Firebase CLI token or service-account JSON deploy/runtime fallback is enabled.
- Firebase Hosting, Functions, Firestore rules, and Storage rules are deployed from the reviewed exact SHA.
- Rollback path is documented and understood.
- Launch evidence exists as the GitHub Actions artifact or `tmp/urai-admin-launch-evidence.md` from `scripts/launch-lock.sh`.

## Do not claim custom-domain launch complete if

- DNS is pending.
- SSL is pending.
- WIF provider trust / deploy service-account IAM is unverified.
- Firebase project permissions are unknown.
- No active `owner` admin user exists.
- CI or deploy workflow has not run.
- Production verification has not passed against the live domain.
- Rollback path is unknown.
