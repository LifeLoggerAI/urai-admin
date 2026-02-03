'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logsCollection = collection(db, 'auditLogs');
      const logsSnapshot = await getDocs(logsCollection);
      const logsList = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsList);
    };

    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <DataTable columns={columns} data={logs} />
    </div>
  );
}
