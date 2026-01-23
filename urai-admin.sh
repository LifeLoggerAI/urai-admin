#!/usr/bin/env bash
set -euo pipefail
set +H

# === URAI-ADMIN: Mythic Throne Scene scaffolding (shared package + admin app route) ===
# Assumptions:
# - monorepo with pnpm workspaces
# - admin app lives at: apps/urai-admin
# - Next.js app router is used (src/app)
# If your paths differ, edit ONLY the variables below.

ROOT="${ROOT:-$(pwd)}"
ADMIN_APP="${ADMIN_APP:-apps/urai-admin}"
SCENE_PKG="${SCENE_PKG:-packages/urai-scene}"

cd "$ROOT"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1" >&2; exit 1; }; }
need node
need pnpm

mkdir -p "$SCENE_PKG/src/urai/OrbSystem"
mkdir -p "$SCENE_PKG/src/urai"
mkdir -p "$ADMIN_APP/src/app/(admin)/throne"
mkdir -p "$ADMIN_APP/src/app/(admin)/layout"
mkdir -p "$ADMIN_APP/src/app/api/health"

# --- packages/urai-scene/package.json ---
cat > "$SCENE_PKG/package.json" <<'JSON'
{
  "name": "@urai/scene",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./urai": {
      "types": "./dist/urai/index.d.ts",
      "default": "./dist/urai/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsc -p tsconfig.build.json --watch",
    "lint": "echo "(optional) add lint""
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@react-three/fiber": "^8.0.0",
    "three": "^0.150.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
JSON

# --- packages/urai-scene/tsconfig.build.json ---
cat > "$SCENE_PKG/tsconfig.build.json" <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "noEmitOnError": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
JSON

# --- packages/urai-scene/src/index.ts ---
cat > "$SCENE_PKG/src/index.ts" <<'TS'
export * from "./urai";
TS

# --- packages/urai-scene/src/urai/index.ts ---
cat > "$SCENE_PKG/src/urai/index.ts" <<'TS'
export * from "./types";
export * from "./URAIThroneScene";
TS

# --- packages/urai-scene/src/urai/types.ts ---
cat > "$SCENE_PKG/src/urai/types.ts" <<'TS'
export type OrbState = {
  t: number;        // seconds
  mood: number;     // 0..1
  clarity: number;  // 0..1
  load: number;     // 0..1
  insight: number;  // 0..1
  anomaly: number;  // 0..1
  focus: number;    // 0..1
  chapter: number;  // 0..1
  hover: number;    // 0..1
  beat: number;     // 0..1
};

export type SceneMode = "user" | "admin";
TS

# --- packages/urai-scene/src/urai/transitions.ts ---
cat > "$SCENE_PKG/src/urai/transitions.ts" <<'TS'
export const CAM = {
  hub:   { pos: [0, 0.25, 7.25] as const, look: [0, 0.35, 0] as const, fov: 42 },
  enter: { pos: [0, 0.35, 3.20] as const, look: [0, 0.35, 0] as const, fov: 38 },
  exit:  { pos: [0, 1.25,10.50] as const, look: [0, 0.50, 0] as const, fov: 50 },
} as const;

export type CamKey = keyof typeof CAM;

export function expDamp(current: number, target: number, lambda: number, dt: number) {
  return target + (current - target) * Math.exp(-lambda * dt);
}
TS

# --- packages/urai-scene/src/urai/OrbSystem/OrbMath.ts ---
cat > "$SCENE_PKG/src/urai/OrbSystem/OrbMath.ts" <<'TS'
import type { OrbState } from "../types";

const sat = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

export function deriveOrb(state: OrbState) {
  const { load, insight, mood, anomaly, clarity, hover, focus } = state;

  const energy   = sat(0.55 * load + 0.25 * insight + 0.20 * mood);
  const danger   = smooth(sat(0.70 * anomaly + 0.20 * load));
  const serenity = smooth(sat(0.60 * clarity + 0.25 * (1 - anomaly) + 0.15 * (1 - mood)));
  const aura     = sat(0.50 * insight + 0.30 * hover + 0.20 * focus);

  const pulseBase  = 0.35 + 1.65 * energy;
  const pulseBoost = 0.80 * danger + 0.40 * aura;
  const pulseHz    = pulseBase + pulseBoost;

  const shimmer = sat(0.40 * clarity + 0.60 * insight);
  const turb    = sat(0.35 * energy + 0.65 * danger);

  const glowInner = 0.35 + 1.15 * serenity + 0.55 * aura;
  const glowOuter = 0.25 + 1.55 * energy   + 0.85 * danger;

  const particles = Math.round(800 + 3200 * energy + 2200 * insight);
  const sparks    = Math.round( 40 +  220 * danger +  120 * hover);

  return { energy, danger, serenity, aura, pulseHz, shimmer, turb, glowInner, glowOuter, particles, sparks };
}
TS

# --- packages/urai-scene/src/urai/URAIThroneScene.tsx ---
cat > "$SCENE_PKG/src/urai/URAIThroneScene.tsx" <<'TSX'
"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import type { OrbState, SceneMode } from "./types";
import { Rig } from "./Rig";
import { OrbSystem } from "./OrbSystem/OrbSystem";

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export function URAIThroneScene({ mode, state }: { mode: SceneMode; state: OrbState }) {
  const safe = useMemo(() => ({
    ...state,
    mood: clamp01(state.mood),
    clarity: clamp01(state.clarity),
    load: clamp01(state.load),
    insight: clamp01(state.insight),
    anomaly: clamp01(state.anomaly),
    focus: clamp01(state.focus),
    chapter: clamp01(state.chapter),
    hover: clamp01(state.hover),
    beat: clamp01(state.beat),
  }), [state]);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0.25, 7.25], fov: 42, near: 0.1, far: 200 }}
    >
      <color attach="background" args={["#040610"]} />
      <Suspense fallback={null}>
        <Rig mode={mode} state={safe}>
          {/* PLACEHOLDER LAYERS (fill later): SkyDome, DeepStarfield, Constellations, FogPlane, UIAnchors3D, PostFX */}
          <OrbSystem state={safe} />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
