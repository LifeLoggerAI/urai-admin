# R1660 — Mission Control + Founder Inbox convergence: exact-source review, HOLD

**Observed:** November 21, 2026, America/Chicago. **Scope:** source-only, review branch, no merge/deployment/provider change. Genesis **HOLD / NO-GO**, private-memory writes **DISABLED**.

## Why this exists

The real Admin institutional mission-control branch and the Founder Inbox offline branch were previously **separate and unmerged**. Admin PR #123 contains transaction-fenced mission worker/receipt operations. Admin PR #124 contains the validated Founder Inbox evidence projector, custody/archive checks, HTML visualization generator and original-video provider reconciliation. Neither branch alone constituted an authenticated full task→receipt→Founder Inbox experience.

This review convergence branch was created **from exact Admin PR #123 head** `ce78d415f3c2c2171c9bcb2f32da6981880a6db4`. The 21 changed file paths of PR #124, exact head `d9bd72d198986fc5befc2008f2f44d62093ec180`, were inserted as the same Git blob objects into a new Git tree, with **zero overlapping paths/conflicts**. We did not merge either PR into `main`, and the source remains a review-only candidate.

## New connection: single authorized task-and-receipts snapshot

`functions/src/institutionalMissionCoordination.ts` now adds:

```ts
readTaskWithReceipts(actorId, taskId)
```

It requires an exact actor/task identity, calls the existing READ authorizer, then **rechecks the READ grant plus server-owned transactional revocation fence within one Firestore transaction**, and retrieves the task plus its `receipts/execution` and `receipts/verification` documents through that transaction. Missing tasks and cross-task receipt IDs DENY. It is a **single known task read** and does not expose collection scans, a web route, provider credentials, live users or private media.

`scripts/mission-receipt-inbox.mjs` is a separate, pure metadata projector consuming only this exact `readTaskWithReceipts` method. It reuses the original R1653 `projectMissionDelivery` for exact source SHA, evidence digest, worker identity, independent reviewer PASS and mismatched pointer checks. Even accepted tasks can only become `VERIFIED_POINTER`, **never** `DELIVERED` or `artifactBytesVerified:true`. Every output explicitly sets `founderAcknowledged:false`, `automaticallyDispatches:false`, `releaseGate:HOLD_NO_GO` and `privateMemoryWrites:DISABLED`.

## Verified local simulation (existing paid Pod; no new machine)

On existing Runpod Pod `u7efpw44681cza` (Node v22.23.5), exact source files were fetched from this review branch. Used the already established R1559 optimistic Firestore test harness, not a genuine deployed Firestore SDK/emulator. Test runtime used TypeScript 5.5.4 to transpile the exact TypeScript class and the existing source-owned grant fence.

- Existing mission lease/transaction tests plus six new R1660 receipt-read and integration cases: **20/20 PASS**.
- R1660 JavaScript adapter tests for exact authorized read, denial propagation, no collection scans, forged receipts, false acknowledgements: **5/5 PASS**.
- Previously verified R1653–R1659 offline delivery/custody/video/reconciliation tests: **46/46 PASS**.
- **Combined Node test command: 71/71 PASS, 0 FAIL, exit 0**, across source-preserved CJS/ESM suites.

One end-to-end **simulated** test executed source-owned worker registration, task creation, claim, evidence submission, independent review and projection: `READY → NOT_DELIVERED`, `VERIFYING → PENDING_INDEPENDENT_REVIEW`, `ACCEPTED+PASS → VERIFIED_POINTER`. Another source-connected test revoked the reviewer's READ grant after acceptance and verified that the projector was **denied**, rather than reading previously cached approved evidence.

These are strong **source-level synthetic tests only**. Native Firebase emulator transaction/revocation, real provider-issued OIDC identity, authenticated two-host staging, live IAM, and source-to-hosted deployment/real user acceptance were **not** performed. Full `npm run typecheck`, full Admin tests/build and protected CI were **not** executed in this turn.

## Delivery boundaries and required independent gates

| Gate | Verified state |
| --- | --- |
| Converged mission source plus R1653–R1659 Founder Inbox files in one review tree | **PASS / source present** |
| Exact task + execution + verification receipt read with existing grant fence | **PASS / synthetic** |
| Source-connected task state progression into Founder Inbox pointer | **PASS / synthetic** |
| Revoked read capability denial | **PASS / synthetic** |
| Combined source/offline suite | **71/71 PASS** |
| Actual private archive and previously recovered 11 artifacts | **Preserved (R1650–R1659), not modified** |
| Native Firestore transactions with real identity | **OPEN** |
| Automated worker-completion event → original file ingestion/archive → verified custody record | **OPEN** |
| Founder notification, private approval write and audit trail | **OPEN** |
| Production merge, deployment, independent security certification, launch | **NOT AUTHORIZED / HOLD** |

The original [Founder Deliverables Inbox](https://chatgpt.com/space/page_eb96f03427bc8191b9b1ebb182f55ad1) remains a **read-only snapshot** with archive links, not a live authenticated feed. The existing six-hour Genesis watch is **enabled** but is not an automatic artifact uploader/dispatcher. This review branch MUST remain unmerged and must not be used to expand external permissions or trigger provider processing without separate authorization and independent acceptance.

**Evidence anchors:** Admin PR [#123](https://github.com/LifeLoggerAI/urai-admin/pull/123), PR [#124](https://github.com/LifeLoggerAI/urai-admin/pull/124), and private Labs [#487](https://github.com/LifeLoggerAI/urai-labs-llc/pull/487). No new mathematical discovery or new video render was claimed in R1660.
