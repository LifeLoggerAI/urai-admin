# URAI Admin Production Terminal Commands

These commands finish evidence and operator-side validation that cannot be completed from a repo-only edit pass.

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

The canonical production deploy path is the manual `Deploy URAI Admin` GitHub Actions workflow. It authenticates through GitHub OIDC to Google Cloud Workload Identity Federation using protected non-secret variables `GCP_WIF_PROVIDER` and `GCP_DEPLOY_SERVICE_ACCOUNT`.

For local/operator validation that needs Google/Firebase access, authenticate with an approved short-lived ADC identity before running the preflight. Do not export `FIREBASE_TOKEN`, raw service-account JSON, or private-key material.

Configure only the non-secret/public application settings needed by the app, for example:

```bash
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

In GitHub Actions, preflight requires the temporary WIF credential file exported by `google-github-actions/auth`. A local shell must instead have approved ADC available.

## 4. Seed first owner

Use the Firebase Auth UID for the owner account. Run the bootstrap with approved ADC or a managed runtime/operator identity; do not use raw service-account JSON.

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
- Firebase project ID;
- identity method used (ADC/managed identity), without secret material.

## 5. Seed system-of-systems registry

For staging:

```bash
export URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED=1
export URAI_ADMIN_FIREBASE_PROJECT='<staging-project-id>'
export URAI_ADMIN_SEED_ACTOR='lifeloggerai@gmail.com'
pnpm seed:system-registry
```

For production:

```bash
unset URAI_ADMIN_ALLOW_NON_PRODUCTION_SEED
export URAI_ADMIN_FIREBASE_PROJECT='urai-4dc1d'
export URAI_ADMIN_SEED_ACTOR='lifeloggerai@gmail.com'
pnpm seed:system-registry
```

Both registry mutation flows require a short-lived WIF external-account ADC file whose impersonated service-account identity is bound to the exact target project. Raw service-account JSON, private keys, authorized-user refresh credentials, and inline credential material are rejected.

Evidence to record:

- project ID;
- count of seeded systems;
- timestamp;
- `/admin/system` screenshot or route smoke result.

## 6. Staging deploy

Use an approved short-lived ADC identity or a governed WIF-backed staging workflow. Never restore Firebase CLI token or raw JSON-key authentication.

```bash
firebase use <STAGING_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase hosting:channel:deploy urai-admin-staging --expires 14d
export URAI_ADMIN_STAGING_URL='<firebase-preview-url>'
pnpm test:smoke
```

Record the identity method, preview URL, and smoke output in `docs/EVIDENCE_LOG.md`.

## 7. Production deploy

Production deployment is governed through GitHub Actions, not an ad hoc terminal deploy:

1. Confirm the exact reviewed commit SHA is on `main`.
2. Confirm protected `GCP_WIF_PROVIDER` and `GCP_DEPLOY_SERVICE_ACCOUNT` variables resolve to the approved provider and least-privilege deploy identity.
3. Confirm provider-side trust conditions and IAM bindings have been reviewed and evidenced.
4. Run the manual `Deploy URAI Admin` workflow for the exact target SHA.
5. Preserve the workflow URL, auth/deploy evidence, verifier output, and live read-back evidence.

After deployment, verify these routes:

```bash
curl -I https://www.uraiadmin.com/
curl -I https://www.uraiadmin.com/status
curl -I https://www.uraiadmin.com/privacy
curl -I https://www.uraiadmin.com/terms
```

Do not substitute a local Firebase CLI token deployment for the governed WIF workflow.

## 8. DNS and SSL evidence

Confirm in Firebase Hosting or with shell checks:

```bash
curl -Iv https://www.uraiadmin.com 2>&1 | tee /tmp/urai-admin-ssl.txt
```

Record the SSL issuer/validity summary in `docs/EVIDENCE_LOG.md`.

## 9. Rollback evidence

List releases and pick the previous known-good release using approved ADC or the governed WIF identity path.

```bash
firebase hosting:releases:list --site "$URAI_ADMIN_HOSTING_SITE" -P urai-4dc1d
export URAI_ADMIN_ROLLBACK_RELEASE='<known-good-release-id>'
export URAI_ADMIN_HOSTING_SITE='<hosting-site-id>'
pnpm rollback:production
```

The rollback script must execute without `--token`. If you are only proving rollback readiness, record the exact known-good release ID and do not perform a destructive rollback unless needed.

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
WIF/provider IAM proof: <evidence location>
```

Do not mark production-ready before provider-side WIF trust/IAM, protected identity installation, exact-head deployment, and live evidence exist.