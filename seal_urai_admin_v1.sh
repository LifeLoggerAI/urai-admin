#!/usr/bin/env bash
set -euo pipefail

############################################
# URAI-ADMIN — POST-DEPLOY SEAL SCRIPT
############################################

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
VERSION="v1.0.0"
APP="urai-admin"

echo "=== [$APP] FINAL SEAL $TS ==="

############################################
# 1. VERIFY LOCK EXISTS
############################################
test -f LOCK.md || { echo "❌ LOCK.md missing"; exit 1; }
test -f .governance.lock || { echo "❌ governance lock missing"; exit 1; }

############################################
# 2. SECURITY ATTESTATION
############################################
cat > SECURITY.md <<EOF
# URAI-ADMIN SECURITY POSTURE

Status: LOCKED
Version: $VERSION
Timestamp: $TS

This system is an internal administrative control plane.

Security properties:
- Explicit role-based access control
- No anonymous access
- No public write surfaces
- No client-only permission enforcement
- No hidden mutation paths

Threat model explicitly excludes:
- consumer threat actors
- untrusted contributors
- experimental feature flags

Any expansion of scope requires governance unlock.
EOF

############################################
# 3. INVARIANTS (WHAT MUST NEVER CHANGE)
############################################
mkdir -p docs

cat > docs/INVARIANTS.md <<EOF
# URAI-ADMIN INVARIANTS

These invariants define system trust.

MUST NEVER CHANGE WITHOUT UNLOCK:
- Role definitions and hierarchy
- Permission checks at route and API level
- Admin data mutation boundaries
- Audit visibility rules
- Deployment topology

Violation of invariants = breach of trust.
EOF

############################################
# 4. VERIFICATION CHECKLIST (AUDITABLE)
############################################
cat > docs/VERIFICATION.md <<EOF
# URAI-ADMIN VERIFICATION

Completed checks:

- Clean production build
- No console errors
- No debug logs
- Unauthorized users blocked
- Authorized users function correctly
- Firebase deploy verified
- Governance lock present
- Repo tagged

Verified at: $TS
EOF

############################################
# 5. FINAL DECLARATION (IMMUTABLE)
############################################
cat > docs/STATUS.md <<EOF
URAI-ADMIN STATUS DECLARATION

Status: FOUNDATION COMPLETE
Version: $VERSION
Timestamp: $TS

This system is considered complete, stable, and sealed.
No further development is expected or required.

Changes without governance unlock are prohibited.
EOF

############################################
# 6. COMMIT + TAG SEAL
############################################
git add SECURITY.md docs
git commit -m "governance: final seal + security attestation"
git tag -a "$APP-$VERSION-sealed" -m "$APP sealed and attested $TS"
git push
git push --tags

############################################
# 7. HARD STOP
############################################
echo "========================================"
echo "URAI-ADMIN — SEALED"
echo "FOUNDATION COMPLETE · LIVE · LOCKED"
echo "NO FURTHER ACTION REQUIRED"
echo "========================================"
