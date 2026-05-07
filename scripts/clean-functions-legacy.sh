#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "--- Cleaning stale local Functions sources that are not part of the active deploy entrypoint ---"

rm -rf functions/src/admin
rm -rf functions/src/middleware
rm -rf functions/src/scripts
rm -f functions/src/setAdminClaim.ts
rm -f functions/src/setAdminClaim.js

# Remove generated function output so build starts clean.
rm -rf functions/lib

echo "--- Remaining Functions source files ---"
find functions/src -maxdepth 3 -type f | sort

echo "--- Functions cleanup complete ---"
