import { db } from '@/lib/firebase-admin';

var fallbackSystems = [
  {
    name: 'URAI Admin',
    status: 'blocked',
    dataBoundary: 'Internal control plane',
    knownBlockers: ['Needs release evidence before production-ready claim'],
  },
  {
    name: 'URAI Analytics',
    status: 'not_connected',
    dataBoundary: 'Aggregate analytics status only',
    knownBlockers: ['Needs live health contract or approved deferral'],
  },
  {
    name: 'URAI Communications',
    status: 'not_connected',
    dataBoundary: 'Notification and messaging status only',
    knownBlockers: ['Needs live health contract or approved deferral'],
  },
  {
    name: 'URAI Privacy',
    status: 'not_connected',
    dataBoundary: 'Policy, retention, deletion, DPA evidence',
    knownBlockers: ['Needs policy link verification'],
  },
  {
    name: 'URAI Foundation',
    status: 'not_connected',
    dataBoundary: 'Governance and ethical review evidence',
    knownBlockers: ['Needs governance evidence contract'],
  },
  {
    name: 'URAI Spatial',
    status: 'not_connected',
    dataBoundary: 'Spatial metadata only unless approved',
    knownBlockers: ['Needs status endpoint'],
  },
  {
    name: 'URAI Studio',
    status: 'not_connected',
    dataBoundary: 'Creative asset metadata',
    knownBlockers: ['Needs production URL evidence'],
  },
  {
    name: 'URAI Asset Factory',
    status: 'not_connected',
    dataBoundary: 'Asset metadata and approved generated assets only',
    knownBlockers: ['Needs data boundary review'],
  },
  {
    name: 'URAI B2B Portal',
    status: 'not_connected',
    dataBoundary: 'Partner/account metadata only',
    knownBlockers: ['Needs partner access contract'],
  },
];

async function getSystemRegistry() {
  try {
    var snapshot = await db.collection('systemRegistry').orderBy('name', 'asc').get();
    if (snapshot.empty) {
      return { source: 'fallback', systems: fallbackSystems };
    }

    return {
      source: 'firestore:systemRegistry',
      systems: snapshot.docs.map(function (doc) {
        var data = doc.data();
        return {
          id: doc.id,
          name: data.name || doc.id,
          status: data.status || 'unknown',
          dataBoundary: data.dataBoundary || 'Not documented',
          knownBlockers: Array.isArray(data.knownBlockers) ? data.knownBlockers : [],
          healthEndpoint: data.healthEndpoint || '',
          productionUrl: data.productionUrl || '',
          lastSmokeResult: data.lastSmokeResult || 'unknown',
          operationalRisk: data.operationalRisk || 'unknown',
        };
      }),
    };
  } catch (error) {
    console.error('Unable to read systemRegistry. Rendering safe fallback.', error);
    return { source: 'fallback', systems: fallbackSystems };
  }
}

export var metadata = {
  title: 'URAI Admin System Health',
  description: 'System-of-systems registry and health posture.',
};

export default async function SystemPage() {
  var registry = await getSystemRegistry();

  return (
    <main>
      <h1>System Health</h1>
      <p>System-of-systems control panel. Systems without live health evidence are intentionally marked blocked or not connected.</p>
      <p>Source: {registry.source}</p>
      <table>
        <thead>
          <tr>
            <th>System</th>
            <th>Status</th>
            <th>Boundary</th>
            <th>Health endpoint</th>
            <th>Last smoke</th>
            <th>Risk</th>
            <th>Next evidence required</th>
          </tr>
        </thead>
        <tbody>
          {registry.systems.map(function (system) {
            var blockers = system.knownBlockers && system.knownBlockers.length ? system.knownBlockers.join('; ') : 'No live blocker evidence recorded';
            return (
              <tr key={system.id || system.name}>
                <td>{system.name}</td>
                <td>{system.status}</td>
                <td>{system.dataBoundary}</td>
                <td>{system.healthEndpoint || 'Not connected'}</td>
                <td>{system.lastSmokeResult || 'unknown'}</td>
                <td>{system.operationalRisk || 'unknown'}</td>
                <td>{blockers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
