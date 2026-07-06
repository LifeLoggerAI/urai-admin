export async function getSnapshot() {
  let registry;

  try {
    const res = await fetch('https://raw.githubusercontent.com/LifeLoggerAI/urai-admin/main/control-plane/registry.json');
    registry = await res.json();
  } catch (e) {
    registry = { services: [] };
  }

  const services = registry.services || [];

  const summary = {
    total: services.length,
    unknown: services.filter(s => !s.status || s.status === 'unknown').length
  };

  return {
    timestamp: Date.now(),
    services,
    summary
  };
}