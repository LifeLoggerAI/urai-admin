# URAI Institutional Control Plane Contract

Status: source contract only. This module does **not** grant production authority and does not replace provider, legal, financial, privacy, or reviewer sources of truth.

## Purpose

`scripts/institutional-control-plane-contract.mjs` defines the smallest machine-readable institutional contract needed to connect URAI's existing guarded Admin registry to later policy, workflow, evidence, and steward surfaces without creating another service.

It provides:

- stable opaque canonical identifier validation;
- an authorization request/decision contract with `PERMIT`, `DENY`, and `REQUIRES_APPROVAL`;
- a fail-closed execution guard so a model prompt cannot become an authorization boundary;
- a first-class Decision lifecycle where approval is not completion;
- a CloudEvents 1.0-compatible institutional event envelope;
- duplicate-delivery/idempotency handling, retry/dead-letter classification, and explicit replay classes;
- a versioned evidence-receipt contract;
- a narrow-to-broad kill-switch hierarchy with separately authorized restoration.

## Decision closure invariant

A material Decision can reach `CLOSED` only through:

`REQUESTED -> AUTHORIZED -> EXECUTED -> POSTCONDITION_VERIFIED -> RECEIPT_PERSISTED -> CLOSED`

`DENIED`, `SUPERSEDED`, and `EXPIRED` are terminal. Separation-of-duties can require the executor to differ from approvers.

## Authorization boundary

The contract is intentionally policy-engine neutral. A proven policy engine can implement the decision adapter later. Until then, the contract validates inputs/results and fails closed; it does not invent a custom policy language.

An effectful action is executable only when its matching authorization result is `PERMIT`, the request has not expired, and the request itself did not require approval. `DENY` and `REQUIRES_APPROVAL` are non-executable results.

The institutional operating ceiling remains L3 unless a separately evidenced domain decision explicitly authorizes a higher level. Merely representing L4/L5 values in the schema does not grant them.

## Event boundary

The institutional envelope keeps domain, audit/security, workflow, evidence, telemetry, and analytics events distinct. Each event carries source, actor, affected entity, correlation, sensitivity, retention class, evidence references, idempotency key, and replay classification.

`NO_REPLAY` events cannot be replayed. `COMPENSATED_REPLAY` requires a verified compensation boundary. Duplicate event IDs or idempotency keys are rejected as duplicate delivery.

## Evidence boundary

High-risk operations may require durable evidence. `assertRequiredEvidencePersisted` fails closed when mandatory evidence cannot be persisted. The receipt schema records implementation, test, authorization, observability, recovery, documentation, provider/artifact references, limitations, and production-acceptance state.

## Kill switches

Containment is ordered:

`NORMAL -> TASK_CANCEL -> AGENT_DISABLE -> CAPABILITY_DISABLE -> CREDENTIAL_REVOKE -> TOOL_PROVIDER_DISABLE -> ENVIRONMENT_WRITE_FREEZE -> FINANCIAL_SPENDING_FREEZE -> OUTBOUND_COMMUNICATION_FREEZE -> DEPLOYMENT_FREEZE -> INSTITUTIONAL_EMERGENCY_MODE`

Escalation requires authority. Restoration to a less restrictive state requires separate explicit restoration authority. Environment write freeze and broader states deny writes through the contract helper.

## Verification

Run:

```bash
pnpm test:institutional-control-plane
```

The contract test exercises permit/deny/approval paths, expiry, quorum, separation of duties, Decision closure, duplicate delivery, invalid schema version, safe retry/dead letter, replay prohibition, mandatory evidence persistence, kill switch activation, and authorized restoration.

## Production acceptance

Source/test completion is not production acceptance. Merge, deployment, provider binding, durable storage integration, policy-engine integration, runtime observability, recovery testing, and any required independent approval remain separate evidence gates.
