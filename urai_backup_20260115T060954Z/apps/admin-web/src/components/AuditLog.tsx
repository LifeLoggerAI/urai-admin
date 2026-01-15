
const auditLogs = [
    { id: 'log-1', timestamp: '2023-10-27T10:00:00Z', actor: 'admin@urai.com', action: 'Suspended user', target: 'user-123' },
    { id: 'log-2', timestamp: '2023-10-27T10:05:00Z', actor: 'admin@urai.com', action: 'Changed model config', target: 'model-1' },
  ];
  
  export default function AuditLog() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Audit Log</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Timestamp</th>
              <th className="p-2">Actor</th>
              <th className="p-2">Action</th>
              <th className="p-2">Target</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{log.timestamp}</td>
                <td className="p-2">{log.actor}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
