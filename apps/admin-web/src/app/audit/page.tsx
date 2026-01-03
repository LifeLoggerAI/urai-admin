
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AuditPage = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'auditLogs'));
      const logsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAuditLogs(logsData);
      setLoading(false);
    };

    fetchAuditLogs();
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
            <th>Actor UID</th>
            <th>Action</th>
            <th>Target Type</th>
            <th>Target ID</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.actorUid}</td>
              <td>{log.action}</td>
              <td>{log.targetType}</td>
              <td>{log.targetId}</td>
              <td>{log.createdAt.toDate().toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditPage;
