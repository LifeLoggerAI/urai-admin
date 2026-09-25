# Legacy control-plane prototype

This directory is retained as historical/prototype architecture only.

It is **not** the production URAI Admin control plane, not a live-health source, and not deployment authority. The canonical Admin runtime is the Next.js application in `apps/urai-admin`, its protected server APIs/Functions, the governed `systemRegistry` evidence model, and provider-backed release/runtime receipts.

Rules:

- do not expose this prototype as a production route;
- do not label its static registry values as live;
- do not use it to authorize provider actions or autonomous remediation;
- do not use its output as release, monitoring, incident, or rollback evidence;
- preserve it only as a historical design reference until a separately reviewed migration/removal decision is made.
