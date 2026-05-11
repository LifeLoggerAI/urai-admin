#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "--- Cleaning stale generated app JavaScript artifacts ---"

find apps/urai-admin/src -type f \( -name '*.js' -o -name '*.jsx' \) \
  ! -name '*.config.js' \
  -print -delete

# Remove legacy route surfaces that Next still discovers during build.
# The active URAI Admin app is apps/urai-admin/src/app.
rm -rf apps/urai-admin/app
rm -rf apps/urai-admin/src/pages

# Remove legacy route-group artifacts that are no longer canonical for /admin/*.
rm -rf 'apps/urai-admin/src/app/(admin)/_legacy'

# Remove generated Next output for a clean build.
rm -rf apps/urai-admin/.next apps/urai-admin/out

echo "--- App generated artifact cleanup complete ---"
