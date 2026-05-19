var evidence = [
  ['Privacy boundary', 'documented', 'README, FINAL_LOCK, docs/SECURITY.md'],
  ['Raw telemetry restriction', 'documented', 'No raw consumer telemetry in admin without privacy review'],
  ['Admin accountability', 'partial', 'Immutable audit rules added; backend write verification still needed'],
  ['Owner approval', 'blocked', 'Required before production ready'],
  ['Monitoring and rollback', 'blocked', 'Evidence required in docs/EVIDENCE_LOG.md'],
];

export var metadata = {
  title: 'URAI Admin Governance',
  description: 'Governance, privacy, and release accountability evidence.',
};

export default function GovernancePage() {
  return (
    <main>
      <h1>Governance</h1>
      <p>Governance evidence for privacy, release accountability, and operational controls.</p>
      <table>
        <thead>
          <tr>
            <th>Control</th>
            <th>Status</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {evidence.map(function (item) {
            return (
              <tr key={item[0]}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
