export async function checkService(service) {
  try {
    if (!service.endpoint) return { ...service, status: 'unknown' };

    const res = await fetch(service.endpoint);

    if (res.ok) return { ...service, status: 'healthy' };

    return { ...service, status: 'degraded' };
  } catch (e) {
    return { ...service, status: 'offline' };
  }
}

export async function checkAll(services) {
  const results = await Promise.all(services.map(checkService));

  return {
    timestamp: Date.now(),
    services: results,
    summary: {
      total: results.length,
      healthy: results.filter(s => s.status === 'healthy').length,
      degraded: results.filter(s => s.status === 'degraded').length,
      offline: results.filter(s => s.status === 'offline').length
    }
  };
}