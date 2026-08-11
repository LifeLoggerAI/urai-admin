# URAI Admin Release Checklist

Use this checklist for every production release to `https://www.uraiadmin.com`.

## 1. Pre-release readiness

- [ ] Confirm the release commit is on `main`.
- [ ] Confirm GitHub CI is green for the release commit.
- [ ] Confirm no production secrets are committed.
- [ ] Confirm `.env.production.example` is up to date.
- [ ] Confirm `docs/PRODUCTION_LAUNCH.md` is up to date.
- [ ] Confirm `docs/ROLLBACK_AND_INCIDENTS.md` is up to date.

## 2. Production configuration

- [ ] Protected GitHub variable `GCP_WIF_PROVIDER` points to the approved Workload Identity Provider.
- [ ] Protected GitHub variable `GCP_DEPLOY_SERVICE_ACCOUNT` points to the least-privilege deploy service account.
- [ ] Provider-side WIF trust conditions restrict the approved repository/workflow context.
- [ ] Deploy service-account IAM is least privilege and verified before production dispatch.
- [ ] Runtime Google/Firebase access uses a managed runtime identity or approved ADC path; no raw service-account JSON is required by the application.
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` exists in protected production configuration.
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` exists in protected production configuration.
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set to `urai-4dc1d`.
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` exists in protected production configuration.
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` exists in protected production configuration.
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` exists in protected production configuration.
- [ ] No `FIREBASE_TOKEN`, `FIREBASE_SERVICE_ACCOUNT_KEY`, or equivalent long-lived JSON deploy credential is configured for the governed deploy path.

## 3. Domain and Firebase readiness

- [ ] Firebase project `urai-4dc1d` is accessible to the release owner.
- [ ] Firebase Hosting has `www.uraiadmin.com` connected.
- [ ] SSL is active for `www.uraiadmin.com`.
- [ ] Apex `uraiadmin.com` redirects or is intentionally handled.
- [ ] Firestore rules are ready to deploy.
- [ ] Storage rules are ready to deploy.
- [ ] Functions deploy permissions are confirmed for the governed deploy identity.

## 4. Admin owner bootstrap

- [ ] Initial owner has a Firebase Auth user.
- [ ] `URAI_ADMIN_OWNER_UID` is known.
- [ ] `URAI_ADMIN_OWNER_EMAIL` is known.
- [ ] Run `pnpm bootstrap:owner` with approved ADC or managed identity credentials; do not use raw service-account JSON.
- [ ] Confirm `adminUsers/{uid}` has `role: owner` and `isActive: true`.
- [ ] Confirm owner custom claims are set.
- [ ] Confirm bootstrap audit log exists.

## 5. Local/operator validation

Run from the repository root with an approved ADC identity when Google/Firebase access is required:

```bash
pnpm install --frozen-lockfile=false
pnpm preflight:production
pnpm security:gate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- [ ] Production preflight passes.
- [ ] Security gate passes.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Build passes.

## 6. Deployment

Canonical path:

- [ ] Open GitHub Actions.
- [ ] Run `Deploy URAI Admin` for the exact reviewed commit SHA.
- [ ] Confirm the workflow fails closed if `GCP_WIF_PROVIDER` or `GCP_DEPLOY_SERVICE_ACCOUNT` is absent.
- [ ] Confirm OIDC/WIF authentication succeeds without JSON credentials or Firebase CLI tokens.
- [ ] Confirm `Production preflight` passes.
- [ ] Confirm `Security gate` passes.
- [ ] Confirm validation passes.
- [ ] Confirm Firebase deploy succeeds.
- [ ] Confirm `Verify production live deployment` passes.

Local deployment is not the canonical production path. If an emergency operator procedure is explicitly authorized, it must use approved ADC/short-lived identity and preserve the same exact-SHA, validation, evidence, and rollback controls.

## 7. Manual production QA

- [ ] Visit `https://www.uraiadmin.com`.
- [ ] Confirm homepage loads and looks polished.
- [ ] Visit `/login`.
- [ ] Confirm owner/admin can sign in.
- [ ] Confirm non-admin cannot access admin routes.
- [ ] Confirm `/admin` dashboard loads for owner/admin.
- [ ] Confirm sidebar navigation works.
- [ ] Confirm logout clears the session and returns to `/login`.
- [ ] Confirm `/api/admin/users` returns `401` anonymously.
- [ ] Confirm audit logs are written for login/admin activity.

## 8. Rollback readiness

- [ ] Last known good commit SHA is recorded.
- [ ] Firebase Hosting rollback path is understood.
- [ ] Functions-only rollback path is understood.
- [ ] Rules-only rollback path is understood.
- [ ] Rollback execution uses the governed WIF/ADC identity path and no long-lived Firebase CLI token.
- [ ] Incident owner is identified.

## 9. Release closure

- [ ] Release commit SHA recorded.
- [ ] GitHub Actions run URL recorded.
- [ ] WIF authentication and deploy-identity evidence recorded.
- [ ] Production verifier output recorded.
- [ ] Manual QA result recorded.
- [ ] Rollback readiness confirmed.
- [ ] GitHub issue #4 updated or closed only if all launch blockers are complete.

Do not mark production complete unless every required item above is done. Repository-side WIF configuration alone does not prove provider-side trust, IAM, runtime identity installation, or production authorization.