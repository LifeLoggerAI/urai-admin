# Admin current conflicts / blockers

**P0 — shared Firestore project and Rules collision.** Candidate .firebaserc selects urai-4dc1d, which Spatial and RuAi source aliases also select with different policies. Requires authorized cloud read-only effective Rules/IAM/deployer check, explicit publisher owner or verified isolation, combined owner/tenant denial tests. [Labs guard #261](https://github.com/LifeLoggerAI/urai-labs-llc/pull/261) remains draft; no cloud mutation authorized.

**P0 — production release authority.** [FINAL_LOCK.md](https://github.com/LifeLoggerAI/urai-admin/blob/8313188532aef304a3b55771c5080f87e4ac71eb/FINAL_LOCK.md) says PARTIAL / BLOCKED. Native source CI is green, but exact deployed Hosting/Functions SHA, true WIF principals and approved site target, independent privacy/security review, protected owner/admin/viewer sessions, Firebase claims, monitoring/alert, signed owner approval and rollback drill are not verified. An existing public health GET is insufficient.

**P0 — Analytics ingestion.** [Candidate event handler](https://github.com/LifeLoggerAI/urai-admin/blob/8313188532aef304a3b55771c5080f87e4ac71eb/apps/urai-analytics/src/app/api/v1/events/route.ts) intentionally returns 503 for positive storage without valid canonical purpose, subject authority and deletion fence. Never bypass by trusting client consent, configuring a toggle or moving unauthorized data to the generic Admin reader.

**P0 — historical sensitive files and rights.** Some old branch trees expose environment-file *names* and duplicated backup paths. Treat as restricted security triage (possible secret exposures, independently inspect/rotate only with authority) rather than copying or echoing secret contents. The exact 2024-present asset chain and all old commits remain unreviewed.

**P1 — independent local forks.** [braces](https://github.com/LifeLoggerAI/urai-admin/blob/8313188532aef304a3b55771c5080f87e4ac71eb/vendor/braces/SECURITY-FORK.md) and [stream-json](https://github.com/LifeLoggerAI/urai-admin/blob/8313188532aef304a3b55771c5080f87e4ac71eb/vendor/stream-json/SECURITY-FORK.md) are shipped as local mitigations, not vendor patched releases. Require independent security analysis, lockfile consumer reachability and successor SHA tests.

**P1 — Storytime and provider bridges.** The Admin Storytime moderation route is intentionally hard-off, not connected and does not allow approval/release. Cross-project identity, least privilege, audit evidence, child/family privacy reviews, and rollback remain prerequisites.

**P1 — historical authority collision.** Proposed one-file canon branch requires upstream Labs #102 (closed/unmerged). Do not treat it as a governing source. The newer master #262 remains an OPEN DRAFT coordination mechanism, not an adopted release policy.

**P1 — historical evidence contradictions.** Old COMPLETE, SEALED, LIVE and PR #75 references do not certify PR #85; tie each assertion to commit, artifact, date, and actual provider/device result.

**Forensics limitation:** no all-branch unique object/historical semantic recovery, no complete 906-file raw bytes, no LFS subobject audit, no source-bound provider positive runtime.
