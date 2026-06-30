# URAI Admin Production Lock Audit

Date: 2026-06-30
Repo: LifeLoggerAI/urai-admin
Default branch inspected: main
Observed commit SHA from GitHub file search/fetch results: fbd6be5ed7901e77e44959454627fc8c89802c13
Auditor: ChatGPT URAI Admin / Operator Surface Due Diligence Agent

## Verdict

FINAL VERDICT: BLOCKED / PARTIAL.

URAI Admin has real protected admin architecture, route middleware, Firebase Admin session verification, Firestore-backed admin APIs, audit-log writes, release scripts, and conservative production-lock documentation. It is not production ready because no fresh install/lint/typecheck/test/build/deploy evidence, Firebase staging/live proof, DNS/SSL proof, admin seed proof, monitoring proof, rollback proof, or owner approval is recorded.

## Execution note

The ChatGPT container could not clone GitHub because network/DNS access to github.com was unavailable in the runtime. This audit therefore uses direct GitHub connector inspection only. Do not treat this report as proof that install/build/tests passed.

## Confirmed repository facts

- Repository: LifeLoggerAI/urai-admin
- Visibility: public
- Default branch: main
- Connector permissions observed: admin, maintain, pull, push, triage
- App source claimed by docs: apps/urai-admin
- Functions source: functions
- Firebase config: firebase.json, .firebaserc, firestore.rules, storage.rules, firestore.indexes.json

## Protected route map

Public product routes documented:
- /
- /features
- /pricing
- /security
- /docs
- /contact
- /privacy
- /terms
- /login

Protected console routes documented/linked:
- /admin
- /admin/users
- /admin/projects
- /admin/feature-flags
- /admin/jobs
- /admin/job-runs
- /admin/dead-letters
- /admin/system
- /admin/audit
- /admin/policies
- /admin/privacy-requests
- /admin/settings

Middleware protects:
- /admin/:path*
- /api/admin/:path*

## Admin API/action map

Observed real server-side protected APIs:
- GET /api/auth/admin-session: verifies Firebase session cookie and allowed role.
- GET /api/admin/users: owner/admin only, reads adminUsers and records auditLogs entry.
- POST /api/admin/set-user-active: owner/admin only, activates/deactivates admin user in Firestore transaction and writes audit log; blocks self-deactivation.
- POST /api/admin/update-user-role: owner only, changes admin role in Firestore transaction and writes audit log.
- POST /api/admin/set-flag: owner/admin only, updates featureFlags and writes audit log.
- GET /api/admin/collection: allowlisted collection reader with per-collection role policy and sensitive-field redaction.

## Auth and role status

Implemented:
- Next middleware checks admin page/API routes.
- Missing session cookie returns redirect for pages or 401 for admin APIs.
- Session verification calls /api/auth/admin-session.
- requireAdminSession verifies Firebase session cookie with revocation check, checks custom role claim, and checks matching active adminUsers record.
- Roles observed: owner, admin, viewer.

Not fully proven:
- No live or emulator proof that invalid/expired/revoked sessions fail closed.
- No proof that adminUsers custom claims and Firestore records stay synchronized after role changes.
- No owner seed proof.

## Real vs fake dashboard status

Real / partially real:
- Admin dashboard shell and navigation exist.
- Runtime APIs exist for admin users, collection reads, feature flags, role changes, active-state changes, and audit logging.
- Firestore rules are deny-by-default with specific admin allow cases.
- Storage rules are deny-all.

Potentially misleading until live data is proven:
- Dashboard copy says Auth Protected, Runtime Live APIs, and Runtime loaded. This should remain acceptable only if the deployed runtime truly has Firebase env configured and admin APIs verified.
- Product docs claim broad operator capabilities, but many modules may be read-only or dependent on seeded Firestore collections.

Fake/static risk:
- No evidence log proving live metrics, analytics, communications, monitoring, or deployment controls are connected.
- Static build shell intentionally renders without credentials; this is safe, but it must not be marketed as a fully live control plane until verified.

## Security findings

P0 blockers:
1. Production lock is explicitly BLOCKED in FINAL_LOCK.md.
2. Evidence log is mostly blank and says final status RED/BLOCKED.
3. No clean install/lint/typecheck/unit/rules/e2e/smoke/build evidence recorded.
4. No Firebase staging/production deploy proof.
5. No DNS/SSL proof for www.uraiadmin.com.
6. No owner approval or admin bootstrap proof.
7. No monitoring or rollback proof.

P1 blockers:
1. Destructive-ish admin actions exist for deactivation and role changes, but UI actions appear to fire directly without a visible typed confirmation modal.
2. Role changes update Firestore adminUsers, but custom claim synchronization is not proven.
3. Generic collection reader includes privacyRequests for owner/admin; privacy review and field minimization need proof.
4. The repo is public; docs warn not to commit secrets, but public exposure must be consciously accepted or changed before launch.

P2 blockers:
1. docs and backups contain legacy paths/scripts; continue cleanup or keep clearly marked unsafe.
2. Browser E2E is recommended beyond static route contract tests.
3. Confirm analytics and communications are either real integrations or approved deferrals.

P3 cleanup:
1. Improve dashboard copy to label unconnected modules as Not connected / Awaiting evidence.
2. Add screenshots/log snippets to docs/EVIDENCE_LOG.md after every verification run.

## Required path to 100 percent

1. Run from clean checkout on authorized machine/CI:
   - pnpm install
   - pnpm preflight:production
   - pnpm security:gate
   - pnpm check:types
   - pnpm lint
   - pnpm test:unit
   - pnpm test:rules
   - pnpm test:e2e
   - pnpm test:smoke
   - pnpm build
   - pnpm verify:release
   - pnpm release:lock
2. Record logs in docs/EVIDENCE_LOG.md.
3. Verify Firebase project, hosting site, env/secrets, Auth domains, rules, indexes, Storage rules, Functions deployment.
4. Bootstrap owner/admin and prove UID/email/role.
5. Deploy staging preview and smoke protected/admin denial paths.
6. Confirm analytics/communications/monitoring or document explicit owner-approved deferrals.
7. Add confirmation UI for role changes and account deactivation if not already in another component.
8. Verify role update also updates Firebase custom claims or document/manualize the required sync.
9. Verify production DNS/SSL, rollback, monitoring, owner approval.
10. Only then change FINAL_LOCK.md from BLOCKED to READY/PRODUCTION READY.

## Proof folder

launch-proof/urai-admin-production-lock/20260630T000000-0500/
