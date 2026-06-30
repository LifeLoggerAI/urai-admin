# Production Deployment Proof

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: production blocker ledger

| Item | Status | Required proof/action |
| --- | --- | --- |
| Production deploy output | BLOCKED | Do not deploy until install/test/build/staging gates pass |
| Production URL | BLOCKED | Verify final canonical URL after deploy |
| DNS | BLOCKED | Verify domain records for `www.uraiadmin.com` if used |
| SSL | BLOCKED | Verify active certificate in Firebase Hosting/browser |
| Public route smoke | BLOCKED | Verify `/`, legal pages, login, docs |
| Protected route smoke | BLOCKED | Verify unauthenticated admin denial |
| Admin seed access | BLOCKED | Verify authorized owner/admin login |
| Role smoke | BLOCKED | Verify owner/admin/viewer behavior |
| Audit log proof | BLOCKED | Verify controlled test action creates audit entry |
| Monitoring | BLOCKED | Verify dashboard/alerts |
| Rollback | BLOCKED | Verify known-good release/SHA and rollback command |
| Owner approval | BLOCKED | Record signed/dated approval |

Production must remain BLOCKED until all required proof exists.
