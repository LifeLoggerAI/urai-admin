# Staging Deployment Proof

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: external blocker ledger

| Item | Status | Required proof/action |
| --- | --- | --- |
| Firebase project | BLOCKED | Operator must verify target project in Firebase Console/CLI |
| Firebase env/secrets | BLOCKED | Configure required GitHub/Firebase secrets outside repo |
| Owner/admin seed | BLOCKED | Run safe bootstrap with verified UID/email |
| Custom claims | BLOCKED | Set and verify owner/admin/viewer claims |
| Firestore rules deployed | BLOCKED | Deploy rules and record log |
| Storage rules deployed | BLOCKED | Deploy rules and record log |
| Hosting/functions staging deploy | BLOCKED | Deploy preview/staging and record URL/log |
| Unauthenticated route smoke | BLOCKED | Verify `/admin/*` redirect and `/api/admin/*` 401 |
| Authorized role smoke | BLOCKED | Verify owner/admin/viewer behavior |
| Audit log proof | BLOCKED | Show read/write audit entries in staging |
| Sensitive reader proof | BLOCKED | Verify redaction/minimization against safe test data |
| Monitoring/logging | BLOCKED | Attach dashboard or alert proof |
| Rollback command | BLOCKED | Record dry-run or controlled rollback proof |
