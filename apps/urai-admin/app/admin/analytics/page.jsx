var analyticsControls = [
  ['Aggregate dashboard status', 'partial', 'Workspace analytics scripts exist; live status card evidence required'],
  ['Raw telemetry boundary', 'documented', 'Admin may not expose raw passive telemetry without privacy review'],
  ['Analytics job health', 'not connected', 'Health endpoint and last run evidence required'],
  ['Event taxonomy', 'blocked', 'admin_ event taxonomy and redaction check required'],
];

export var metadata = {
  title: 'URAI Admin Analytics',
  description: 'Analytics integration status and privacy posture.',
};

export default function AnalyticsPage() {
  return (
    <main>
      <h1>Analytics</h1>
      <p>Analytics surfaces in URAI Admin are limited to aggregate status and operational health unless a privacy review approves additional fields.</p>
      <table>
        <thead>
          <tr>
            <th>Control</th>
            <th>Status</th>
            <th>Evidence required</th>
          </tr>
        </thead>
        <tbody>
          {analyticsControls.map(function (item) {
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
