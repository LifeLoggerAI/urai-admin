# R853 — All 91 Admin branches: exact-candidate commit ancestry

**Recorded:** 2026-11-07 UTC. **Candidate:** `8313188532aef304a3b55771c5080f87e4ac71eb` (draft [Admin PR #85](https://github.com/LifeLoggerAI/urai-admin/pull/85)). Exact results in [91-branch machine-readable comparison](BRANCH_COMPARISONS_20261107.json). All **91/91** listed branch tips received successful GitHub commit comparisons; results: **58 diverged**, **31 behind/ancestors**, **2 identical**. This is a real, complete **branch-tip ancestry comparison for the currently listed 91 refs**, not a historical-commit/byte/semantic certification.

## High-priority divergent heads to reconcile at patch and current-tree content level

| Historical line | Ahead / behind candidate | GitHub returned paths | Disposition |
| --- | ---: | ---: | --- |
| `reconcile/admin-session-security-into-45-20260714` | 140 / 156 | 54 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `feature/global-emotional-weather-ops-20261002` | 138 / 59 | 115 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `fix/analytics-fixture-truth-20260914` | 126 / 60 | 113 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `fix/phase-1-launch-blockers` | 119 / 459 | 262 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `canon/upstream-authority-20260924` | 105 / 60 | 300 (possible API 300 cap) | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `integration/storytime-moderation-contract-20260923` | 64 / 60 | 76 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `hardening/admin-stacked-ci-evidence-20260914` | 30 / 60 | 43 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `hardening/admin-stacked-pr-verification-20260914` | 30 / 60 | 43 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `fix/public-estate-red-team-20261005-v2` | 29 / 55 | 29 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `fix/public-estate-red-team-20261005` | 29 / 58 | 29 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `converge/admin-terminal-control-plane-noindex-20260914` | 28 / 60 | 42 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `design/web-universe-admin-gate-v1-20260913` | 26 / 60 | 42 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `security/p0-admin-session-coherence-20260706` | 24 / 156 | 14 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `runtime/admin-node22-20260913-v2` | 21 / 60 | 38 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `runtime/admin-node22-20260913` | 20 / 60 | 37 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `security/wif-deploy-auth-2026-08-11` | 19 / 155 | 15 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |
| `control/admin-integrated-runtime-successor-20260913` | 17 / 60 | 35 | Compare unique patch, module imports, runtime ownership, original test evidence; preserve unless actual duplication/supersession proven |

## Important source-specific conclusions

1. `canon/upstream-authority-20260924` is 105 ahead/60 behind, but its tip's actual Git tree contains just **one Markdown file**. The document requires Labs PR #102 to merge first; that PR is **closed without merge**. Therefore the proposed canon does **not** supersede current release authority. Its compare file list reached **300 entries** and may be capped. An ahead count cannot be interpreted as 105 features.
2. `docs/genesis-estate-handoff-20261106` is a separate review lane. At R852 parent, 2 ahead/47 behind; this docs branch does not contain the 47 engineering commits, and engineering does not contain its knowledge-pack content. Keep separate.
3. Both `repair/admin-security-privacy-20261007` and `repair/admin-terminal-delivery-retry-20261010` point to the exact same engineering SHA (2 identical refs); do not double-count two independent implementations.
4. Thirty-one branches are ancestors (behind) of the candidate, eliminating a class of *ancestry*-level donor conflict. That is not a claim that no prior artifact, binary, test receipt, removed code or side branch has been missed.
5. The biggest future semantic queues are `reconcile/admin-session-security-into-45-20260714`, `feature/global-emotional-weather-ops-20261002`, `fix/analytics-fixture-truth-20260914`, `fix/phase-1-launch-blockers` and `integration/storytime-moderation-contract-20260923`. These are **not automatically source donors**; diff/ancestry must be evaluated alongside current active modules.
6. The GitHub connector returned comparisons successfully but local container DNS cannot resolve github.com (`git ls-remote` failed with “Could not resolve host: github.com”). Consequently a local full Git mirror + raw-byte SHA-256 + unreachable-object audit could not be performed this pass.

## Coverage and next evidence

- **Complete for current scope:** 91 listed exact branch tips, 91 successful compare endpoint results and their status/ahead/behind/merge base, returned changed-file counts and selected paths.
- **Incomplete:** unique reachable commit graph, 58 semantic divergence dispositions, full 2024–present source files and binary history, GitHub capped compare lists, raw byte SHA-256, independent security/provider checks, current device/production authentication.
- **Next steps:** retrieve eligible full clone into authorized network-capable read-only runner; enumerate all unique objects/refs/LFS, dedup Git blobs by SHA and verify raw bytes; prioritize the five historical lines above with actual code/contract comparisons. Preserve existing Admin #85 and master #262 ownership; no force merge.

**Release decision: PRODUCTION HOLD.** This is historic-source continuity proof, not live release authority.
