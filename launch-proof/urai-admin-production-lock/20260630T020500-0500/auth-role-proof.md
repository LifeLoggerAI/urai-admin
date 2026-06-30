# Auth and Role Proof

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: source-level inspection

## Source behavior

- `/admin/:path*` and `/api/admin/:path*` are matched by Next middleware.
- Missing `__session` cookie redirects admin pages to `/login` and returns API `401` for admin APIs.
- Existing session cookies are checked by `/api/auth/admin-session`.
- `requireAdminSession` verifies Firebase session cookies with revocation checking.
- `requireAdminSession` checks custom role claims and requires an active matching `adminUsers` Firestore record.
- Roles observed: owner, admin, viewer.

## Status

| Requirement | Status | Notes |
| --- | --- | --- |
| Firebase session verification | PARTIAL | Source helper exists; live proof required |
| Revoked session checks | PARTIAL | `verifySessionCookie(..., true)` used; live test required |
| Active admin checks | PARTIAL | Firestore active record checked; live test required |
| Owner role | PARTIAL | Owner-only route exists for role update; live test required |
| Admin role | PARTIAL | Admin can list users/change active state/flags; live test required |
| Viewer role | PARTIAL | Read-only intent exists; mutation denial must be tested |
| Custom claims sync | BLOCKED | Role update changes Firestore; claim synchronization proof not available |
| Unauthenticated denial | PARTIAL | Source middleware does it; smoke proof required |
| Unauthorized denial | PARTIAL | Source helper returns 403; smoke proof required |
| Inactive admin denial | PARTIAL | Source helper checks it; live proof required |
