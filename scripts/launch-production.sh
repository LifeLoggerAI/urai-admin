#!/bin/bash
set -euo pipefail

export URAI_ADMIN_BASE_URL="${URAI_ADMIN_BASE_URL:-https://www.uraiadmin.com}"
export URAI_ADMIN_FUNCTIONS_BASE_URL="${URAI_ADMIN_FUNCTIONS_BASE_URL:-https://us-central1-urai-4dc1d.cloudfunctions.net}"

echo "--- URAI Admin production launch ---"
echo "Hosting URL: ${URAI_ADMIN_BASE_URL}"
echo "Functions URL: ${URAI_ADMIN_FUNCTIONS_BASE_URL}"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is required. Run: corepack enable && corepack prepare pnpm@9.15.0 --activate" >&2
  exit 1
fi

if ! command -v firebase >/dev/null 2>&1; then
  echo "ERROR: firebase-tools CLI is required. It is installed by pnpm install, then run this command again." >&2
  exit 1
fi

pnpm install --frozen-lockfile=false
pnpm full:check
pnpm preflight:production
pnpm deploy
pnpm smoke-test
pnpm verify:production

echo "--- URAI Admin production launch complete ---"
