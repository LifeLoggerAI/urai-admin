import { db } from '@/lib/firebase-admin';

async function getAuditLogs() {
  const snapshot = await db.collection('auditLogs').orderBy('ts', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AuditPage() {
  const auditLogs = await getAuditLogs();

  return (
    <div>
      <h1>Audit Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map(log => (
            <tr key={log.id}>
              <td>{log.ts?.toDate().toLocaleString()}</td>
              <td>{log.actor}</td>
              <td>{log.action}</td>
              <td>{log.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
