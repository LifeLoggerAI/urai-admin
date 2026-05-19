var integrations = [
  ['Notification provider', 'not connected', 'Provider health endpoint and credentials audit required'],
  ['Transactional email', 'not connected', 'Delivery status contract required'],
  ['SMS or urgent alerts', 'not connected', 'Escalation policy and quiet-hours guard required'],
  ['Admin incident notifications', 'blocked', 'Monitoring and alerting evidence required'],
];

export var metadata = {
  title: 'URAI Admin Communications',
  description: 'Communications and notification integration status.',
};

export default function CommunicationsPage() {
  return (
    <main>
      <h1>Communications</h1>
      <p>Communications integrations must show not connected or blocked until a live contract and smoke evidence exists.</p>
      <table>
        <thead>
          <tr>
            <th>Integration</th>
            <th>Status</th>
            <th>Evidence required</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map(function (item) {
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
