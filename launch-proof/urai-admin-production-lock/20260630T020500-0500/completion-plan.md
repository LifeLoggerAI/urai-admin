# Completion Plan to 100 Percent

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: completion plan

1. Merge or review `production-lock-admin-20260630` after CI proves it.
2. Run clean install and all root release commands.
3. Fix any safe repo-side failures and rerun.
4. Verify Firebase project, Hosting target, Auth domains, env, and secrets.
5. Bootstrap owner/admin with verified UID/email.
6. Implement or prove custom claims synchronization for role updates.
7. Deploy staging preview.
8. Smoke public routes, protected route denial, API 401/403, and owner/admin/viewer flows.
9. Verify typed confirmations with E2E/browser checks.
10. Verify audit logs for user list, active-state change, role change, and feature flag change.
11. Verify privacy request metadata minimization with safe staging data.
12. Verify monitoring and incident/alert path.
13. Verify rollback release and command.
14. Record owner approval.
15. Only after all proof exists, update `FINAL_LOCK.md` to READY / PRODUCTION READY.
