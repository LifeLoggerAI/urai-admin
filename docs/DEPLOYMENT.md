# URAI Admin Deployment

## Required environment

- Node 20
- pnpm 9.15.0
- Firebase CLI 13+
- Access to Firebase project `urai-4dc1d`
- GitHub Actions environment secrets matching `.env.production.example`

## Required secrets and config

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_TOKEN`
- `FIREBASE_SERVICE_ACCOUNT_KEY` if ADC is unavailable
- `URAI_ADMIN_OWNER_UID`
- `URAI_ADMIN_OWNER_EMAIL`
- `URAI_ADMIN_FIREBASE_PROJECT`
- `URAI_ADMIN_HOSTING_SITE`
- `URAI_ADMIN_PRODUCTION_URL`

## Local verification

```bash
corepack prepare pnpm@9.15.0 --activate
pnpm install
pnpm release:lock
```

## Seed first owner

```bash
export URAI_ADMIN_OWNER_UID=<firebase-auth-uid>
export URAI_ADMIN_OWNER_EMAIL=<owner-email>
pnpm bootstrap:owner
```

Record the seeded UID and timestamp in `docs/EVIDENCE_LOG.md`. Do not record private tokens.

## Staging deploy

```bash
firebase use <STAGING_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase hosting:channel:deploy urai-admin-staging --expires 14d
export URAI_ADMIN_STAGING_URL=<preview-url>
pnpm test:smoke
pnpm verify:release
```

## Production deploy

Production deploy is allowed only after `FINAL_LOCK.md` has all pre-production gates green and owner approval recorded.

```bash
firebase use <PRODUCTION_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting
export URAI_ADMIN_PRODUCTION_URL=https://www.uraiadmin.com
pnpm verify:production
```

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

## Rollback

```bash
export FIREBASE_TOKEN=<token>
export URAI_ADMIN_FIREBASE_PROJECT=urai-4dc1d
export URAI_ADMIN_HOSTING_SITE=<hosting-site-id>
export URAI_ADMIN_ROLLBACK_RELEASE=<known-good-release>
pnpm rollback:production
```

For code/rules rollback, also set `URAI_ADMIN_ROLLBACK_COMMIT` and follow the printed operator steps.
