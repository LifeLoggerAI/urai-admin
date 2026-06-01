# URAI Genesis Admin Contract

Last updated: 2026-06-01

## Purpose

This repository owns internal operational visibility for URAI Genesis. Admin tooling must support safety, uptime, user data rights, and deployment health without weakening user ownership or Passport controls.

## Genesis data tree

The main app writes Genesis data under:

```txt
uraiGenesis/{userId}/state/consent
uraiGenesis/{userId}/state/passport
uraiGenesis/{userId}/state/moodWeather
uraiGenesis/{userId}/signals/{signalId}
uraiGenesis/{userId}/reflections/{reflectionId}
uraiGenesis/{userId}/memoryStars/{starId}
```

## Admin launch scope

Admin should support these Genesis launch views:

```txt
[ ] Deployment health
[ ] Firebase write health
[ ] Signal pipeline health
[ ] Failed job/run health
[ ] Consent and Passport integrity checks
[ ] Data export request queue
[ ] Account deletion request queue
[ ] Sound/asset availability status
```

## Admin boundaries

Admin must not become a hidden user-data bypass.

- Raw user content should be hidden by default.
- Admin access should be role-gated and logged.
- Sensitive data reads should create audit logs.
- Admin should not change user Passport share mode without explicit user request workflow.
- Admin should not expose unconsented categories.

## Minimum operational collections

```txt
adminAuditLogs/{id}
incidents/{id}
jobRuns/{id}
jobFailures/{id}
dataExportRequests/{id}
accountDeletionRequests/{id}
assetLifecycleEvents/{id}
```

## Readiness checklist

```txt
[ ] Admin role checks are enforced.
[ ] Sensitive reads are audited.
[ ] Data export/deletion queues are visible.
[ ] Genesis pipeline health is visible.
[ ] No raw private content is shown by default.
[ ] Staging and production environments are visually distinct.
```
