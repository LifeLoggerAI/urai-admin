# R1656 — Offline Founder Custody Validation: Actual Archive Readback (HOLD)

**Date:** 2026-11-20 America/Chicago / November 21 UTC. **Scope:** review-only; no live connector/Firestore reader, no production deployment, no automatic future-job dispatch, no founder acknowledgement.

## Source lineage

Private source manifest: [Labs PR #487](https://github.com/LifeLoggerAI/urai-labs-llc/pull/487), commit `5eb6bffe2d42b7189887fbe27b214edbfbdebe5a`, `docs/benchmarks/r1650-recovered-worker-artifacts/R1656_FOUNDER_CUSTODY_MANIFEST.json` (9,488 bytes; blob `d524d6f1d5b2ac9898ea0ec568ab051130675b0d`). This private file includes founder archive and source URLs and remains **in the private Labs repository**, never copied into this public Admin repo.

Public **schema-validation source only**:
- `scripts/founder-custody-manifest.mjs`: validates the private manifest record shape, IDs, allowed URLs, claimed verification states, byte counts, SHA-256 fields, release HOLD and all human-review/acknowledgement boundaries. Emits a redacted metadata summary without private URLs or worker names.
- `scripts/founder-custody-manifest.test.mjs`: negative contract tests including forged claims, missing/duplicate records, secret-bearing URLs, encoded traversal, and stable deterministic output.
- Existing `scripts/founder-delivery-inbox.mjs` and CLI from R1653 are unchanged, and remain offline only. This manifest validator does **not** fetch, hash or re-verify file bytes; it validates the previously verified receipt claims and outputs summary metadata.

## Actual same-source replay (existing Runpod, no new machine)

On existing CPU Pod `u7efpw44681cza` (Node 22.23.5), the exact private 9,488-byte Labs JSON manifest was transferred only to a temporary worker local file. Ran the public `summarizeFounderCustody` function on that data.

**Actual output:** `itemCount: 11`, `videoCount: 8`, `totalBytes: 85794198`, deterministic `summarySha256: dfc4b5322c926f14963b782e14d5ab0c80a774a62c13070840bcf7cd7f473285`, `automaticallyDispatches: false`, `founderAck: 0`, all human review pending. These 11 original artifacts comprise 8 MP4 videos (84,535,488 bytes, separately hash-checked at source and private Notion archive in R1655), 1 finite Ramsey K9 DRAT certificate (217,736 bytes, R1651-R1652 bounded checker/source verification) and 2 original Spatial screenshot PNGs (216,735 and 824,239 bytes).

**Unit checks:** `node --test` with R1653 two suites plus new R1656 suite yielded **17/17 PASS** (0 fail, exit 0). R1656 unit suite itself **6/6 PASS**. This is *offline* verification with synthetic negative tests and one real private manifest validation, **not** authenticated Firestore end-to-end acceptance or a security assessment of the live service.

## What the stages mean

- **PRESERVED:** original source exists at a founder-accessible, permissioned archive location.
- **SOURCE_AND_ARCHIVE_SHA_MATCH:** original and archive bytes were independently streamed and hashed at the time of R1655; excludes content licensing/creative acceptance.
- **CHECKED_FINITE_PROOF:** bounded mathematical SAT/elementary proof checks were reproduced on existing workers, proving an already known finite Ramsey identity; excludes an unknown conjecture breakthrough or external academic certification.
- **PRESERVED_SOURCE_WITH_SHA256:** original screenshots copied into private GitHub and source checksum recorded; excludes AAA+++ visual/device acceptance.
- **REVIEWED / ACCEPTED:** **NOT YET**. No founder approval receipt exists. `finalDelivery:'NOT_ACKNOWLEDGED'` is explicit in every summary item.
- **AUTOMATIC:** **NOT YET**. No worker event subscription, private byte downloader, review approval controller, permanent task-backed database, automated archive upload, or notification/acknowledgment service was deployed.

This is a genuine runnable validator and reconciled custody ledger, not a substitute for the remaining authenticated/nonproduction security and delivery integration gates. Do not merge/deploy or broaden privileges without independent review. Genesis production **HOLD/NO-GO**; private-memory writes **OFF**.
