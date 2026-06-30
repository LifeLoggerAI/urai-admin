# Security and Privacy Audit

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: source-level inspection and source update

## Source-level status

| Control | Status | Notes |
| --- | --- | --- |
| Route protection | PARTIAL | Middleware protects `/admin/*` and `/api/admin/*`; live proof required |
| Server-side checks | PARTIAL | Protected APIs call `requireAdminSession`; route inventory must remain enforced |
| Client-only checks | PASS SOURCE | No privileged API relies only on client checks in inspected routes |
| Exposed secrets | PARTIAL | No secret proof scan run; public repo must still be reviewed |
| Firestore rules | PARTIAL | Deny-by-default source rules exist; emulator proof missing |
| Storage rules | PARTIAL | Deny-all source rules exist; deploy proof missing |
| Audit logs | PARTIAL | Sensitive writes and admin user list write audit entries; generic reads need review |
| Sensitive redaction | PARTIAL | Generic reader redacts sensitive-key patterns |
| Privacy request minimization | PARTIAL | Generic reader now returns only limited request metadata |
| Public repo visibility | BLOCKED | Needs owner/security approval before launch |
| Env docs | PARTIAL | Docs exist, but secrets/env not verified |
| CSRF/session semantics | BLOCKED | Needs browser/runtime security review |
| Rate limiting | BLOCKED | Not verified in this source pass |
| CORS/header policies | BLOCKED | Not verified in this source pass |

## Privacy notes

The generic reader now limits `privacyRequests` output to request metadata fields only. Raw payloads, identity details, transcripts, tokens, secrets, or private operational payloads must not be exposed through the generic admin collection reader.
