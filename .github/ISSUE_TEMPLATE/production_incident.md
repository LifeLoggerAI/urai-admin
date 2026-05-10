---
name: Production incident
description: Track a URAI Admin production incident or failed release
title: "Production incident: <short description>"
labels: ["incident", "production", "P0"]
assignees: []
---

## Incident summary

- Start time:
- Detection source:
- Severity:
- Affected surface:
  - [ ] Public site
  - [ ] Login
  - [ ] Admin console
  - [ ] Admin API
  - [ ] Firebase Functions
  - [ ] Firestore rules/data
  - [ ] Storage rules/data
  - [ ] DNS/SSL

## Symptoms

Describe what is broken and who is affected.

## Evidence

- Failing URL or command:
- `pnpm verify:production` output:
- GitHub Actions run URL:
- Commit SHA:
- Firebase Hosting release ID if available:
- Relevant Firebase log excerpts:

## Immediate response

- [ ] Stop additional deploys.
- [ ] Assign incident owner.
- [ ] Capture failing verifier output.
- [ ] Identify whether issue is app, functions, rules, DNS, SSL, Firebase config, or data.
- [ ] Decide rollback or forward-fix.

## Rollback / mitigation

Use `docs/ROLLBACK_AND_INCIDENTS.md`.

- [ ] Git revert required.
- [ ] Firebase Hosting rollback required.
- [ ] Functions-only rollback required.
- [ ] Firestore/Storage rules rollback required.
- [ ] DNS/SSL mitigation required.
- [ ] No rollback required; forward-fix chosen.

Rollback or fix details:

## Verification after recovery

- [ ] `pnpm verify:production` passes.
- [ ] Owner/admin login works.
- [ ] Logout works.
- [ ] Anonymous users cannot access protected routes/API.
- [ ] Functions health is ok.
- [ ] Audit logs are written.
- [ ] No high-severity Firebase errors remain.

## Root cause

Document the root cause.

## Follow-up prevention

- [ ] Prevention issue created.
- [ ] Tests/checks added or updated.
- [ ] Docs/runbooks updated if needed.

## Closure

- [ ] Incident resolved.
- [ ] Recovery verified.
- [ ] Follow-up work tracked.
