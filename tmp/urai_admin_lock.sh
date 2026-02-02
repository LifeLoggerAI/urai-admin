#!/usr/bin/env bash
set -euo pipefail

TS="$(date +%Y%m%d_%H%M%S)"
LOG="/tmp/urai_admin_lock_${TS}.log"
exec > >(tee -a "$LOG") 2>&1
echo "LOG=START urai_admin_lock TS=$TS"

die(){ echo "FATAL: $*" >&2; echo "LOG=FAIL $LOG" >&2; exit 1; }
has(){ command -v "$1" >/dev/null 2>&1; }

# --- locate repo ---
REPO="${URAI_REPO:-$(pwd)}"
[ -d "$REPO" ] || die "repo dir not found: $REPO"
cd "$REPO"
echo "REPO=$REPO"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git status -sb || true

# --- ensure node ---
has node || die "node not found"
node -v
has npm || die "npm not found"
npm -v

# --- pnpm WITHOUT corepack (Nix store is read-only) ---
# Strategy:
#   1) If pnpm exists, use it
#   2) Else install pnpm into $HOME/.npm-global (user-writable) and use it
#   3) Else fallback to npx pnpm@latest for every call
export PATH="$HOME/.npm-global/bin:$PATH"

PNPM="pnpm"
if ! has pnpm; then
  echo "STEP=pnpm_setup_user_prefix"
  mkdir -p "$HOME/.npm-global" || true
  # install pnpm into a user-writable prefix (no /nix/store writes)
  npm i -g --prefix "$HOME/.npm-global" pnpm@latest || true
fi

if has pnpm; then
  pnpm -v
  PNPM="pnpm"
else
  echo "WARN: pnpm not installable; falling back to npx -y pnpm@latest"
  PNPM="npx -y pnpm@latest"
  $PNPM -v
fi

backup_file(){ [ -f "$1" ] || return 0; cp -a "$1" "$1.bak.$TS"; echo "BACKUP $1 -> $1.bak.$TS"; }

# --- find admin app (monorepo-friendly) ---
ADMIN_APP=""
if [ -d "apps" ]; then
  # pick first apps/**/package.json with "admin" in its path
  while IFS= read -r pj; do
    pdir="$(dirname "$pj")"
    case "$pdir" in
      *admin* ) ADMIN_APP="$pdir"; break ;;
    esac
  done < <(find apps -maxdepth 3 -name package.json 2>/dev/null || true)
fi
if [ -z "$ADMIN_APP" ] && [ -f "package.json" ]; then
  if grep -qE '"name"\s*:\s*".*admin.*"' package.json 2>/dev/null; then ADMIN_APP="."; fi
fi
[ -n "$ADMIN_APP" ] || die "could not find admin app (expected apps/*admin*/package.json)"
echo "ADMIN_APP=$ADMIN_APP"

# --- install deps ---
echo "STEP=install"
if [ -f "pnpm-lock.yaml" ] || [ -f "pnpm-workspace.yaml" ]; then
  $PNPM -w install --frozen-lockfile=false
else
  $PNPM install --frozen-lockfile=false
fi

# --- common font fix (Geist_Mono typo) ---
echo "STEP=patch_fonts_if_needed"
# Avoid grouped find parens entirely (UI mangling). Just do two passes.
for f in $(find "$ADMIN_APP" -type f -name "layout.tsx" 2>/dev/null || true); do
  if grep -q "Geist_Mono" "$f" 2>/dev/null; then
    backup_file "$f"
    sed -i 's/Geist_Mono/GeistMono/g' "$f"
    echo "PATCHED Geist_Mono -> GeistMono in $f"
  fi
done
for f in $(find "$ADMIN_APP" -type f -name "layout.ts" 2>/dev/null || true); do
  if grep -q "Geist_Mono" "$f" 2>/dev/null; then
    backup_file "$f"
    sed -i 's/Geist_Mono/GeistMono/g' "$f"
    echo "PATCHED Geist_Mono -> GeistMono in $f"
  fi
done

# --- run gates (only if scripts exist) ---
echo "STEP=lint_typecheck_test_build"
SCRIPTS="$(node -e "const p=require('./$ADMIN_APP/package.json'); console.log(Object.keys(p.scripts||{}).join('\n'))" 2>/dev/null || true)"

run_in_admin(){ (cd "$ADMIN_APP" && bash -lc "$1"); }

maybe_run(){
  local name="$1"
  if echo "$SCRIPTS" | grep -qx "$name"; then
    echo "RUN $name"
    run_in_admin "$PNPM run $name"
  else
    echo "SKIP: no script '$name'"
  fi
}

maybe_run lint
maybe_run typecheck
maybe_run test
maybe_run build

# --- firebase deploy (optional) ---
echo "STEP=firebase_deploy_optional"
if has firebase; then
  FB_DIR=""
  if [ -f "$ADMIN_APP/firebase.json" ] || [ -f "$ADMIN_APP/.firebaserc" ]; then
    FB_DIR="$ADMIN_APP"
  elif [ -f "$REPO/firebase.json" ] || [ -f "$REPO/.firebaserc" ]; then
    FB_DIR="$REPO"
  fi

  if [ -n "$FB_DIR" ]; then
    cd "$FB_DIR"
    PROJ="${URAI_ADMIN_FIREBASE_PROJECT:-}"
    if [ -z "$PROJ" ] && [ -f ".firebaserc" ]; then
      PROJ="$(node -e "try{const r=require('./.firebaserc'); console.log((r.projects||{}).default||'')}catch(e){process.exit(0)}" 2>/dev/null || true)"
    fi
    if [ -z "$PROJ" ]; then
      echo "Available Firebase projects:"
      firebase projects:list || true
      die "Set URAI_ADMIN_FIREBASE_PROJECT=<project_id> then re-run: URAI_ADMIN_FIREBASE_PROJECT=... /tmp/urai_admin_lock.sh"
    fi
    echo "FIREBASE_PROJECT=$PROJ"
    firebase use "$PROJ" || firebase use --add "$PROJ"

    [ -f "firebase.json" ] || die "firebase.json not found in $FB_DIR"

    DEPLOY_TARGETS=()
    grep -q '"hosting"' firebase.json && DEPLOY_TARGETS+=("hosting")
    grep -q '"functions"' firebase.json && DEPLOY_TARGETS+=("functions")
    grep -q '"firestore"' firebase.json && DEPLOY_TARGETS+=("firestore")
    grep -q '"storage"' firebase.json && DEPLOY_TARGETS+=("storage")

    if [ "${#DEPLOY_TARGETS[@]}" -gt 0 ]; then
      echo "DEPLOY=${DEPLOY_TARGETS[*]}"
      firebase deploy --only "$(IFS=,; echo "${DEPLOY_TARGETS[*]}")"
    else
      echo "SKIP: no deploy targets detected"
    fi

    cd "$REPO"
  else
    echo "SKIP: firebase.json/.firebaserc not found"
  fi
else
  echo "SKIP: firebase CLI not installed"
fi

echo "LOG=OK $LOG"
echo "OPEN_LOG: $LOG"
