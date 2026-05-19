# URAI Admin Architecture

## Runtime and framework

URAI Admin is a pnpm workspace repository. The primary admin console is a Next.js 14 React/TypeScript app in `apps/urai-admin`. Firebase Hosting routes requests through the `nextServer` Firebase Function. Active Functions code is in `functions/src/index.ts`. Node 20 is the locked runtime for Firebase Functions.

## Product role

`urai-admin` is the official internal operations and Council control plane for the URAI system of systems. It is not a raw consumer-data browser. It coordinates operations, release evidence, system health, governance, analytics status, communications status, partner review, and audit trails.

## Route map

Public routes documented for production verification:

- `/`
- `/features`
- `/pricing`
- `/security`
- `/docs`
- `/contact`
- `/privacy`
- `/terms`
- `/login`

Protected console routes documented for production verification:

- `/admin`
- `/admin/users`
- `/admin/projects`
- `/admin/feature-flags`
- `/admin/jobs`
- `/admin/job-runs`
- `/admin/dead-letters`
- `/admin/system`
- `/admin/audit`
- `/admin/policies`
- `/admin/settings`

Requested system-of-systems aliases should map into these protected console sections or be added as explicit routes before production claim:

- dashboard -> `/admin`
- users/accounts -> `/admin/users`
- partners -> `/admin/projects` or future `/admin/partners`
- systems/system health -> `/admin/system`
- releases/release evidence -> `/admin/system` until a dedicated route exists
- governance -> `/admin/policies`
- communications -> `/admin/system` until a dedicated route exists
- analytics -> analytics workspace/app and `/admin/system` status card until a dedicated route exists

## Firebase services

- Firebase Hosting for the public/admin site.
- Firebase Functions for Next.js server rendering and trusted backend operations.
- Firebase Auth for sign-in and session-cookie based admin access.
- Firestore for admin records, audit logs, release evidence, registry data, jobs, feature flags, analytics aggregates, and operational status.
- Firebase Storage is configured through `storage.rules`; no production raw consumer-data storage surface is approved for this admin console.

## Authentication model

Users authenticate through Firebase Auth. Server-side session handling must verify Firebase ID tokens/session cookies before protected access. The first production owner is seeded with `pnpm bootstrap:owner` using `URAI_ADMIN_OWNER_UID` and `URAI_ADMIN_OWNER_EMAIL`.

## Authorization model

Admin authorization is enforced by both claims and Firestore records:

- Firebase custom claim `admin == true`.
- Firebase custom claim `role in ['owner', 'admin', 'viewer']`.
- Active Firestore allowlist document at `adminUsers/{uid}` with `isActive == true`.

Frontend route guards are convenience only. Firestore rules and backend handlers must enforce the same boundary.

## Firestore collections

Production-lock collections:

- `adminUsers`
- `adminAuditLogs`
- `adminSystemHealth`
- `adminReleaseEvidence`
- `adminNotifications`
- `adminSettings`
- `adminReviewQueue`
- `adminIntegrations`
- `adminOperationalEvents`
- `partnerAccounts`
- `systemRegistry`
- `releaseSignoffs`
- `governanceEvidence`

Existing operational collections:

- `roles`
- `auditLogs`
- `systemConfig`
- `projectRegistry`
- `jobs`
- `jobRuns`
- `deadLetters`
- `featureFlags`
- `analytics_events_raw_{date}`
- `analytics_aggregates`
- `analytics_job_runs/{jobId}/runs/{runId}`

## Storage usage

Storage is not approved as a raw telemetry surface for this admin app. Any future Storage use must be limited to admin-safe artifacts such as release screenshots, compliance documents, or operator-visible evidence, with access limited to active admin roles.

## Cloud Functions/API surfaces

The active Functions entrypoint is `functions/src/index.ts`. Backend operations must verify ID token/session cookie, role, admin allowlist status, and input schema before reading or mutating operational data.

## Local fallback behavior

Local/demo/mock data must be clearly labeled as local/demo/mock in UI and docs. No mock card may be presented as live production state.

## System-of-systems integration contracts

Each URAI subsystem should expose a status contract containing name, owner, environment, health URL, last release SHA, last smoke result, privacy classification, operational risk, blockers, and integration notes. `docs/SYSTEM_OF_SYSTEMS.md` is the canonical registry until Firestore registry seeding is verified.

## Data boundary

Allowed: operational metadata, release evidence, aggregate analytics status, communications status, partner/admin records, feature flags, jobs, dead letters, audit events, governance evidence.

Forbidden unless separately approved: raw passive telemetry, raw audio, private transcripts, raw location trails, consumer identity vectors, unreviewed mental-health inference records, and unredacted secrets.
