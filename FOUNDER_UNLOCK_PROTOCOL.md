# URAI — FOUNDER UNLOCK PROTOCOL

Only the Founder (Adam Clamp) may unlock sealed systems.

Valid reasons:
- Security remediation
- Regulatory compliance
- Deliberate architectural evolution

Required steps:
1) Create UNLOCK_REQUEST.md (reason, files, risks, rollback)
2) Bump version (e.g. v1.1.0-unlocked)
3) Archive (do not delete) LOCK.md + .governance.lock
4) Make changes on branch: unlock/<reason>
5) Re-run full seal
6) Re-tag as <project>-<version>-relocked

Forbidden:
- Silent edits
- Partial unlocks
- Convenience changes
