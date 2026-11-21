# R1653 — Founder Delivery Inbox, offline review candidate (HOLD)

This review-only source adds a fail-closed **read-only projection** over the established Admin institutional mission coordination receipt shape.

**What is implemented:** `scripts/founder-delivery-inbox.mjs`, `scripts/founder-delivery-inbox.test.mjs`, `scripts/export-founder-delivery-inbox.mjs`, and the CLI's test file.

**What is not implemented:** an authenticated live Firestore reader, recurring scheduler, provider downloader, automatic notifications, worker-to-worker dispatch, direct Google Drive/YouTube/LinkedIn publication, artifact byte verification, user acknowledgement, or release authorization. Running Pods are **not** counted as completed work. Existing Admin mission control is a separate draft control plane (not currently a certified multi-host service). This PR does **not** enable it.

## How the projectors classify work

| State observed | Inbox status | Significance |
| --- | --- | --- |
| READY/CLAIMED | NOT_DELIVERED | The worker may be idle, running or unverified |
| VERIFYING + congruent execution receipt | PENDING_INDEPENDENT_REVIEW | Source, worker, digest and pointer agree, but no reviewer approval |
| ACCEPTED + matching exact-source execution + distinct reviewer PASS receipt | VERIFIED_POINTER | An approved evidence **pointer**, **not** proof bytes downloaded or founder accepted |
| BLOCKED | BLOCKED | Never promotable with stale receipts |
| Forged/mismatched execution or verification | EVIDENCE_INVALID / VERIFICATION_INVALID | Fail-closed projection |

A `VERIFIED_POINTER` has `artifactBytesVerified:false` and `founderAcknowledged:false`. The projection refuses auth-bearing URL queries, off-allowlist hosts, encoded traversal, mismatched source revisions, stale or conflicting receipts, duplicate task identifiers and oversized inputs.

## Offline usage

An existing, separately authorized system must export a trusted JSON **array** of `{task,execution,verification}` snapshots from the institutional mission collections, including task subcollection execution and verification receipts. The script never queries Firestore itself and **must not** be fed secrets, private customer content, or arbitrary untrusted documents.

```sh
node scripts/export-founder-delivery-inbox.mjs /path/to/authorized-review-snapshot.json
node --test scripts/founder-delivery-inbox.test.mjs scripts/export-founder-delivery-inbox.test.mjs
```

The CLI prints deterministic metadata-only JSON to stdout; it does not save results elsewhere or contact external services. File size limit 1 MiB, maximum 500 rows. Exact source SHA and evidence SHA-256 are required. The source assumes the Admin draft's task/receipt metadata and is not yet integrated into running production services.

## Verification

On November 20/21 2026, copied the exact GitHub source files to **existing Runpod CPU Pod `u7efpw44681cza`** (Node 22.23.5), ran both files with Node's built-in test runner: **11 tests passed, 0 failed**. The first run had one failed encoded-dot traversal case (`%2e%2e`); source was fixed to reject dangerous raw URL spellings **before URL normalization**, then retested 8/8 and expanded to 11/11 after adding CLI tests. This is **offline unit evidence only**; not real Firestore, not auth integration, not a hosted UI.

## Next operational gate

Integrate only after independently authorized Admin RBAC/IAM and server-owned transaction revocation fences are tested on separate hosts in disposable nonproduction Firestore. Then derive a read-only delivery feed from persisted receipts, perform origin file fetch/hash verification in a separate privacy-preserving service, and require founder acknowledgement before calling anything DELIVERED. Any scheduled monitoring, provider writes, external sharing or automatic dispatch requires explicit approval. Private-memory writes remain OFF, production HOLD/NO-GO.

The current manual founder evidence collection is [Worker Deliverables Inbox](https://chatgpt.com/space/page_eb96f03427bc8191b9b1ebb182f55ad1); [R1650–R1652 math/visual source custody](https://github.com/LifeLoggerAI/urai-labs-llc/pull/487) is separate and **does not automatically appear in this prototype** because it is not an authenticated institutional mission task/receipt record.
