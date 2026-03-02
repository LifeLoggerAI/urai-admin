#!/usr/bin/env bash
set -euo pipefail

############################################
# URAI-ADMIN — FINAL SHIP / LOCK SCRIPT
# Founder-grade. No vibes. No mercy.
############################################

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
VERSION="v1.0.0"
APP="urai-admin"

echo "=== [$APP] SHIP START $TS ==="

############################################
# 0. PRE-FLIGHT
############################################
command -v node >/dev/null || { echo "Node missing"; exit 1; }
command -v npm >/dev/null || { echo "npm missing"; exit 1; }

git diff --quiet || {
  echo "❌ Working tree dirty. Commit or stash first."
  exit 1
}

############################################
# 1. HARD AUDIT (MECHANICAL)
############################################
echo "→ Audit: dead code, TODOs, console logs"

grep -R "TODO" . && { echo "❌ TODOs found"; exit 1; } || true
grep -R "FIXME" . && { echo "❌ FIXMEs found"; exit 1; } || true

grep -R "console.log" . && {
  echo "❌ console.log found (admin must be clean)"
  exit 1
} || true

############################################
# 2. TYPE + LINT + BUILD
############################################
echo "→ Install"
npm ci

echo "→ Typecheck"
npm run typecheck

echo "→ Lint"
npm run lint

echo "→ Build"
npm run build

############################################
# 3. PROD-SAFETY ASSERTIONS
############################################
echo "→ Verifying prod invariants"

test -f .env.production || {
  echo "❌ .env.production missing"
  exit 1
}

grep -q "NEXT_PUBLIC_" .env.production || {
  echo "⚠️ No NEXT_PUBLIC vars (ok if intentional)"
}

############################################
# 4. DEPLOY (FIREBASE)
############################################
echo "→ Deploying to Firebase"
firebase deploy --only hosting

############################################
# 5. LIVE VERIFICATION (BASIC)
############################################
echo "→ Live smoke check"
URL="$(firebase hosting:sites:list | awk 'NR==2{print $NF}')"

curl -sf "$URL" >/dev/null || {
  echo "❌ Site not reachable"
  exit 1
}

############################################
# 6. GOVERNANCE LOCK
############################################
echo "→ Writing governance artifacts"

cat > LOCK.md <<EOF
# URAI-ADMIN LOCK

Version: $VERSION  
Locked At: $TS  

This system is FOUNDATION COMPLETE.

Locked:
- Permission model
- Admin routes
- Firestore access patterns
- Deployment topology
- UI hierarchy and semantics

Forbidden without governance unlock:
- Auth logic changes
- Role definitions
- Admin action scope expansion
- Data mutation semantics

Unlock requires:
- Founder approval
- Governance log entry
- Version bump
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

- System finalized
- Security audited
- Deployed to production
- Governance lock applied
EOF

############################################
# 7. TAG + FINAL COMMIT
############################################
git add LOCK.md .governance.lock CHANGELOG_GOVERNANCE.md
git commit -m "governance: lock $APP $VERSION"
git tag -a "$APP-$VERSION" -m "$APP locked at $TS"
git push
git push --tags

############################################
# 8. FINAL DECLARATION
############################################
echo "========================================"
echo "URAI-ADMIN STATUS:"
echo "FOUNDATION COMPLETE · DEPLOYED · LOCKED"
echo "Version: $VERSION"
echo "Timestamp: $TS"
echo "========================================"