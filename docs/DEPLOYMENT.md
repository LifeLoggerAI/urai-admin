# URAI Admin Deployment

## Required environment

- Node 20+
- pnpm 9.15.0
- Firebase CLI 13+
- Access to Firebase project `urai-4dc1d`
- GitHub `production` environment with required public Firebase config
- Google Workload Identity Federation configured for GitHub Actions deployment

## Required configuration and identity

Public Firebase configuration:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

GitHub deployment variables:

- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SERVICE_ACCOUNT`

Operator/runtime configuration:

- `URAI_ADMIN_OWNER_UID`
- `URAI_ADMIN_OWNER_EMAIL`
- `URAI_ADMIN_FIREBASE_PROJECT`
- `URAI_ADMIN_HOSTING_SITE`
- `URAI_ADMIN_PRODUCTION_URL`

Production deployment and rollback do **not** use `FIREBASE_TOKEN`, `FIREBASE_SERVICE_ACCOUNT_KEY`, or `credentials_json`. GitHub Actions authenticates with OIDC + Workload Identity Federation and receives temporary Application Default Credentials. Firebase/Google managed runtimes use their attached identity. Local privileged scripts require approved ADC.

## Local verification

```bash
corepack prepare pnpm@9.15.0 --activate
pnpm install
pnpm release:lock
```

## Seed first owner

Authenticate locally with an approved short-lived/ADC Google identity that has the narrowly required Firebase Admin permissions, then run:

```bash
export URAI_ADMIN_OWNER_UID=<firebase-auth-uid>
export URAI_ADMIN_OWNER_EMAIL=<owner-email>
pnpm bootstrap:owner
```

Record the seeded UID and timestamp in `docs/EVIDENCE_LOG.md`. Do not record credentials or tokens.

## Staging deploy

Use an approved staging identity / ADC:

```bash
firebase use <STAGING_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase hosting:channel:deploy urai-admin-staging --expires 14d
export URAI_ADMIN_STAGING_URL=<preview-url>
pnpm test:smoke
pnpm verify:release
```

## Production deploy

Production deploy is allowed only after `FINAL_LOCK.md` has all pre-production gates green and owner approval recorded. The canonical production path is the manual `Deploy URAI Admin` GitHub Actions workflow on `main`, with an exact target SHA and approved rollback SHA. The workflow fails closed if WIF variables are missing.

Do not substitute Firebase CLI tokens or service-account JSON for the WIF gate.

## Post-deploy verification

Verify:

- `/`
- `/login`
- `/privacy`
- `/terms`
- protected admin denial for non-admin
- seeded owner admin access
- Firestore rules deploy timestamp
- Functions deploy timestamp
- DNS/SSL active
- monitoring/alerts active
- exact deployment receipt and rollback evidence

## Rollback

GitHub rollback inherits the same temporary WIF/ADC identity as the deployment job. Local rollback requires approved ADC.

```bash
export URAI_ADMIN_FIREBASE_PROJECT=urai-4dc1d
export URAI_ADMIN_HOSTING_SITE=<hosting-site-id>
export URAI_ADMIN_ROLLBACK_RELEASE=<known-good-release>
pnpm rollback:production
```

For code/rules rollback, also set `URAI_ADMIN_ROLLBACK_COMMIT` and follow the printed operator steps.
