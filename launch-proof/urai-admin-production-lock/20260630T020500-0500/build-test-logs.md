# Build and Test Logs

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: blocked command ledger

| Command | Result | Summary |
| --- | --- | --- |
| `pnpm install` | BLOCKED | Needs local/CI checkout and package network access |
| `pnpm preflight:production` | BLOCKED | Needs local/CI runner |
| `pnpm security:gate` | BLOCKED | Needs local/CI runner |
| `pnpm check:types` | BLOCKED | Needs install first |
| `pnpm lint` | BLOCKED | Needs install first |
| `pnpm test:unit` | BLOCKED | Needs install first |
| `pnpm test:rules` | BLOCKED | Needs emulator/CI proof |
| `pnpm test:e2e` | BLOCKED | Needs local/CI runner and route runtime |
| `pnpm test:smoke` | BLOCKED | Needs staging/live URL |
| `pnpm build` | BLOCKED | Needs local/CI runner |
| `pnpm verify:release` | BLOCKED | Needs local/CI runner |
| `pnpm release:lock` | BLOCKED | Depends on prior gates |
| `pnpm --dir apps/urai-admin typecheck` | BLOCKED | Needs install first |
| `pnpm --dir apps/urai-admin lint` | BLOCKED | Needs install first |
| `pnpm --dir apps/urai-admin test` | BLOCKED | Needs install first |
| `pnpm --dir apps/urai-admin build` | BLOCKED | Needs install first |

No PASS status is claimed for commands that were not actually executed.
