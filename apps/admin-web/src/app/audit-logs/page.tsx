
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const db = getFirestore();
      const logsCollection = collection(db, 'auditLogs');
      const logSnapshot = await getDocs(logsCollection);
      const logList = logSnapshot.docs.map(doc => doc.data());
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
