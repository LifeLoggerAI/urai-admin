# URAI Admin Agent Instructions

## Repo overview

`urai-admin` is the URAI Admin / Council operations control plane. It is a pnpm workspace with a Next.js admin app in `apps/urai-admin`, Firebase Functions in `functions`, analytics packages/apps, Firestore rules, Storage rules, and Firebase Hosting configuration.

## Commands to run

Before opening a production-oriented PR, run or document blockers for:

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

## Files to treat carefully

- `firestore.rules`
- `storage.rules`
- `firebase.json`
- `.firebaserc`
- `.env.production.example`
- `FINAL_LOCK.md`
- `docs/EVIDENCE_LOG.md`
- `scripts/bootstrap-owner.mjs`
- `scripts/rollback-production.sh`
- `functions/src/index.ts`

## Security rules

- Do not commit secrets.
- Do not weaken Firestore or Storage rules to make tests pass.
- Do not rely on client-side admin checks only.
- Do not expose raw consumer passive telemetry in the admin app without privacy approval.
- Do not mark systems healthy without live evidence.

## PR expectations

Every PR must include:

- Summary
- Commands run
- Tests added/changed
- Security/privacy impact
- Evidence added or blockers documented
- Final verdict: `BLOCKED`, `STAGING READY`, or `PRODUCTION READY`

Only use `PRODUCTION READY` when `FINAL_LOCK.md` and `docs/EVIDENCE_LOG.md` contain staging, production, DNS/SSL, monitoring, rollback, legal, admin seed, and owner approval evidence.
