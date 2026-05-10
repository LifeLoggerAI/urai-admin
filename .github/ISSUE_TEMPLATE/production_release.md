---
name: Production release
description: Track a URAI Admin production release to www.uraiadmin.com
title: "Production release: <date or version>"
labels: ["release", "production"]
assignees: []
---

## Release target

- Release commit SHA:
- GitHub Actions run URL:
- Firebase project: `urai-4dc1d`
- Production domain: `https://www.uraiadmin.com`

## Pre-release readiness

- [ ] `docs/RELEASE_CHECKLIST.md` reviewed.
- [ ] `docs/PRODUCTION_LAUNCH.md` reviewed.
- [ ] `docs/ROLLBACK_AND_INCIDENTS.md` reviewed.
- [ ] `docs/MONITORING_AND_OBSERVABILITY.md` reviewed.
- [ ] `.env.production.example` reviewed.
- [ ] GitHub CI is green for the release commit.
- [ ] No production secrets are committed.

## Production configuration

- [ ] GitHub production secrets are configured.
- [ ] Firebase project access confirmed.
- [ ] `www.uraiadmin.com` DNS/SSL confirmed.
- [ ] Initial owner admin is bootstrapped or already active.

## Validation commands

Record output or links for each:

- [ ] `pnpm preflight:production`
- [ ] `pnpm security:gate`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`

## Deployment

- [ ] GitHub Actions `Deploy URAI Admin` workflow started.
- [ ] Production preflight passed.
- [ ] Security gate passed.
- [ ] Build/test validation passed.
- [ ] Firebase deploy succeeded.
- [ ] `pnpm verify:production` passed.

## Manual QA

- [ ] Homepage loads.
- [ ] Login page loads.
- [ ] Owner/admin can sign in.
- [ ] Non-admin cannot access protected routes.
- [ ] `/api/admin/users` returns `401` anonymously.
- [ ] Logout clears session and returns to `/login`.
- [ ] Audit logs are written.

## Rollback readiness

- [ ] Last known good SHA recorded.
- [ ] Firebase Hosting rollback path confirmed.
- [ ] Functions rollback path confirmed.
- [ ] Rules rollback path confirmed.

## Release result

- [ ] Release completed successfully.
- [ ] Production verification output recorded.
- [ ] Monitoring watch completed.
- [ ] Follow-up issues created if needed.
