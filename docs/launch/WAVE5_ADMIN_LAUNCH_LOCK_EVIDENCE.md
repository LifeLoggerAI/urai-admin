# Wave 5 URAI Admin Launch Lock Evidence

Domain: uraiadmin.com

Repo: LifeLoggerAI/urai-admin

Status: implementation evidence in progress

## Required role

URAI Admin is the private internal operator cockpit for authorized URAI system administration, lead review, content review, launch lock records, audit logs, user operations, privacy request support, and system settings.

## Required public surface

URAI Admin must not behave like a marketing site.

Before authentication, only a minimal access boundary should render:

- `/`
- `/login`

Approved pre-auth copy:

- `URAI Admin`
- `Authorized access only.`

## Required protected routes

- `/dashboard`
- `/users`
- `/leads`
- `/content`
- `/systems`
- `/audit`
- `/privacy-requests`
- `/launch-locks`
- `/settings`

## Required private boundary

The site must not expose:

- private user data
- private leads
- private content records
- private launch evidence
- audit records
- admin settings
- Firebase secrets
- API keys
- operational logs
- internal notes
- private user timeline or app data

## Required access behavior

- Global noindex/nofollow/noarchive metadata
- Login gate before private content
- No private data flash before auth checks complete
- Denied-access state
- Admin/ops/security role awareness
- Audit logging or audit plan for sensitive actions
- No public ecosystem footer inside portal interiors
- No secrets in client bundle

## Required shared foundation

- Shared portal shell or equivalent
- Metadata/no-index pattern
- Denied-access/loading states
- Audit badge/status pattern
- QA script for no-index, placeholder/debug text, and protected route checks

## Evidence still required before approval

- Confirm root/login show only authorized access gate
- Confirm global noindex/nofollow/noarchive
- Confirm protected routes are gated
- Confirm no private data renders before auth
- Confirm role/permission model is implemented or documented
- Confirm audit logging or audit plan for sensitive actions
- Confirm no secrets exist in client bundle
- Run build/typecheck/QA
- Confirm DNS and SSL for `uraiadmin.com`
- Record production deployment URL
- Record latest deploy commit
- Record owner approval

## Current launch decision

Do not mark approved until auth, no-index, private-data, role, audit, secret, DNS/SSL, build, and QA evidence are recorded.
