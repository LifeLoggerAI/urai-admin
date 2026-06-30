# Monitoring and Rollback Proof

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: external blocker ledger

## Monitoring

Status: BLOCKED.

Required proof:

- Firebase/Cloud logs location;
- alerting policy for admin API errors and auth failures;
- owner/operator notification path;
- dashboard URL or screenshot with safe redaction;
- incident contact and escalation path.

## Rollback

Status: BLOCKED.

Required proof:

- known-good commit SHA;
- known-good Firebase Hosting release ID;
- `URAI_ADMIN_ROLLBACK_RELEASE` or equivalent value;
- controlled rollback command output or dry-run proof;
- owner/contact approval for rollback path.
