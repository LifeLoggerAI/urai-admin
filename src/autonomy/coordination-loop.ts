export type SystemRegistry = {
  services: Array<{ name: string; status: string; lastSeen?: number }>
};

export type SystemSnapshot = {
  timestamp: number;
  serviceCount: number;
  healthy: number;
  degraded: number;
  offline: number;
};

function evaluateSnapshot(registry: SystemRegistry): SystemSnapshot {
  let healthy = 0;
  let degraded = 0;
  let offline = 0;

  for (const s of registry.services) {
    if (s.status === "healthy") healthy++;
    else if (s.status === "degraded") degraded++;
    else offline++;
  }

  return {
    timestamp: Date.now(),
    serviceCount: registry.services.length,
    healthy,
    degraded,
    offline
  };
}

async function loadRegistry(): Promise<SystemRegistry> {
  return {
    services: []
  };
}

export function startCoordinationLoop(intervalMs = 5000) {
  console.log("[URAI] Coordination loop starting...");

  setInterval(async () => {
    try {
      const registry = await loadRegistry();
      const snapshot = evaluateSnapshot(registry);

      console.log("[URAI SNAPSHOT]", JSON.stringify(snapshot));

      // future hooks:
      // - update dashboard
      // - trigger remediation
      // - persist state

    } catch (err) {
      console.error("[URAI LOOP ERROR]", err);
    }
  }, intervalMs);
}