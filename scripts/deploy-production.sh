#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

# Guarded production release entrypoint. This intentionally delegates to the
# branch's launch script, which performs install, release checks, preflight,
# Firebase deploy, smoke tests, live verification, and evidence logging.
pnpm launch:production
