# URAI Admin Final Lock

**Current verdict: BLOCKED**

Date: 2026-05-18
Target production domain: `https://www.uraiadmin.com`
Runtime lock: pnpm workspace, Node 20, Next.js app in `apps/urai-admin`, Firebase Hosting, Firebase Functions, Firebase Auth, Firestore, Storage rules.

## Production-lock definition

`urai-admin` is production locked only when every release gate below has command output, deployment evidence, or an explicit documented deferral with owner, date, risk, and rollback path. A passing local build is not enough. Staging smoke, production environment validation, DNS/SSL, monitoring, rollback proof, admin seed, legal links, and owner approval are mandatory.

## Privacy boundary

URAI Admin is an internal operations control plane. It may display operational metadata, admin audit events, system health, partner review state, release evidence, aggregate analytics status, and communications status. It must not expose raw consumer passive telemetry, raw audio, private transcripts, consumer identity vectors, or unreviewed health/mental-health inference records unless a privacy review explicitly approves the collection, route, field list, retention model, and admin role.

## Evidence table

| Gate | Required proof | Status | Owner/date/risk |
| --- | --- | --- | --- |
| Clean install | `pnpm install` from clean checkout | BLOCKED | Needs fresh CI/local evidence |
| Typecheck | `pnpm check:types` | BLOCKED | Needs fresh CI/local evidence |
| Lint | `pnpm lint` | BLOCKED | Needs fresh CI/local evidence |
| Unit tests | `pnpm test:unit` | BLOCKED | Needs fresh CI/local evidence |
| Rules tests | `pnpm test:rules` or emulator suite | BLOCKED | Static contract exists; emulator proof still required |
| E2E tests | `pnpm test:e2e` | BLOCKED | Static route contract exists; browser E2E still recommended |
| Smoke tests | `pnpm test:smoke` | BLOCKED | Needs staging/live URL evidence |
| Build | `pnpm build` | BLOCKED | Needs fresh CI/local evidence |
| Release verifier | `pnpm verify:release` | BLOCKED | Needs fresh run evidence |
| Firebase env configuration | GitHub/Firebase env values present, no secrets committed | BLOCKED | Needs operator confirmation |
| Rules/index/storage deploy | Firebase deploy logs | BLOCKED | Needs deploy evidence |
| Hosting preview deploy | Firebase preview URL | BLOCKED | Needs staging evidence |
| Admin seed | `pnpm bootstrap:owner` and Firebase Auth UID confirmed | BLOCKED | Needs owner UID/email evidence |
| Communications integration | Contract/live status or approved deferral | BLOCKED | Needs integration evidence |
| Analytics integration | Contract/live status or approved deferral | BLOCKED | Needs integration evidence |
| Legal links | `/privacy`, `/terms`, support route verified | BLOCKED | Needs route/live smoke proof |
| Staging deploy | Staging channel URL and smoke results | BLOCKED | Needs Firebase evidence |
| Production deploy | Production deploy log | BLOCKED | Not allowed until prior gates pass |
| DNS/SSL | Firebase Hosting SSL active for `www.uraiadmin.com` | BLOCKED | Needs console or live proof |
| Monitoring | Alerting/logging dashboard link or deferral | BLOCKED | Needs evidence |
| Rollback | Known-good SHA/release and rollback command proof | BLOCKED | Rollback helper exists; proof required |
| Owner approval | Adam Clamp or designated owner signoff | BLOCKED | Required before production ready |

## Required command sequence

```bash
pnpm install
pnpm check:types
pnpm lint
pnpm test:unit
pnpm test:rules
pnpm test:e2e
pnpm test:smoke
pnpm build
pnpm verify:release
pnpm release:lock
```

For stricter local verification:

```bash
URAI_ADMIN_VERIFIER_RUN_COMMANDS=1 pnpm verify:release
```

## Staging deployment checklist

1. Confirm `.env.production.example` maps to GitHub environment secrets and Firebase config without committing secrets.
2. Run `pnpm release:lock` locally or in CI.
3. Deploy Firestore rules, indexes, and Storage rules to staging project.
4. Deploy a Firebase Hosting preview channel.
5. Run smoke tests against staging URL.
6. Record staging URL, commit SHA, command output, and screenshots/logs in `docs/EVIDENCE_LOG.md`.

## Production deployment checklist

1. Confirm all evidence table gates are green except production-only gates.
2. Confirm owner approval is recorded.
3. Confirm rollback SHA/release is recorded.
4. Deploy Firebase rules, indexes, Storage, Functions, and Hosting.
5. Verify `https://www.uraiadmin.com`, login, legal routes, protected admin denial, and admin seed access.
6. Verify DNS/SSL, monitoring, and alerting.
7. Update this file from `BLOCKED` to `PRODUCTION READY` only after proof exists.

## Rollback checklist

```bash
export URAI_ADMIN_FIREBASE_PROJECT=urai-4dc1d
export URAI_ADMIN_HOSTING_SITE=<hosting-site-id>
export URAI_ADMIN_ROLLBACK_RELEASE=<known-good-hosting-release>
pnpm rollback:production
```

For code/rules rollback, set `URAI_ADMIN_ROLLBACK_COMMIT` and follow the generated operator steps. Record all rollback evidence in `docs/EVIDENCE_LOG.md`.

## Owner approval

Owner approval is not yet recorded. Production is blocked until approval is added with date, approver, target SHA, and deployment evidence.
