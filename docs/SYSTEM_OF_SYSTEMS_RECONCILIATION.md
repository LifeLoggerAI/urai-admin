# URAI System-of-Systems Reconciliation

Status: partial reconciliation complete  
Scope: production Firebase project `urai-4dc1d`, `urai-admin` launch branch, connected URAI repositories, and live deployment evidence.

## Executive status

`urai-admin` is live, smoke-tested, and production-verified. It should be treated as the operational admin surface for its current deployment scope, not as sole owner of every live Firebase function, Firestore index, or product runtime in `urai-4dc1d`.

The production launch surfaced shared resources owned by other URAI/LifeLogger systems. Those resources must be preserved, not deleted by `urai-admin` deploys.

## Verified production state

- Hosting URL: `https://urai-admin.web.app`
- Firebase project: `urai-4dc1d`
- Updated functions from `urai-admin` launch:
  - `aggregateAnalytics`
  - `api_health`
  - `admin_whoami`
  - `nextServer`
- Smoke tests passed:
  - homepage returns 200
  - protected admin route returns 200/redirect-safe response
  - anonymous admin API request returns 401
  - functions health returns 200
  - functions auth blocks anonymous calls
- Production live verification passed.

## Ownership map

| Surface | Live artifact / flow | Owning repo | Evidence | Deploy path | Test / verification path | Status |
|---|---|---|---|---|---|---|
| Admin web app | Firebase Hosting site `urai-admin` / `https://urai-admin.web.app` | `LifeLoggerAI/urai-admin` | Launch log and repo scripts | `pnpm deploy:production` -> `pnpm launch:production` -> Firebase deploy | `pnpm smoke-test`, `pnpm verify:production` | Live and verified |
| Admin Next server | `nextServer(us-central1)` | `LifeLoggerAI/urai-admin` | Functions source and Firebase hosting rewrite | Root build packages Next app into Functions, then Firebase deploy | Functions contract test, smoke test homepage/admin route | Live and verified |
| Admin health | `api_health(us-central1)` | `LifeLoggerAI/urai-admin` | Functions source / launch log | Firebase Functions deploy from admin repo | Smoke + production verifier | Live and verified |
| Admin auth whoami | `admin_whoami(us-central1)` | `LifeLoggerAI/urai-admin` | Functions source / launch log | Firebase Functions deploy from admin repo | Smoke + production verifier confirms anonymous access blocked | Live and verified |
| Admin analytics aggregation | `aggregateAnalytics(us-central1)` | `LifeLoggerAI/urai-admin` | Functions source / launch log | Firebase Functions deploy from admin repo | Functions contract test; production deploy updated function | Live, needs scheduled-job output monitoring |
| Admin collection API | `/api/admin/collection` | `LifeLoggerAI/urai-admin` | App route source | Next/Firebase Hosting via `nextServer` | Route contract + production auth-block tests | Hardened on launch branch |
| Privacy request admin surface | `privacyRequests` collection via admin collection API | `LifeLoggerAI/urai-admin` with data-process ownership likely `urai-privacy` | Admin API allow-list and table contract | `urai-admin` deploy for read/admin surface | Route contract + typecheck | Admin read surface integrated; source-of-truth workflow owner still needs confirmation |
| Firestore admin rules | `firestore.rules` from admin deploy | `LifeLoggerAI/urai-admin` for admin rules in this deploy | Production preflight and deploy log | Firebase deploy includes `firestore` | Rules contract + Firebase rules compile | Deployed |
| Asset factory health | `assetFactoryHealth(us-central1)` | `LifeLoggerAI/asset-factory` | Asset Factory function source | Asset Factory deploy path, not admin deploy | Asset Factory production verification report / health endpoint | Shared live function; preserve during admin deploy |
| Asset request lifecycle | `createAssetRequest`, `getAssetStatus` | `LifeLoggerAI/asset-factory` | Asset Factory source and OpenAPI docs | Asset Factory deploy path | Asset Factory tests + API health/status checks | Shared live function; preserve during admin deploy |
| Life-map pipeline | `ingestLifeMapEvent`, `processLifeMapEvent` | `LifeLoggerAI/asset-factory` | Life-map pipeline function source | Asset Factory deploy path | Pipeline tests and event-processing verification | Shared live function; preserve during admin deploy |
| Bloom generation | `buildBloom`, `transcribeBloomAudio` | `LifeLoggerAI/UrAiProd` | UrAiProd functions index exports | UrAiProd Functions deploy path | UrAiProd function tests / health | Shared live functions; preserve during admin deploy |
| XR / spatial functions | `createXrSession`, `logXrEvent`, `resolveAnchor` | `LifeLoggerAI/UrAiProd` / spatial runtime | UrAiProd XR function source | UrAiProd Functions deploy path | Callable auth/session tests + XR client checks | Shared live functions; preserve during admin deploy |
| Passive intelligence | `generateDailyPassiveIntelligence`, `runPassiveIntelligenceNow` | `LifeLoggerAI/UrAiProd` | UrAiProd functions index exports and passive-intelligence source | UrAiProd Functions deploy path | Scheduled/manual run verification and output collections | Shared live functions; preserve during admin deploy |
| Core user indexes | `forecast`, `insights`, `narratorLogs`, `obscuraPatterns`, `recoveryEvents`, `shadowCognition`, etc. | `LifeLoggerAI/UrAi` | `UrAi/firestore.indexes.json` | UrAi deploy path | Firestore index drift check | Shared production indexes; do not delete from admin deploy |
| Chrono/life timeline indexes | `chronoMirrorSnapshots`, `chrono_validation_events`, `timelineEvents`, `memoryBlooms`, `moodForecasts`, `weeklyReflections`, etc. | `LifeLoggerAI/UrAi` | `UrAi/firestore.indexes.json` | UrAi deploy path | Firestore index drift check | Shared production indexes; do not delete from admin deploy |
| Relationship/passive signal indexes | `passiveSignals`, `relationshipSignals`, `ancientSignals` variants | `LifeLoggerAI/UrAi` | `UrAi/firestore.indexes.json` | UrAi deploy path | Firestore index drift check | Shared production indexes; do not delete from admin deploy |

