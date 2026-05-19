var systems = [
  ['URAI Admin', 'blocked', 'Internal control plane', 'Needs release evidence before production-ready claim'],
  ['URAI Analytics', 'not connected', 'Aggregate analytics status', 'Needs live health contract or approved deferral'],
  ['URAI Communications', 'not connected', 'Notification and messaging status', 'Needs live health contract or approved deferral'],
  ['URAI Privacy', 'not connected', 'Policy, retention, deletion, DPA evidence', 'Needs policy link verification'],
  ['URAI Foundation', 'not connected', 'Governance and ethical review evidence', 'Needs governance evidence contract'],
  ['URAI Spatial', 'not connected', 'Spatial/AR/VR system status', 'Needs status endpoint'],
  ['URAI Studio', 'not connected', 'Creative and asset operations', 'Needs production URL evidence'],
  ['URAI Asset Factory', 'not connected', 'Generated asset pipeline', 'Needs data boundary review'],
  ['URAI B2B Portal', 'not connected', 'Partner portal status', 'Needs partner access contract'],
];

export var metadata = {
  title: 'URAI Admin System Health',
  description: 'System-of-systems registry and health posture.',
};

export default function SystemPage() {
  return (
    <main>
      <h1>System Health</h1>
      <p>System-of-systems control panel. Systems without live health evidence are intentionally marked blocked or not connected.</p>
      <table>
        <thead>
          <tr>
            <th>System</th>
            <th>Status</th>
            <th>Boundary</th>
            <th>Next evidence required</th>
          </tr>
        </thead>
        <tbody>
          {systems.map(function (system) {
            return (
              <tr key={system[0]}>
                <td>{system[0]}</td>
                <td>{system[1]}</td>
                <td>{system[2]}</td>
                <td>{system[3]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
