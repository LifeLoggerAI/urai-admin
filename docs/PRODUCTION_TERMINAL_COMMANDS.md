# URAI Admin Production Terminal Commands

These commands finish the evidence and deployment work that cannot be completed from a repo-only edit pass.

Run from a clean local checkout of `LifeLoggerAI/urai-admin` after merging this branch.

## 1. Clean checkout and install

```bash
git checkout main
git pull origin main
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

Record the command output in `docs/EVIDENCE_LOG.md`.

## 2. Local production gates

```bash
pnpm check:types
pnpm lint
pnpm test:unit
pnpm test:rules
pnpm test:registry
pnpm test:e2e
pnpm build
pnpm verify:release
pnpm release:lock
```

For strict verifier mode:

```bash
URAI_ADMIN_VERIFIER_RUN_COMMANDS=1 pnpm verify:release
```

## 3. Production preflight environment

Export or configure these values in your shell/GitHub Actions environment. Do not commit real values.

```bash
export FIREBASE_TOKEN='<firebase-ci-token>'
export NEXT_PUBLIC_FIREBASE_API_KEY='<firebase-web-api-key>'
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN='urai-4dc1d.firebaseapp.com'
export NEXT_PUBLIC_FIREBASE_PROJECT_ID='urai-4dc1d'
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET='<bucket>'
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='<sender-id>'
export NEXT_PUBLIC_FIREBASE_APP_ID='<app-id>'
export URAI_ADMIN_FIREBASE_PROJECT='urai-4dc1d'
export URAI_ADMIN_PRODUCTION_URL='https://www.uraiadmin.com'
```

Then run:

```bash
pnpm preflight:production
pnpm security:gate
```

## 4. Seed first owner

Use the Firebase Auth UID for the owner account.

```bash
export URAI_ADMIN_OWNER_UID='<firebase-auth-owner-uid>'
export URAI_ADMIN_OWNER_EMAIL='lifeloggerai@gmail.com'
pnpm bootstrap:owner
```

Evidence to record:

- owner UID, partially redacted if desired;
- owner email;
- timestamp;
- command result;
- Firebase project ID.

## 5. Seed system-of-systems registry

Running `pnpm seed:system-registry` without `URAI_ADMIN_SEED_APPLY=1` is a validation-only dry run and performs no Firestore write.

For staging, first establish the exact approved URAI Admin staging Firebase project from authoritative provider/account evidence. Do not substitute a guessed project or reuse production. Store the approved value in the protected environment and make both target variables match:

```bash
export URAI_ADMIN_FIREBASE_PROJECT='<approved-staging-project-id>'
export URAI_ADMIN_STAGING_FIREBASE_PROJECT='<approved-staging-project-id>'
export URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1
export URAI_ADMIN_STAGING_APPROVAL='APPROVE_URAI_ADMIN_STAGING'
export URAI_ADMIN_SEED_APPLY=1
export URAI_ADMIN_SEED_CONFIRM='SEED_SYSTEM_REGISTRY'
export URAI_ADMIN_SEED_SHA="$(git rev-parse HEAD)"
export URAI_ADMIN_SEED_ACTOR='lifeloggerai@gmail.com'
pnpm seed:system-registry
```

For production, only after staging evidence and explicit production authorization:

```bash
unset URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED
unset URAI_ADMIN_STAGING_FIREBASE_PROJECT
unset URAI_ADMIN_STAGING_APPROVAL
export URAI_ADMIN_FIREBASE_PROJECT='urai-4dc1d'
export URAI_ADMIN_PRODUCTION_APPROVAL='APPROVE_URAI_ADMIN_PRODUCTION'
export URAI_ADMIN_SEED_APPLY=1
export URAI_ADMIN_SEED_CONFIRM='SEED_SYSTEM_REGISTRY'
export URAI_ADMIN_SEED_SHA="$(git rev-parse HEAD)"
export URAI_ADMIN_SEED_ACTOR='lifeloggerai@gmail.com'
pnpm seed:system-registry
```

Evidence to record:

- exact source SHA;
- project ID;
- count of seeded systems;
- registry digest;
- timestamp;
- `/admin/system` screenshot or route smoke result.

## 6. Staging deploy

```bash
firebase use <APPROVED_STAGING_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase hosting:channel:deploy urai-admin-staging --expires 14d
export URAI_ADMIN_STAGING_URL='<firebase-preview-url>'
pnpm test:smoke
```

Record the approved staging project, preview URL, exact deployed SHA, and smoke output in `docs/EVIDENCE_LOG.md`.

## 7. Production deploy

Only run this after the staging gates are recorded and owner approval is ready.

```bash
firebase use urai-4dc1d
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting -P urai-4dc1d
export URAI_ADMIN_PRODUCTION_URL='https://www.uraiadmin.com'
pnpm verify:production
```

Verify these routes:

```bash
curl -I https://www.uraiadmin.com/
curl -I https://www.uraiadmin.com/status
curl -I https://www.uraiadmin.com/privacy
curl -I https://www.uraiadmin.com/terms
```

## 8. DNS and SSL evidence

Confirm in Firebase Hosting or with shell checks:

```bash
curl -Iv https://www.uraiadmin.com 2>&1 | tee /tmp/urai-admin-ssl.txt
```

Record the SSL issuer/validity summary in `docs/EVIDENCE_LOG.md`.

## 9. Rollback evidence

List releases and pick the previous known-good release.

```bash
firebase hosting:releases:list --site "$URAI_ADMIN_HOSTING_SITE" -P urai-4dc1d
export URAI_ADMIN_ROLLBACK_RELEASE='<known-good-release-id>'
export URAI_ADMIN_HOSTING_SITE='<hosting-site-id>'
pnpm rollback:production
```

If you are only proving rollback readiness, record the exact known-good release ID and do not perform a destructive rollback unless needed.

## 10. Final lock update

After all gates pass and evidence is recorded, update `FINAL_LOCK.md`:

```text
Current verdict: PRODUCTION READY
Approver: Adam Clamp
Date: <YYYY-MM-DD>
Commit SHA: <production-sha>
Staging URL: <preview-url>
Production URL: https://www.uraiadmin.com
Rollback release/SHA: <known-good-release>
Monitoring dashboard: <link or evidence>
DNS/SSL proof: <summary>
```

Do not mark production-ready before the evidence exists.
