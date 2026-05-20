#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

# Guarded production release entrypoint. Keep this non-destructive and routed
# through release gates so production deploys cannot bypass ownership/runtime
# checks, production preflight, smoke tests, live verification, or evidence logs.
pnpm run release:lock
pnpm launch:production
