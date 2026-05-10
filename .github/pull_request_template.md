## Summary

Describe the change and why it is needed.

## Change type

- [ ] Product/UI
- [ ] Admin console
- [ ] Auth/session
- [ ] API/Functions
- [ ] Firestore/Storage rules
- [ ] CI/CD or deployment
- [ ] Docs/runbooks
- [ ] Security
- [ ] Other

## Validation

Run and check all that apply:

- [ ] `pnpm preflight:production`
- [ ] `pnpm security:gate`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm verify:production` after deploy, if production-impacting

## Production impact

- [ ] No production impact
- [ ] Requires Firebase deploy
- [ ] Requires Functions deploy
- [ ] Requires Firestore/Storage rules deploy
- [ ] Requires GitHub secret or env var change
- [ ] Requires DNS/Firebase Hosting change
- [ ] Requires owner/admin bootstrap or data migration

## Security checklist

- [ ] No secrets committed
- [ ] No permissive `allow ... if true` rules added
- [ ] Protected routes remain protected
- [ ] Anonymous API access remains blocked
- [ ] Admin role/active checks remain intact
- [ ] Audit logging impact considered

## Rollback plan

Describe how to roll back this change. Reference `docs/ROLLBACK_AND_INCIDENTS.md` if production-impacting.

## Screenshots / evidence

Add screenshots, logs, or command output where useful.

## Related issues

Link release, incident, or launch blocker issues.
