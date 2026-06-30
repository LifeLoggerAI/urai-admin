# Blockers

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: blocker ledger

## P0 production-lock blockers

- Run and record `pnpm install`.
- Run and record typecheck, lint, unit, rules, E2E, smoke, build, release verifier, and release lock.
- Verify Firebase project, env, secrets, Auth domains, and Hosting target.
- Bootstrap owner/admin safely and record proof.
- Verify Firebase custom claims sync.
- Deploy staging and record smoke proof.
- Deploy production only after staging is green.
- Verify DNS/SSL.
- Verify monitoring/alerting.
- Verify rollback.
- Record owner approval.

## P1 important fixes

- Add or verify Firebase custom-claims synchronization for role updates.
- Add E2E proof for typed confirmations.
- Add read-audit policy for sensitive generic collection reads if required.
- Complete privacy review for request metadata fields.

## P2 polish

- Remove or quarantine legacy backup folders/scripts if they confuse release path.
- Add browser screenshots with safe redaction to evidence log.
- Add docs linking each route to its source API and test.

## P3 later enhancements

- Add admin action rollback helpers.
- Add rate limiting for sensitive admin APIs if not already present upstream.
- Add stronger security headers/CSP proof.