TSX

# --- packages/urai-scene/src/urai/Rig.tsx ---
cat > "$SCENE_PKG/src/urai/Rig.tsx" <<'TSX'
"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbState, SceneMode } from "./types";
import { CAM, expDamp, type CamKey } from "./transitions";

export function Rig({
  children,
  mode,
  state,
}: {
  children: React.ReactNode;
  mode: SceneMode;
  state: OrbState;
}) {
  const { camera } = useThree();
  const camKey = useRef<CamKey>("hub");
  const vPos = useRef(new Vector3(...CAM.hub.pos));
  const vLook = useRef(new Vector3(...CAM.hub.look));

  // simple rule: admin gets subtle “alive” parallax; user stays steadier
  // transition hook points:
  // - set camKey.current = "enter" on Generate
  // - set camKey.current = "exit" on Life-Map
  // - set camKey.current = "hub" on idle
  const par = mode === "admin" ? 0.08 : 0.04;

  useFrame((_, dt) => {
    const target = CAM[camKey.current];

    const wobX = Math.sin(state.t * 0.6) * par * (0.3 + 0.7 * state.hover);
    const wobY = Math.cos(state.t * 0.5) * par * (0.3 + 0.7 * state.hover);

    vPos.current.set(
      expDamp(vPos.current.x, target.pos[0] + wobX, 6.0, dt),
      expDamp(vPos.current.y, target.pos[1] + wobY, 6.0, dt),
      expDamp(vPos.current.z, target.pos[2],        6.0, dt),
    );

    vLook.current.set(
      expDamp(vLook.current.x, target.look[0], 8.0, dt),
      expDamp(vLook.current.y, target.look[1], 8.0, dt),
      expDamp(vLook.current.z, target.look[2], 8.0, dt),
    );

    camera.position.copy(vPos.current);
    camera.lookAt(vLook.current);
    camera.fov = expDamp(camera.fov, target.fov, 5.5, dt);
    camera.updateProjectionMatrix();
  });

  return <group>{children}</group>;
}
TSX

# --- packages/urai-scene/src/urai/OrbSystem/OrbSystem.tsx ---
cat > "$SCENE_PKG/src/urai/OrbSystem/OrbSystem.tsx" <<'TSX'
"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import type { OrbState } from "../types";
import { deriveOrb } from "./OrbMath";

