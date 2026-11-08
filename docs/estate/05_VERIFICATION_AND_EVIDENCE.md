# Admin exact-head build, test, artifact and runtime ledger

**Exact engineering head:** 8313188532aef304a3b55771c5080f87e4ac71eb, draft PR [#85](https://github.com/LifeLoggerAI/urai-admin/pull/85); original CI execution date **2026-10-10 UTC**. In this R852 continuation the GitHub workflows and decoded original job logs were read. Tests were NOT rerun locally.

| Native action at exact SHA | GitHub run / job | Observed result and important scope |
| --- | --- | --- |
| Admin CI | [38010329537](https://github.com/LifeLoggerAI/urai-admin/actions/runs/38010329537), job 114088597420 | SUCCESS; exact checkout, frozen install, dependency behavior, registry emulator, Auth/Firestore emulator step, security/target controls, Functions, lint/typecheck, two Next builds; **52 Functions cases PASS / 0 fail** in decoded log |
| Validate | [38010329652](https://github.com/LifeLoggerAI/urai-admin/actions/runs/38010329652), job 114088597046 | SUCCESS; exact clean source, pnpm install, Admin typecheck and build |
| Visual Truth | [38010329622](https://github.com/LifeLoggerAI/urai-admin/actions/runs/38010329622), job 114088597263 | SUCCESS; local exact-head desktop/mobile browser screenshot generation and fixture truth labels; NOT physical device or live authorization |
| Production Verify | [38010329728](https://github.com/LifeLoggerAI/urai-admin/actions/runs/38010329728), job 114088598169 | SUCCESS; original logs show **28 audit cases / 0 fail**, Analytics tests, 52 Functions tests and Next builds; this workflow is a source verification job, NOT a production deploy |
| Four additional same-SHA runs | 38009047599 / 38009047635 / 38009047716 / 38009047646 | Also SUCCESS in current GitHub workflow listing; do not double-count these as 8 distinct release approvals |

**Important fail-closed proof:** CI explicitly expects production preflight to REFUSE without WIF/production secrets and reports 'OK: production preflight failed closed'. The logged exit 1 is expected and the workflow SUCCESS does NOT imply successful production deployment.

**Artifact existence verified via GitHub first-page lists:** run 38010329537 retained registry-emulator artifact ID 11653340291, Auth runtime artifact ID 11652659988 and CI evidence artifact ID 11652689928; validate artifact ID 11653305860; visual artifact ID 11652134971; production verify artifact ID 11653253763. GitHub reports them as not expired in this observation. Their ZIP payload bytes were **not independently redownloaded/decompressed/hashed in this R852 pass**; original logs include published upload hash and receipts.

**Prior independent worker report (NOT a new R852 test):** Auth/Firestore emulator result **27/27 PASS** and registry seed/readback **17 systems** at exact head were reported in the uploaded 2026-11-07 admin history. CI steps now directly verified as successful, but individual archived JSON check names/counts remain to be read from artifacts before independent reclassification.

**Acceptance levels still OPEN:** protected provider IAM, effective Rules, owner bootstrap/session, true source-bound live deployed revision, actual Analytics/Storytime delivery, data retention/deletion, current physical device and accessibility acceptance, protected deployment approval, source-bound rollback and independent release signoff.
