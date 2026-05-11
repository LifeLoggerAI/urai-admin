#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "--- Cleaning stale generated app JavaScript artifacts ---"

find apps/urai-admin/src -type f \( -name '*.js' -o -name '*.jsx' \) \
  ! -name '*.config.js' \
  -print -delete

# Remove legacy route surfaces that Next still discovers during build.
# The active URAI Admin app is apps/urai-admin/src/app with concrete public routes.
if [[ -d apps/urai-admin/app ]]; then
  rm -r apps/urai-admin/app
fi

if [[ -d apps/urai-admin/src/pages ]]; then
  rm -r apps/urai-admin/src/pages
fi

# Remove legacy route groups that resolve to the same paths as canonical routes.
for route_group in '(admin)' '(auth)' '(protected)'; do
  legacy_path="apps/urai-admin/src/app/${route_group}"
  if [[ -d "${legacy_path}" ]]; then
    rm -r "${legacy_path}"
  fi
done

# Remove generated Next output for a clean build.
if [[ -d apps/urai-admin/.next ]]; then
  rm -r apps/urai-admin/.next
fi

if [[ -d apps/urai-admin/out ]]; then
  rm -r apps/urai-admin/out
fi

echo "--- App generated artifact cleanup complete ---"
