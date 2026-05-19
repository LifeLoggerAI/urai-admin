# URAI Admin Security

## Security posture

URAI Admin is deny-by-default. Public pages may describe the product, but operational data belongs behind Firebase Auth, admin claims, and an active `adminUsers/{uid}` record.

## Authentication

- Firebase Auth is the identity provider.
- Server code must verify ID tokens/session cookies.
- Client checks are not security boundaries.

## Authorization

Admin access requires:

1. Signed-in Firebase user.
2. Custom claim `admin == true`.
3. Custom claim `role` of `owner`, `admin`, or `viewer` depending on route/action.
4. Active Firestore allowlist record at `adminUsers/{uid}`.

## Firestore rules

- Catch-all deny is required.
- Admin collections are read/write scoped by role.
- Audit and operational event records are immutable after creation.
- Raw analytics event reads are owner/admin only.
- Writes to sensitive collections should happen through trusted server code, not direct clients.

## Secrets

Never commit:

- Firebase deploy tokens
- Service account JSON
- Private keys
- API provider secrets
- GitHub tokens
- Communication-provider secrets

Use `.env.production.example` as a shape-only checklist.

## CORS and App Check

Backend endpoints must restrict CORS to approved URAI Admin origins. App Check should be enabled before production for browser-callable endpoints where feasible.

## Logging

Logs must redact:

- tokens
- cookies
- service account content
- private user data
- raw telemetry
- raw transcripts/audio references

## Dangerous operations

Dangerous operations require:

- explicit admin role
- confirmation UI
- audit log write
- rollback path where applicable

## Privacy boundary

URAI Admin may display operational metadata, aggregate status, release evidence, admin records, and governance evidence. It must not expose raw consumer passive telemetry or mental-health inference records without a documented privacy review.