## Live deploy prompts and operator choices

During the `urai-admin` deploy, Firebase detected indexes and functions present in the production project but absent from the admin repo. The correct operator choice was `No` for deletion prompts because those artifacts map to other owning repos.

Required policy going forward:

1. Admin deploys must not delete shared Firestore indexes.
2. Admin deploys must not delete functions owned by `UrAiProd`, `asset-factory`, `urai-spatial`, or other systems.
3. Repos that own shared functions/indexes must keep their deploy manifests authoritative.
4. A release manager should reconcile Firebase project drift before any destructive deploy.

## Known risks / incomplete reconciliation

1. Function ownership is inferred from accessible source search. Some live functions may be deployed from historical commits or repos not visible in this connector session.
2. Firestore collections were mapped primarily through index definitions and function code, not through a full production collection export.
3. `privacyRequests` admin surface is integrated in `urai-admin`, but the full privacy workflow owner should be confirmed against `urai-privacy` or privacy operations docs.
4. Node.js 20 is deprecated and must be upgraded before Firebase blocks deployment.
5. `firebase-functions` is outdated and should be upgraded in controlled branches per owning repo because breaking changes are expected.
6. Build image cleanup warning should be handled in Google Cloud Artifact Registry/GCR.

## Recommended next automation

Create a non-destructive reconciliation command that:

1. Lists Firebase functions in `urai-4dc1d`.
2. Lists Firestore indexes in `urai-4dc1d`.
3. Compares them against this ownership manifest.
4. Fails if a deploy would delete resources outside the current repo ownership boundary.
5. Emits a release-manager approval checklist before any destructive Firebase prompt.

## Completion criteria for true system-of-systems certification

The whole system can be called fully integrated only when every live function, index, collection, route, job, flow, and admin surface has:

- one owning repo
- one deploy path
- one rollback path
- one test or verification command
- one production health or smoke check
- documented destructive-deploy policy
- current runtime support status
- confirmed operator / team owner

Until then, `urai-admin` is production live and verified, while the broader system-of-systems is reconciled but not fully certified.
