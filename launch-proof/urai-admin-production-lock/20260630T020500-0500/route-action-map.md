# Route and Action Map

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: source-level inspection

| Route or action | Access | Required role | Reality | Audit | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | public | none | public shell | no | PARTIAL |
| `/features` | public | none | public shell | no | PARTIAL |
| `/pricing` | public | none | public shell | no | PARTIAL |
| `/security` | public | none | public shell | no | PARTIAL |
| `/docs` | public | none | public shell | no | PARTIAL |
| `/contact` | public | none | public shell | no | PARTIAL |
| `/privacy` | public | none | info route | no | BLOCKED until smoke proof |
| `/terms` | public | none | info route | no | BLOCKED until smoke proof |
| `/login` | public | none | auth entry | not verified | PARTIAL |
| `/admin` | protected | owner/admin/viewer | shell, runtime proof missing | no | PARTIAL |
| `/admin/users` | protected | owner/admin | Firestore-backed module | yes through API | PARTIAL |
| `/admin/projects` | protected | owner/admin/viewer | read module | not verified | PARTIAL |
| `/admin/feature-flags` | protected | read viewer+, write owner/admin | real write API; confirmation added | yes for write | PARTIAL |
| `/admin/jobs` | protected | owner/admin/viewer | integration proof missing | not verified | GATED |
| `/admin/job-runs` | protected | owner/admin/viewer | integration proof missing | not verified | GATED |
| `/admin/dead-letters` | protected | owner/admin/viewer UI | integration proof missing | not verified | GATED |
| `/admin/system` | protected | owner/admin/viewer | env proof missing | not verified | GATED |
| `/admin/audit` | protected | owner/admin | collection-backed route | not fully verified | PARTIAL |
| `/admin/policies` | protected | owner/admin/viewer | governance/info route | no | PARTIAL |
| `/admin/settings` | protected | owner/admin/viewer | runtime proof missing | not verified | GATED |
| `/admin/privacy-requests` | protected | owner/admin | minimized metadata after fix | not verified | PARTIAL |
| `/api/auth/admin-session` | protected helper | owner/admin/viewer | Firebase session verifier | no | PARTIAL |
| `/api/admin/users` | protected API | owner/admin | Firestore read | yes | PARTIAL |
| `/api/admin/set-user-active` | protected API | owner/admin | transaction; confirmation added | yes | PARTIAL |
| `/api/admin/update-user-role` | protected API | owner only | transaction; confirmation added | yes | PARTIAL |
| `/api/admin/set-flag` | protected API | owner/admin | transaction; confirmation added | yes | PARTIAL |
| `/api/admin/collection` | protected API | per allowlist | allowlisted reader; minimization added | no generic read audit | PARTIAL |

Navigation and route behavior must still be verified by E2E, smoke, and staging checks.