export function OrbSystem({ state }: { state: OrbState }) {
  const core = useRef<Mesh>(null!);
  const shell = useRef<Mesh>(null!);
  const ring = useRef<Mesh>(null!);

  const d = useMemo(() => deriveOrb(state), [state]);

  useFrame((_, dt) => {
    const s = 1.0 + 0.02 * Math.sin(state.t * (Math.PI * 2) * d.pulseHz);
    core.current.scale.setScalar(s);
    ring.current.rotation.y += dt * (0.15 + 0.65 * d.turb);
    ring.current.rotation.x += dt * (0.05 + 0.25 * d.shimmer);
    shell.current.rotation.y -= dt * 0.02;
  });

  // PLACEHOLDER materials (swap to custom shader + post later)
  return (
    <group position={[0, 0.35, 0]}>
      <mesh ref={core}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshStandardMaterial emissive={"#6aa3ff"} emissiveIntensity={1.25 + d.glowInner} color={"#0b0f2a"} />
      </mesh>

      <mesh ref={shell}>
        <sphereGeometry args={[1.18, 64, 64]} />
        <meshPhysicalMaterial
          color={"#141a3a"}
          transmission={0.9}
          roughness={0.05 + 0.25 * (1 - d.serenity)}
          thickness={1.0}
          ior={1.2}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          emissive={"#5d6bff"}
          emissiveIntensity={0.25 + 0.45 * d.aura}
        />
      </mesh>

      <mesh ref={ring} position={[0, 0, 0]}>
        <torusGeometry args={[1.35, 0.05 + 0.05 * d.energy, 32, 160]} />
        <meshStandardMaterial emissive={"#b56bff"} emissiveIntensity={0.9 + d.glowOuter} color={"#0a0b18"} />
      </mesh>
    </group>
  );
}
TSX

# --- ADMIN APP: page.tsx wiring ---
cat > "$ADMIN_APP/src/app/(admin)/throne/page.tsx" <<'TSX'
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { URAIThroneScene } from "@urai/scene/urai";
import type { OrbState } from "@urai/scene/urai";

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export default function ThronePage() {
  const [t0] = useState(() => performance.now());
  const [health, setHealth] = useState<{ load: number; anomaly: number; insight: number }>({ load: 0.25, anomaly: 0.05, insight: 0.35 });

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        const j = await r.json();
        if (!alive) return;
        setHealth({
          load: clamp01(j.load ?? 0.25),
          anomaly: clamp01(j.anomaly ?? 0.05),
          insight: clamp01(j.insight ?? 0.35),
        });
      } catch {
        // keep last values
      }
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => { alive = false; clearInterval(id); };
  }, []);

  const state: OrbState = useMemo(() => {
    const t = (performance.now() - t0) / 1000;
    return {
      t,
      mood: 0.35 + 0.15 * Math.sin(t * 0.25),
      clarity: 0.70,
      load: health.load,
      insight: health.insight,
      anomaly: health.anomaly,
      focus: 0.60,
      chapter: 0.20,
      hover: 0.0,
      beat: 0.0,
    };
  }, [t0, health]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <URAIThroneScene mode="admin" state={state} />
    </div>
  );
}
TSX

# --- ADMIN APP: health api (placeholder) ---
cat > "$ADMIN_APP/src/app/api/health/route.ts" <<'TS'
import { NextResponse } from "next/server";

export async function GET() {
  // Replace with real urai-jobs / analytics telemetry:
  // - queue depth -> load
  // - errors/warnings -> anomaly
  // - insight throughput -> insight
  const now = Date.now();
  const t = (now % 60000) / 60000;

  const load = 0.25 + 0.15 * Math.sin(t * Math.PI * 2);
  const anomaly = 0.06 + 0.04 * Math.max(0, Math.sin((t + 0.15) * Math.PI * 2));
  const insight = 0.35 + 0.20 * Math.max(0, Math.sin((t + 0.45) * Math.PI * 2));

  return NextResponse.json({ load, anomaly, insight });
}
TS

# --- Ensure admin app depends on scene package ---
ADMIN_PKG_JSON="$ADMIN_APP/package.json"
if [[ -f "$ADMIN_PKG_JSON" ]]; then
  node - <<'NODE'
const fs = require("fs");
const path = require("path");
const p = process.env.ADMIN_PKG_JSON;
const j = JSON.parse(fs.readFileSync(p,"utf8"));
j.dependencies ||= {};
j.dependencies["@urai/scene"] ||= "workspace:*";
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "
");
NODE
else
  echo "WARN: $ADMIN_PKG_JSON not found; add dependency manually: @urai/scene: workspace:*" >&2
fi

# --- Build scene pkg once so types exist ---
pnpm -C "$SCENE_PKG" install >/dev/null 2>&1 || true
pnpm -C "$SCENE_PKG" run build

# --- Install root deps and run admin dev (optional) ---
pnpm install

echo
echo "OK: URAI-ADMIN Throne route created:"
echo "  - $ADMIN_APP/src/app/(admin)/throne/page.tsx"
echo "Shared scene package:"
echo "  - $SCENE_PKG/src/urai/URAIThroneScene.tsx"
echo
echo "Run:"
echo "  pnpm -C $ADMIN_APP dev"
echo
echo "Then open:"
echo "  http://localhost:3000/throne"
