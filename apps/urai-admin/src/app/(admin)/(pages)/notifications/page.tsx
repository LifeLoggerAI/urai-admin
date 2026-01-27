
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { adminListNotificationLogs, adminRetryNotification, adminGetProviderStatus } from '@/lib/firebase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDebounce } from '@/hooks/useDebounce';

const ProviderStatus = () => {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminGetProviderStatus()
            .then(result => setStatus(result.data))
            .catch(err => console.error("Couldn't get provider status", err))
            .finally(() => setLoading(false));
    }, []);

    const StatusIndicator = ({ status }) => {
        const color = status === 'operational' ? 'bg-green-500' : 'bg-yellow-500';
        return <span className={`w-3 h-3 rounded-full inline-block ${color}`} title={status}></span>;
    }

    return (
        <div className='mb-6 p-4 border rounded-lg bg-white shadow-sm'>
            <h2 className="text-xl font-semibold mb-3">Notification Provider Status</h2>
            {loading ? <p>Loading status...</p> : status ? (
                 <div className='flex space-x-6 text-sm'>
                    {Object.entries(status).map(([provider, details]: [string, any]) => (
                        <div key={provider}>
                           <span className='mr-2 font-bold capitalize'>{provider}:</span>
                           <StatusIndicator status={details.status} />
                           <span className='ml-2 text-gray-600'>{details.status}</span>
                        </div>
                    ))}
                 </div>
            ) : <p>Could not load provider status.</p>}
        </div>
    );
}


export default function NotificationsPage() {
  const { role } = useAdminAuth();
  const [logs, setLogs] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursors, setCursors] = useImmer([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useImmer({ status: '', userId: '' });
  const debouncedFilters = useDebounce(filters, 500);

  const canRetry = role === 'superadmin' || role === 'admin' || role === 'support';

  const fetchLogs = useCallback(async (page, newFilters) => {
    setLoading(true);
    setError('');
    try {
        const result = await adminListNotificationLogs({ 
            cursor: cursors[page],
            limit: 20,
            status: newFilters.status || null,
            userId: newFilters.userId || null,
        });
        const { logs: fetchedLogs, nextCursor } = result.data as any;
        
        setLogs(fetchedLogs || []);

        if (nextCursor && page === cursors.length - 1) {
            setCursors(draft => { draft.push(nextCursor) });
        }
    } catch (err: any) {
        console.error(err);
        setError(`Failed to fetch notification logs: ${err.message}`);
    }
    setLoading(false);
  }, [cursors, setLogs, setCursors]);

  useEffect(() => {
    setCurrentPage(0);
    setCursors([null]);
    fetchLogs(0, debouncedFilters);
  }, [debouncedFilters, fetchLogs, setCursors]);

  const handleRetry = async (logId: string) => {
      const reason = prompt('Reason for retrying this notification?');
      if (!reason) return;
      try {
          await adminRetryNotification({ logId, reason });
          alert('Notification queued for retry.');
          fetchLogs(currentPage, filters);
      } catch (err: any) {
          alert(`Failed to retry notification: ${err.message}`);
      }
  }

  const getStatusPill = (status) => {
      const colors = {
          'sent': 'bg-green-100 text-green-800',
          'failed': 'bg-red-100 text-red-800',
          'retrying': 'bg-yellow-100 text-yellow-800',
          'queued': 'bg-blue-100 text-blue-800'
      }
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>{status}</span>
  }

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <ProviderStatus />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Filter by User ID" value={filters.userId} onChange={e => setFilters(d => {d.userId = e.target.value})} className="input" />
            <input type="text" placeholder="Filter by Status (e.g., failed)" value={filters.status} onChange={e => setFilters(d => {d.status = e.target.value})} className="input" />
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={5} className="text-center py-8">Loading logs...</td></tr>
                    ) : logs.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-8">No logs found.</td></tr>
                    ) : (
                        logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4">{log.userId}</td>
                                <td className="px-6 py-4">{log.type}</td>
                                <td className="px-6 py-4">{getStatusPill(log.status)}</td>
                                <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 space-x-2">
                                    {canRetry && log.status === 'failed' && <button onClick={() => handleRetry(log.id)} className='btn-secondary'>Retry</button>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        <div className="flex justify-between items-center mt-4">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0 || loading} className="btn-secondary">Previous</button>
            <span>Page {currentPage + 1}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= cursors.length -1 || loading || logs.length === 0} className="btn-secondary">Next</button>
        </div>
    </div>
  );
}
