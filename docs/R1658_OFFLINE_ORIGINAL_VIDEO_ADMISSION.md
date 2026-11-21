# R1658 — Verified offline original-video admission to Founder Inbox

**Execution:** 2026-11-20 America/Chicago / 2026-11-21 UTC. **State:** Offline integration candidate PASS. **Production:** HOLD / NO-GO. No private-memory writes, new paid Pod, remote task creation, IAM changes, deployment or merge.

## What was implemented

This PR adds a genuine, fail-closed file-admission path, using two separately acquired local video files from an authorized completed HeyGen result. It does not rely on YouTube posts as evidence.

Files:
- `scripts/admit-founder-video-offline.mjs`: Validates completion receipt, provider identity, explicit private archive destination, safe filename and review worker; independently reads source MP4 and archived MP4 from separate inode-backed local files; computes and compares byte lengths and SHA-256; validates prior private manifest; returns a new record only when the video ID is absent; refuses existing-ID hash collisions and reused original+archive same inode. Every admitted record is **review pending and founder unacknowledged**.
- `scripts/admit-founder-video-offline.test.mjs`: Eight negative/functional checks, including incomplete provider, mismatched source/archive, symlink/hardlink reuse, collisions, untrusted URLs, altered release status.
- `scripts/admit-founder-video-cli.mjs`: Accepts ONLY explicitly exported local authorized input JSONs and original/private-archive file paths; writes a **new** private manifest with exclusive `wx` and mode `0600` rather than overwriting an existing version. When the job is already present and matches, prints a recheck receipt and performs no write. No provider APIs, scheduler, Firestore reader, or notification system.
- `scripts/admit-founder-video-cli.test.mjs`: Four CLI checks for private output mode, anti-overwrite, mismatched source denial, and idempotency.

The existing R1653 (offline mission projector), R1656 (custody manifest validator) and R1657 (static UI renderer) remain unchanged.

## Real original video source and execution proof

Existing HeyGen completed record: [Cinematic tech-research teaser](https://app.heygen.com/videos/d230fd9cad6a40969940845112cd8a78), video ID `d230fd9cad6a40969940845112cd8a78`. Previously uploaded archival MP4: [private Notion original video archive](https://app.notion.com/p/41ffc25435048191ac88e13356f6b8e3). The two provider/Notion URLs were freshly retrieved via authorized account connectors (Notion's generated download URLs were *not* copied into the repository). Both were streamed to separate local files on **existing Runpod Pod `u7efpw44681cza`**.

- Origin bytes: **3,309,120**
- Archive bytes: **3,309,120**
- Source SHA-256 and archive SHA-256: **`d3a5489ebd19566a79fed1a262ec87f3b7327db98bc144c6256f7e50eb5571df`**
- Independent local file admission: **exit 0**, result `ARCHIVED_BYTES_VERIFIED`, `contentVerifiedByThisRun:true`, `newRecord:true`; created a one-video private manifest at `/tmp/r1658-founder-inbox/r1658-real-single-private-manifest.json`, mode **0600**.
- Existing R1656 11-record manifest recheck with the same source/archive files: **exit 0**, result `RECHECKED_UNCHANGED`, `newRecord:false`, manifest **unchanged** (11 records).
- One-video offline manifest rendered with existing R1657 UI source to **7,900-byte static HTML**, exactly **one** artifact card, correct Notion archive link and `Review pending` status.

**Important:** the single-item manifest generated from a reduced copy of the existing custody document is a *test output* on the Pod, not the new canonical historical inventory. The private Labs R1656 11-artifact manifest stays authoritative and unmodified. No new worker video was produced.

## Combined test execution

All six Node test suites (R1653 + R1656 + R1657 + R1658) on the existing Pod, source bytes fetched from the review branch: **34/34 PASS, 0 FAIL, exit code 0**.

This validates only the **offline** file→hash→manifest→static-view stage. The path was not yet invoked by a trusted worker-completion event in a live authenticated environment, cannot independently prove provider rights/ownership, has no persistent review/acceptance token or scheduled archive transport, and has not received external security review. Temporary local outputs do not themselves constitute durable founder-accessible archives; the original, already archived MP4 is available via the private Notion page.

## Remaining live system boundary

The actual work still open is a secure authorized provider-event/worker-task intake, independent source acquisition, verified archive upload, authenticated private manifest/store update with atomic concurrency guarantees, reliable founder notification, explicit approval and provenance-preserving next-worker handoff. These require nonproduction authenticated cross-worker tests, independent privacy/security review and controlled deployment approval. R1658 does not enable or impersonate those capabilities.

**Review-only PR remains draft/unmerged. Production HOLD / NO-GO; private-memory writes OFF.**
