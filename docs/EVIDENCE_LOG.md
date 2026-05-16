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
```

Status:
Logs:
Blockers:

### Tests

Command:

```bash
pnpm test
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
pnpm smoke-test
```

Status:
Logs:
Blockers:

---

## Firestore rules verification

Required evidence:

- unauthenticated user denied;
- authenticated non-admin denied;
- active admin allowed;
- audit logging confirmed for sensitive mutations.

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
- no console-critical runtime failures.

Status:
Logs:
Blockers:

---

## Final release status

GREEN = verified complete with evidence
YELLOW = partial or uncertain
RED = blocked, unsafe, broken, or unverified

Final status:

Final blockers:

Approval:
