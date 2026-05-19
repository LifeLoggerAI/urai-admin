# URAI Admin Evidence Log

This file is the operational source of truth for release verification evidence.

Do not mark systems GREEN without evidence.

---

## Verification session

Date:
Operator:
Repo:
Branch:
Commit SHA:
Firebase project:
Hosting target/site:
Environment:

---

## Source-of-truth verification

| Item | Status | Evidence | Notes |
|---|---|---|---|
| Repo verified |  |  |  |
| Branch verified |  |  |  |
| Firebase project verified |  |  |  |
| Hosting target verified |  |  |  |
| Staging/prod separation verified |  |  |  |
| Env/secrets verified |  |  |  |
| CI workflows verified |  |  |  |
| Deployment path verified |  |  |  |
| Rollback path verified |  |  |  |

---

## Release gates

### Install

Command:

```bash
pnpm install
```

Status:
Logs:
Blockers:

### Lint

Command:

```bash
pnpm lint
```

Status:
Logs:
Blockers:

### Typecheck

Command:

```bash
pnpm typecheck
pnpm check:types
```

Status:
Logs:
Blockers:

### Unit tests

Command:

```bash
pnpm test
pnpm test:unit
```

Status:
Logs:
Blockers:

### Firestore rules tests

Command:

```bash
pnpm test:rules
```

Status:
Logs:
Blockers:

### E2E / route contract tests

Command:

```bash
pnpm test:e2e
```

Status:
Logs:
Blockers:

### Build

Command:

```bash
pnpm build
```

Status:
Logs:
Blockers:

### Smoke tests

Command:

```bash
pnpm test:smoke
pnpm smoke-test
```

Status:
Logs:
Blockers:

### Release verifier

Command:

```bash
pnpm verify:release
URAI_ADMIN_VERIFIER_RUN_COMMANDS=1 pnpm verify:release
```

Status:
Logs:
Blockers:

---

## Firestore rules verification

Required evidence:

- unauthenticated user denied;
- authenticated non-admin denied;
- inactive admin denied;
- viewer limited to viewer-safe collections;
- active admin allowed for privileged reads;
- audit and operational event records immutable after create;
- no raw consumer data exposed through broad rules.

Status:
Logs:
Blockers:

---

## Storage rules verification

Required evidence:

- non-admin denied protected access;
- admin-only paths verified;
- unsafe public writes denied.

Status:
Logs:
Blockers:

---

## Auth verification

Required evidence:

- `/admin/*` requires session;
- `/api/admin/*` requires verified admin session;
- invalid/expired sessions fail closed;
- inactive admins denied.

Status:
Logs:
Blockers:

---

## Deployment verification

Required evidence:

- public routes load;
- protected routes enforce auth;
- unauthenticated `/api/admin/users` returns `401`;
- no broken assets;
- no console-critical runtime failures;
- Firebase rules/indexes/storage deployed;
- Functions deployed;
- Hosting preview deployed;
- production domain DNS/SSL active;
- monitoring/alerting active;
- rollback release/SHA recorded.

Status:
Logs:
Blockers:

---

## 2026-05-18 — Production-grade system-lock scaffolding

- Branch: `production-grade-system-lock`
- Scope: root release scripts, Firestore production-lock collections, static release verifier, Firestore rules contract test, admin route contract test, final lock ledger, architecture/security/deployment/testing/runbook/system docs.
- Production verdict: `BLOCKED`
- Reason: no live command output, CI run, Firebase staging deploy, production deploy, DNS/SSL proof, monitoring proof, admin seed proof, rollback proof, or owner approval has been recorded in this evidence log yet.

---

## Final release status

GREEN = verified complete with evidence
YELLOW = partial or uncertain
RED = blocked, unsafe, broken, or unverified

Final status: RED / BLOCKED until evidence is supplied.

Final blockers:

- Fresh clean install evidence
- Typecheck/lint/unit/rules/e2e/smoke/build evidence
- Firebase staging deployment evidence
- Admin owner seed evidence
- Analytics and communications integration evidence or approved deferrals
- Legal route smoke evidence
- Production DNS/SSL evidence
- Monitoring evidence
- Rollback proof
- Owner approval

Approval:
