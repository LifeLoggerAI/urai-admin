# Admin dedicated Hosting target source gates

Base: `85df257cf1bc382e5abb455900abd146b21c4c0b`, tree `cd5e53bb525621dd08b36dcd8704d253a7f27180`.

The exact-head hosted Verify URAI Admin job 113046113635 failed after its real isolated registry and protected Auth/RBAC emulator receipts passed. Its retained security shell still required `firebase deploy --only hosting,functions,firestore,storage -P urai-4dc1d`; the stronger owner instead deploys only `hosting:urai-admin-production`. The retained WIF rollback contract had the same broad-command requirement. The actual deployment and rollback implementations are preserved.

Both source gates now require the dedicated Admin target and the bound-target validator. The shell also executes the actual structural Hosting validator, which permits an unbound reviewed symbolic target during source validation while deployment continues to require the protected exact-site binding. Existing main context, exact SHA, WIF/ADC, manual dispatch, rollback and secret isolation guards remain.

Executed Node 22.23.3 tests copy the actual source gates and required source/configuration into isolated temporary checkouts. They accept the reviewed dedicated-target deployment and deny broad Hosting, a foreign target and a missing binding guard. The ten existing actual deployment/rollback and Hosting tests remain. On the predecessor, the resulting eighteen cases report fourteen PASS and four FAIL: both valid dedicated commands are rejected and both unsafe broad commands are accepted. The repaired source reports eighteen PASS, zero FAIL. The ordinary declared `corepack pnpm security:gate` passes both the actual shell and WIF contract. No build/test flags or installed graph, lockfile, API, authentication, rules or deployment source are changed.

Original local logs:

- `/tmp/admin-85df-hosting-security-before.log`: predecessor 14 PASS / 4 FAIL.
- `/tmp/admin-85df-hosting-security-after.log`: repaired 18 PASS / 0 FAIL.
- `/tmp/admin-85df-hosting-security-gate-after.log`: declared source security gate PASS.

Original exact-85df hosted job log is retained as `lanes/privacy/evidence/admin-85df-native-job113046113635.log`, SHA-256 `ca92877980246b0d9236d45dea5c843afb1f126f8af6c834690d899712e55690`. It records seventeen installed mitigation cases PASS and the genuine eighteen-check protected runtime emulator receipt PASS. Native receipt artifact 11516540541 has archive digest `sha256:0e8f9e64f7b0733ba5309c50c4fedabb0c7e389d0b0052acd5d47b96b34fe9e3`; this proof belongs to exact 85df, not a relabelled successor. The separate original local eighteen-case runtime receipt remains exact adc8.

This repair targets deliberate draft-owner source convergence under the expected 85df lease. It does not satisfy fresh successor hosted CI, independent local-fork review, protected deployed parity or release signoff. Production Hosting remains unbound. The earlier adc8 full release command failed at public unauthenticated smoke CONNECT403 after source/build/route gates; no full successor release PASS is claimed. No production deployment, paid provider, real private account data or cloud credential was used.
