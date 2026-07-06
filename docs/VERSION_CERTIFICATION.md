# URAI Version Certification Matrix

Status date: 2026-07-06  
Authoritative asset-version source: `LifeLoggerAI/asset-factory/image_asset_generator/canonical_version_catalog.json`  
Target runtime repository: `LifeLoggerAI/urai-spatial`

This document resolves version-name ambiguity. It certifies repository definitions only; it does not certify provider generation, runtime wiring, deployment, XR device validation, or production release unless those receipts are explicitly listed.

## Canonical V1–V5 contract

| Version | Canonical label | Exact expected outputs | Canonical prefix | Spatial wiring required | Contract status | Provider/runtime certification |
|---|---|---:|---|---:|---|---|
| V1 | Genesis Public Route World | 53 | `assets/urai/` | No | VERIFIED IN REPOSITORY | PARTIALLY IMPLEMENTED; no complete current provider/runtime receipt indexed here |
| V2 | Living System States | 80 | `assets/urai/v2/` | Yes | VERIFIED IN REPOSITORY | BLOCKED; latest provider forge failed at `billing_hard_limit_reached`, with no successful forge round or rendered-asset certification |
| V3 | Relationship, Shadow and Pattern World | 14 | `assets/urai/v3/` | Yes | VERIFIED IN REPOSITORY | BLOCKED; exact 14-output provider handoff receipt is required |
| V4 | WebXR, AR and VR Pathway | 39 | `assets/urai/xr/` | Yes | VERIFIED IN REPOSITORY | BLOCKED; exact 39-output provider handoff plus physical-device validation is required |
| V5 | Mirror of Becoming and Autonomous Legacy | 27 | `assets/urai/v5/` | Yes | VERIFIED IN REPOSITORY | BLOCKED; provider lane remains behind version-contract and cost-control gates |

## Critical correction

The current canonical contract defines:

- **V3 = 14 relationship/shadow/pattern assets**;
- **V4 = 39 WebXR/AR/VR assets**.

Any older document or conversation that describes V3 as the 39-asset XR release is obsolete. No paid forge may run from a path that retains the conflicting mapping.

## Current asset evidence

### Prompt registry

`asset-factory/image_asset_generator/manifest.json` currently contains 47 prompted entries covering public-route worlds, workforce avatars, orb states, status, privacy, location, and social images. `status: prompted` is a prompt-plan state, not a provider completion receipt.

### Provider receipt requirements

Issue `LifeLoggerAI/asset-factory#138` requires:

- V2: exact 80 expected outputs, passed receipt, forge exit 0, 80 quality-passed assets, handoff missing 0, and a provider-scored promotion PR;
- V3: exact 14 provider outputs and no fallback receipt used as certification;
- V4: exact 39 provider outputs and no fallback receipt used as certification.

Issue `LifeLoggerAI/asset-factory#134` records that the latest V2 provider forge hit `billing_hard_limit_reached` before a successful forge round. It requires a one-asset smoke mode, maximum call/spend controls, immediate partial persistence, missing-only resume, and partial artifact upload before another paid run.

Issue `LifeLoggerAI/asset-factory#140` records an executable version-contract split: the canonical catalog has the matrix above, while legacy builders/entry points can still produce conflicting V3/V4 meanings. Provider mode must remain blocked until every executable entry point produces identical labels, counts, prefixes, hashes, and target repository values.

## Honest version status

### Current production release

**Not certified by version number in this document.** The exact deployed `urai-spatial` SHA, promoted asset manifest hashes, provider receipts, public-domain checks, monitoring, and rollback receipt must be reconciled first.

### Next shippable release

A no-new-spend release can only include assets already present, validated, licensed/provenanced, wired, and visually verified. It must not claim V2/V3/V4/V5 provider certification without the exact receipts above.

### V10, V50, V100, V150, V200

No authoritative repository contract was found for these labels during this execution. They are therefore **ROADMAP capability milestones**, not completed releases. Before implementation each must define:

- purpose and included systems;
- exact feature and asset manifests;
- migrations and dependencies;
- acceptance tests and release gates;
- provider/cost exposure;
- deployment and rollback model;
- evidence required for certification.

## Release certification rule

A version may move to **VERIFIED LIVE** only when its evidence bundle contains:

1. canonical contract and manifest hashes;
2. exact attempted/succeeded/failed asset counts;
3. provider/model/request IDs and evidenced cost when provider-backed;
4. output checksums, dimensions, derivatives, mobile crops, accessibility metadata, and provenance;
5. spatial handoff with no unexplained missing files;
6. runtime wiring diff and visual-regression proof;
7. exact tested/deployed spatial SHA;
8. public-domain route and deep-link checks;
9. performance/accessibility/device checks applicable to the version;
10. monitoring and rollback receipt.

## Paid-provider gate

No paid provider generation is authorized by this document. The next permissible action is a no-cost dry-run that proves the canonical contract, exact cost-exposure plan, call/spend cap, missing-only resume behavior, and artifact persistence. Actual provider execution requires explicit payment authority.
