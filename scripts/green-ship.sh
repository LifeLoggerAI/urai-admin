#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "--- URAI Admin Green Ship ---"

echo "--- Cleaning stale Functions sources ---"
bash scripts/clean-functions-legacy.sh

echo "--- Cleaning generated app artifacts ---"
bash scripts/clean-app-generated.sh

echo "--- Installing dependencies ---"
pnpm install

echo "--- Verifying Functions active config ---"
pnpm functions:typecheck:active
pnpm functions:build:active

echo "--- Running workspace lint ---"
pnpm lint

echo "--- Running workspace typecheck ---"
pnpm typecheck

echo "--- Running workspace tests ---"
pnpm test

echo "--- Running workspace build ---"
pnpm build

echo "--- Running smoke tests ---"
pnpm smoke-test

echo "--- GREEN SHIP COMPLETE ---"
