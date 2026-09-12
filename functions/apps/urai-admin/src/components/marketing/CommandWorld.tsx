'use client';

import { useMemo, useState } from 'react';

const nodes = [
  { label: 'Auth', value: 'access-gated', x: 14, y: 26, z: 0 },
  { label: 'Audit', value: 'evidence-gated', x: 69, y: 21, z: 2 },
  { label: 'Jobs', value: 'runtime-gated', x: 77, y: 60, z: 1 },
  { label: 'Flags', value: 'source-defined', x: 22, y: 68, z: 3 },
  { label: 'Registry', value: 'systems', x: 47, y: 43, z: 4 },
];

export function CommandWorld({ compact = false }: { compact?: boolean }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const transform = useMemo(() => {
    const rotateY = (pointer.x - 50) / 18;
    const rotateX = (50 - pointer.y) / 20;
    return `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [pointer.x, pointer.y]);

  return (
    <section
      className={compact ? 'command-world command-world-compact' : 'command-world'}
      aria-label="Interactive URAI Admin command world"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div className="command-aurora command-aurora-a" />
      <div className="command-aurora command-aurora-b" />
      <div className="command-grid" />
      <div className="command-world-stage" style={{ transform }}>
        <div className="command-orbit command-orbit-one" />
        <div className="command-orbit command-orbit-two" />
        <div className="command-core">
          <div className="command-core-ring" />
          <div className="command-core-inner">
            <span>URAI</span>
            <strong>Control Core</strong>
          </div>
        </div>
        {nodes.map((node) => (
          <div
            className={`command-node command-node-${node.z}`}
            key={node.label}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span>{node.label}</span>
            <strong>{node.value}</strong>
          </div>
        ))}
        <div className="command-panel command-panel-left">
          <span>Release posture</span>
          <strong>Protected</strong>
          <small>Roles · evidence · system checks</small>
        </div>
        <div className="command-panel command-panel-right">
          <span>System mesh</span>
          <strong>Documented</strong>
          <small>Admin · Analytics · Comms · Privacy · Studio</small>
        </div>
      </div>
    </section>
  );
}
