'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, Timestamp } from 'firebase/firestore';

interface AuditLog {
  actorUid: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: Timestamp;
}

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const db = getFirestore();
      const logsCollection = collection(db, 'auditLogs');
      const logSnapshot = await getDocs(logsCollection);
      const logList = logSnapshot.docs.map(doc => doc.data() as AuditLog);
      setLogs(logList);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Audit Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.actorUid}</td>
              <td>{log.action}</td>
              <td>{log.targetType}: {log.targetId}</td>
              <td>{log.createdAt.toDate().toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsPage;
