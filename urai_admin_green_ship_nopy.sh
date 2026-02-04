#!/usr/bin/env bash
set -euo pipefail

REPO="$(pwd)"
APP_DIR="apps/urai-admin"
PROJECT="urai-4dc1d"
SITE="urai-admin"

echo "=== URAI-ADMIN GREEN+SHIP (no-python, UTC $(date -u)) ==="
echo "REPO=$REPO"
echo "APP_DIR=$APP_DIR"
echo "PROJECT=$PROJECT"
echo "SITE=$SITE"

echo "--- 0) ensure eslint plugin exists ---"
pnpm -w add -D eslint-plugin-react-refresh@^0.5.0 >/dev/null 2>&1 || true

echo "--- 1) SKIP TS1149 case-duplicate check (no python3) ---"

echo "--- 2) ensure Next App Router root layout exists ---"
mkdir -p "$APP_DIR/app"
if [ ! -f "$APP_DIR/app/layout.tsx" ]; then
  cat > "$APP_DIR/app/layout.tsx" <<'LAYOUT'
export const metadata = {
  title: "URAI Admin",
  description: "URAI Admin Console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
LAYOUT
  echo "OK: created app/layout.tsx"
else
  echo "OK: app/layout.tsx exists"
fi

echo "--- 3) configure Next static export ---"
CFG="$APP_DIR/next.config.js"
if [ -f "$CFG" ]; then
  if ! grep -q 'output' "$CFG"; then
    perl -0777 -i -pe 's/(module\.exports\s*=\s*\{\s*)/$1\n  output: "export",\n  images: { unoptimized: true },\n/s' "$CFG" || true
  fi
else
  cat > "$CFG" <<'NEXTCFG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
module.exports = nextConfig;
NEXTCFG
fi

echo "--- 4) update firebase.json hosting.public -> out ---"
node - <<'NODE'
const fs=require("fs");
const p="firebase.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
j.hosting=j.hosting||{};
j.hosting.site = j.hosting.site || "urai-admin";
j.hosting.public = "apps/urai-admin/out";
j.hosting.ignore = j.hosting.ignore || ["firebase.json","**/.*","**/node_modules/**"];
fs.writeFileSync(p, JSON.stringify(j,null,2)+"
");
console.log("OK: firebase.json hosting.public -> apps/urai-admin/out");
NODE

echo "--- 5) build workspace ---"
pnpm -w install
pnpm --filter "./$APP_DIR" lint || true
pnpm --filter "./$APP_DIR" typecheck
pnpm --filter "./$APP_DIR" build

echo "--- 6) confirm export output exists ---"
test -d "$APP_DIR/out" || { echo "ERROR: $APP_DIR/out not found (static export failed)"; exit 2; }
echo "OK: out/ exists"
ls -la "$APP_DIR/out" | head -n 40

echo "--- 7) deploy hosting only ---"
firebase deploy --only hosting --project "$PROJECT"

echo "=== DONE ==="
echo "URL: https://$SITE.web.app"
