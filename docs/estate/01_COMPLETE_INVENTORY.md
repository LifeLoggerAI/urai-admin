# Admin full selected-tree inventory, R852

GitHub recursive trees returned **truncated:false** for main 1cde00e69238f6a32237af2d1914a1b77339d5bc (tree 8f23a7a02b3bbe668ec2f8722bd5bf26d8666b1e) and exact engineering PR #85 8313188532aef304a3b55771c5080f87e4ac71eb (tree 26605648d6fcf0cca3c5adbb0aac613d42de0762). The full entry-level paths, modes, Git object IDs and reported sizes of all **1,755 path occurrences** are in [MANIFEST.json](MANIFEST.json). Repeated objects across refs are NOT unique bytes and have not been deduplicated into a content-hash total.

| Exact snapshot | Tracked blob paths | Git tree directories | Markdown .md | MDX .mdx | Git-reported blob bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Main | 849 | 290 | 92 | 131 | 2,414,480 |
| Engineering #85 | 906 | 298 | 104 | 131 | 2,161,713 |

The candidate has 107 changed paths relative to main, including source, configs, doc evidence, forks/tests, and removals. The separate docs #99 branch originally added one handoff file to main; it is not a clone of the candidate.

All 91 currently returned branch names/commit tips are in [BRANCH_REFS_20261107.json](BRANCH_REFS_20261107.json); the Git history reachable from every tip, all tags, PR ephemeral heads, LFS payloads, hidden/deleted refs, untracked/ignored files, provider state, workflow artifact bytes and historical duplicate object bytes are NOT inventoried here as a complete set. A 2,032-blob older branch fix/phase-1-launch-blockers and a one-blob proposed-canon branch were selectively inspected, not all branch trees.

**Inspection boundary:** path/SHA/size coverage of both chosen Git trees is complete as returned by API; complete individual file-byte SHA-256 and semantic examination of all 906 candidate files is NOT complete. The previous Admin audit conversation reports opening all 104 Markdown files and blob matching, but its separate 36-file ZIP package was not attached to this GitHub change; those claims are **prior-worker reports**, not an independently replicated 104-file content verification in R852. The 131 MDX files remain a specifically named semantic-work item.
