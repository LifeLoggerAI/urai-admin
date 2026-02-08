
'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  target: { type: string; id: string };
  createdAt: string;
  metadata?: Record<string, any>;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/audit');
        if (!res.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data = await res.json();
        setLogs(data.logs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Timestamp</th>
              <th className="py-3 px-6 text-left">Actor</th>
              <th className="py-3 px-6 text-left">Action</th>
              <th className="py-3 px-6 text-left">Target</th>
              <th className="py-3 px-6 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">{log.actorEmail}</td>
                <td className="py-3 px-6 text-left">{log.action}</td>
                <td className="py-3 px-6 text-left">{log.target.type}: {log.target.id}</td>
                <td className="py-3 px-6 text-left">
                  {log.metadata ? (
                    <pre className="text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
