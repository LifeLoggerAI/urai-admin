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

- [ ] `FIREBASE_TOKEN` exists in GitHub production secrets.
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` exists in GitHub production secrets.
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` exists in GitHub production secrets.
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set to `urai-4dc1d`.
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` exists in GitHub production secrets.
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` exists in GitHub production secrets.
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` exists in GitHub production secrets.
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` is configured if required by the runtime.

## 3. Domain and Firebase readiness

- [ ] Firebase project `urai-4dc1d` is accessible to the release owner.
- [ ] Firebase Hosting has `www.uraiadmin.com` connected.
- [ ] SSL is active for `www.uraiadmin.com`.
- [ ] Apex `uraiadmin.com` redirects or is intentionally handled.
- [ ] Firestore rules are ready to deploy.
- [ ] Storage rules are ready to deploy.
- [ ] Functions deploy permissions are confirmed.

## 4. Admin owner bootstrap

- [ ] Initial owner has a Firebase Auth user.
- [ ] `URAI_ADMIN_OWNER_UID` is known.
- [ ] `URAI_ADMIN_OWNER_EMAIL` is known.
- [ ] Run `pnpm bootstrap:owner` with production credentials.
- [ ] Confirm `adminUsers/{uid}` has `role: owner` and `isActive: true`.
- [ ] Confirm owner custom claims are set.
- [ ] Confirm bootstrap audit log exists.

## 5. Local/operator validation

Run from the repository root:

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

Preferred path:

- [ ] Open GitHub Actions.
- [ ] Run `Deploy URAI Admin`.
- [ ] Confirm `Production preflight` passes.
- [ ] Confirm `Security gate` passes.
- [ ] Confirm validation passes.
- [ ] Confirm Firebase deploy succeeds.
- [ ] Confirm `Verify production live deployment` passes.

Manual fallback:

```bash
pnpm preflight:production
pnpm security:gate
pnpm deploy
pnpm verify:production
```

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
- [ ] Incident owner is identified.

## 9. Release closure

- [ ] Release commit SHA recorded.
- [ ] GitHub Actions run URL recorded.
- [ ] Production verifier output recorded.
- [ ] Manual QA result recorded.
- [ ] Rollback readiness confirmed.
- [ ] GitHub issue #4 updated or closed only if all launch blockers are complete.

Do not mark production complete unless every required item above is done.
