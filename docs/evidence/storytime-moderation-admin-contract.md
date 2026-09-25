# URAI Admin ↔ Storytime Moderation Contract

Evidence date: 2026-09-23

## Classification

**SOURCE CONTRACT PREBUILT / RUNTIME NOT CONNECTED / NO APPROVAL AUTHORITY / NO PRODUCTION CLAIM**

## Current source authorities

Admin parent candidate:

- repository: `LifeLoggerAI/urai-admin`
- parent PR: #75
- parent head at branch creation: `f02ba1bf183c1ab2a2a1af7fac4377bd816aa6b7`

Storytime moderation candidate:

- repository: `LifeLoggerAI/urai-storytime`
- PR: #53
- Storytime moderation head at contract creation: `4ef24d555b2d297dc74e8c16bb26a325aa347a17`

These SHAs are source references only. If either head changes, predecessor proof does not transfer.

## Storytime callable contract

The Storytime candidate defines trusted-server moderation operations:

- `listStorytimeModerationCases`
- `getStorytimeModerationCase`
- `transitionStorytimeModerationCase`

The current transition vocabulary is intentionally limited to:

- `escalate`
- `close_blocked`

The response boundary reports:

- `releaseAuthorized: false`
- `secureContentReviewAvailable: false`

There is no Storytime moderation `approve` or `release` operation in this contract.

## Data boundary

Storytime moderation cases are sanitized operational metadata.

The contract may expose:

- moderation case id;
- request id;
- input/output stage;
- state;
- reason codes;
- content SHA-256 fingerprint;
- whether raw story content is present;
- operational timestamps;
- last state transition metadata.

The generic URAI Admin console must not ingest or persist:

- raw prompts;
- raw story bodies;
- narrator text;
- family memories;
- voice/image/media source data;
- signed URLs;
- provider credentials;
- provider raw error bodies.

Storytime source rejects moderation cases that declare raw story content.

## Admin route

The prebuilt Admin surface is:

`/admin/storytime-moderation`

It is deliberately static/hard-off and shows:

- `Not connected`
- blocked release authority;
- raw content unavailable;
- exact callable/transition contract;
- activation prerequisites.

It performs no direct remote read or mutation.

## Prohibited integration

Do not connect Admin by:

- pointing the generic Admin Firestore reader at the Storytime project;
- sharing Storytime client Firebase configuration as privileged authority;
- storing a long-lived Storytime service-account key in Admin;
- copying raw moderation content into `adminReviewQueue`;
- allowing direct client mutation of Storytime moderation state;
- creating an Admin-side approve/release action that Storytime does not authorize;
- treating a source route as deployed-runtime evidence.

## Required runtime integration pattern

Before connection, establish a reviewed cross-project invocation identity.

Required properties:

1. Storytime runs in a verified isolated Firebase/GCP authority.
2. Admin runs from its protected deployed authority.
3. Admin-to-Storytime calls use short-lived, least-privilege service identity.
4. Only the exact moderation callables are invocable.
5. Non-admin/non-Admin-service identities receive negative authorization proof.
6. Storytime remains the moderation state authority.
7. Admin displays sanitized returned data rather than direct database records.
8. Storytime server writes the moderation transition/audit receipt.
9. Admin retains its own operator/request correlation evidence without raw story content.
10. Revocation/incident/rollback behavior is tested.

## Secure content review

The current sanitized Storytime queue is insufficient for human approval.

A future secure review channel must separately prove:

- minimum-necessary raw content retrieval;
- time-limited reviewer access;
- stronger role/claim than generic viewer access;
- reviewer access logging;
- content-retention/deletion rules;
- policy version and reason;
- escalation/severe-risk handling;
- child/family privacy controls;
- legal/privacy approval.

Until then, Admin may only escalate or close-as-blocked.

## Required activation evidence

- merged exact Storytime moderation SHA;
- exact Storytime deployed revision and project identity;
- merged exact Admin adapter SHA;
- exact Admin deployed revision;
- WIF/workload identity or equivalent short-lived trust evidence;
- least-privilege IAM;
- negative authorization proof;
- sanitized case list/read staging receipts;
- transition/audit receipt staging proof;
- monitoring and incident owner;
- retention/deletion behavior;
- rollback/revocation proof;
- independent review for both exact candidates;
- child-safety/privacy/legal approval appropriate to enabled operations.

## Stop rule

Until every applicable activation gate above is evidenced, `/admin/storytime-moderation` remains **Not connected**, performs no Storytime remote operation, and grants no content release authority.
