#!/usr/bin/env bash
set -euo pipefail

APP="urai-staging"
VERSION="v1.0.0"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "=== [$APP] SEAL START $TS ==="

# Safety
git diff --quiet || { echo "❌ Dirty tree"; exit 1; }

# Build assertion
npm ci
npm run build

# Governance artifacts
cat > LOCK.md <<EOF
# $APP LOCK

Version: $VERSION
Locked At: $TS

Locked:
- Life Map navigation + camera invariants
- Replay pipeline semantics
- Permission gating (viewer vs admin)
- Data read-only guarantees for public views
- Deployment topology

Forbidden without unlock:
- Camera path math
- Timeline → replay bindings
- Auth boundaries
- Data mutation in staging

Unlock requires Founder protocol.
EOF

cat > .governance.lock <<EOF
LOCKED=true
PROJECT=$APP
VERSION=$VERSION
TIMESTAMP=$TS
AUTHORITY=FOUNDER
EOF

cat > CHANGELOG_GOVERNANCE.md <<EOF
## $VERSION — $TS
- Core experience sealed
- Camera + replay invariants frozen
- Build verified
EOF

mkdir -p docs

cat > docs/INVARIANTS.md <<EOF
# $APP INVARIANTS

- Sky → Life Map transition math is immutable
- Replay is deterministic from stored events
- No client-side mutation of life data
- Viewer permissions are read-only
EOF

cat > docs/STATUS.md <<EOF
$APP STATUS

FOUNDATION COMPLETE
Version: $VERSION
Timestamp: $TS
EOF

git add LOCK.md .governance.lock CHANGELOG_GOVERNANCE.md docs
git commit -m "governance: seal $APP $VERSION"
git tag -a "$APP-$VERSION-sealed" -m "$APP sealed $TS"
git push && git push --tags

echo "=== [$APP] SEALED ==="
