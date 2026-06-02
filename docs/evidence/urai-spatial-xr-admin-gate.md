# URAI Spatial XR Admin Evidence Gate

This file records admin/control-plane evidence required before `LifeLoggerAI/urai-spatial` or native XR clients may claim production AR/VR/XR readiness.

## Current status

- Dependency status: `required-before-production-xr`.
- Canonical consumer: `LifeLoggerAI/urai-spatial` and future native XR clients.
- Admin surfaces: release approval, feature flags, moderation, incident response, rollback, evidence review, provider enablement, entitlement overrides, and audit visibility.
- Production XR claim status: blocked until admin release controls, audit logs, moderation operations, feature flags, rollback, and incident evidence are recorded.

## Required XR admin evidence

| Gate | Required evidence | Result | Notes |
| --- | --- | --- | --- |
| Release approval | Manual approval record for Tier 1-5 + XR release packet | Not recorded | Required before production-live claim. |
| Feature flags | Flags to enable/disable WebXR, Quest, visionOS, handheld AR, providers, and fallback modes | Not recorded | Required before rollout. |
| Provider enablement | Admin approval/audit for provider-backed asset, body-signal, memory, and jobs integrations | Not recorded | Required before provider claims. |
| Moderation operations | Review queue and escalation evidence for UGC/provider outputs | Not recorded | Required before marketplace or UGC claims. |
| Incident response | Incident owner, escalation, rollback, and comms evidence | Not recorded | Required before launch. |
| Audit visibility | Admin audit trail for release approval, feature changes, provider enablement, and moderation actions | Not recorded | Required before production launch. |
| Entitlement controls | Paid/free/founder override evidence without client-side trust | Not recorded | Required before entitlement claims. |
| Evidence review | Admin checklist confirming no private identifiers/secrets in release artifacts | Not recorded | Required before public/shared evidence. |

## Integration contract for URAI Spatial

`urai-spatial` must keep admin/operations/provider rows as `Not recorded` or `Not validated` until this repo records:

1. Release approval evidence.
2. Feature-flag and rollback evidence.
3. Provider enablement and audit evidence.
4. Moderation operations evidence.
5. Incident response evidence.
6. Entitlement control evidence.
7. Evidence safety review.

## Release decision

Do not use this file to mark admin production complete by itself. It is a cross-repo XR dependency ledger. Authoritative admin readiness remains in this repo's CI, green-ship, runbook, release, and operational evidence files.
