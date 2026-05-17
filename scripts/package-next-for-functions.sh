#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${ROOT_DIR}/apps/urai-admin"
FUNCTIONS_DIR="${ROOT_DIR}/functions"
NEXT_PACKAGE_DIR="${FUNCTIONS_DIR}/.next"
PUBLIC_PACKAGE_DIR="${FUNCTIONS_DIR}/public"
APP_PACKAGE_DIR="${FUNCTIONS_DIR}/app"
SRC_PACKAGE_DIR="${FUNCTIONS_DIR}/src"

if [[ ! -d "${APP_DIR}/.next" ]]; then
  echo "ERROR: Missing ${APP_DIR}/.next. Run pnpm --dir apps/urai-admin build first." >&2
  exit 1
fi

if [[ ! -d "${APP_DIR}/src/app" ]]; then
  echo "ERROR: Missing ${APP_DIR}/src/app. Next Functions hosting requires an app directory." >&2
  exit 1
fi

rm -rf "${NEXT_PACKAGE_DIR}" "${PUBLIC_PACKAGE_DIR}" "${APP_PACKAGE_DIR}" "${SRC_PACKAGE_DIR}/app"
mkdir -p "${NEXT_PACKAGE_DIR}" "${PUBLIC_PACKAGE_DIR}" "${APP_PACKAGE_DIR}" "${SRC_PACKAGE_DIR}"

cp -R "${APP_DIR}/.next/." "${NEXT_PACKAGE_DIR}/"
cp -R "${APP_DIR}/src/app/." "${APP_PACKAGE_DIR}/"
cp -R "${APP_DIR}/src/app" "${SRC_PACKAGE_DIR}/app"

if [[ -d "${APP_DIR}/public" ]]; then
  cp -R "${APP_DIR}/public/." "${PUBLIC_PACKAGE_DIR}/"
fi

echo "OK: Packaged Next build and app source for Functions hosting."
