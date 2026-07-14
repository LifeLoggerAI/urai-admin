#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${ROOT_DIR}/apps/urai-admin"
FUNCTIONS_APP_DIR="${ROOT_DIR}/functions/apps/urai-admin"

echo "--- Packaging Next build and app source for Functions hosting ---"

if [[ ! -d "${APP_DIR}/.next" ]]; then
  echo "ERROR: Missing Next build output at ${APP_DIR}/.next. Run pnpm --dir apps/urai-admin build first." >&2
  exit 1
fi

rm -rf "${FUNCTIONS_APP_DIR}"
mkdir -p "${FUNCTIONS_APP_DIR}"

cp -R "${APP_DIR}/.next" "${FUNCTIONS_APP_DIR}/.next"

for path in package.json next.config.js next.config.mjs public src app pages styles scripts tailwind.config.js tailwind.config.ts postcss.config.js postcss.config.mjs tsconfig.json; do
  if [[ -e "${APP_DIR}/${path}" ]]; then
    cp -R "${APP_DIR}/${path}" "${FUNCTIONS_APP_DIR}/${path}"
  fi
done

# Keep packaged runtime small and deterministic. Dependencies are supplied by functions/package.json.
rm -rf "${FUNCTIONS_APP_DIR}/node_modules"
rm -rf "${FUNCTIONS_APP_DIR}/.next/cache"
find "${FUNCTIONS_APP_DIR}" -type f \( -name '*.map' -o -name '*.tsbuildinfo' \) -delete

echo "OK: Packaged Next build and app source for Functions hosting."
