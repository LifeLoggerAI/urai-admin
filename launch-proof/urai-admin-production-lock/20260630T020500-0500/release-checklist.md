# Release Checklist

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: release checklist

| Gate | Status |
| --- | --- |
| Repo and branch confirmed | PARTIAL |
| Prior proof report exists | PARTIAL |
| Sensitive action confirmations added | PARTIAL |
| Privacy metadata minimization added | PARTIAL |
| Dashboard overclaiming reduced | PARTIAL |
| `pnpm install` | BLOCKED |
| `pnpm check:types` | BLOCKED |
| `pnpm lint` | BLOCKED |
| `pnpm test:unit` | BLOCKED |
| `pnpm test:rules` | BLOCKED |
| `pnpm test:e2e` | BLOCKED |
| `pnpm test:smoke` | BLOCKED |
| `pnpm build` | BLOCKED |
| `pnpm verify:release` | BLOCKED |
| `pnpm release:lock` | BLOCKED |
| Firebase env verified | BLOCKED |
| Owner seed verified | BLOCKED |
| Custom claims verified | BLOCKED |
| Staging deploy verified | BLOCKED |
| Production deploy verified | BLOCKED |
| DNS/SSL verified | BLOCKED |
| Monitoring verified | BLOCKED |
| Rollback verified | BLOCKED |
| Owner approval recorded | BLOCKED |

Final readiness cannot be marked READY until every BLOCKED gate is resolved with evidence.
