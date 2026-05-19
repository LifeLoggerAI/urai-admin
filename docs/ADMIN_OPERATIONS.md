# URAI Admin Operations

## Operator model

URAI Admin has three operational roles:

- `owner`: full production authority and release approval.
- `admin`: operational authority for approved admin workflows.
- `viewer`: read-only operational visibility.

All roles require an active `adminUsers/{uid}` record.

## Daily checks

- Review `/admin` dashboard.
- Review `/admin/system` for system health and release blockers.
- Review `/admin/audit` for suspicious activity.
- Review `/admin/dead-letters` for failed jobs.
- Review analytics and communications status cards when available.

## Release review

Before any production release:

1. Run `pnpm release:lock`.
2. Confirm `FINAL_LOCK.md` evidence table.
3. Confirm `docs/EVIDENCE_LOG.md` contains command output or CI links.
4. Confirm staging smoke passed.
5. Confirm rollback SHA/release is known.
6. Record owner approval.

## Admin mutations

Every admin mutation must create an immutable audit/operational event containing:

- actor UID
- actor email where available
- action
- target collection/id
- before/after summary where safe
- timestamp
- request id

Do not log secrets or raw consumer telemetry.

## Incident response

Use `docs/RUNBOOK.md` for incident actions and `pnpm rollback:production` for hosting rollback support.
