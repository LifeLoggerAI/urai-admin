
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { adminListAuditLogs } from '@/lib/firebase';

const LogDetailModal = ({ log, onClose }) => {
    if (!log) return null;

    const renderJson = (jsonString) => {
        try {
            const obj = JSON.parse(jsonString);
            return <pre className="bg-gray-800 text-white p-3 rounded-md text-xs whitespace-pre-wrap">{JSON.stringify(obj, null, 2)}</pre>;
        } catch (e) {
            return <p className='text-red-500'>Invalid JSON</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className='flex justify-between items-start'>
                    <h2 className="text-2xl font-bold mb-4">Audit Log Detail</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>&times;</button>
                </div>
                <div className='space-y-3 text-sm'>
                    <p><strong>Action:</strong> <span className='font-mono p-1 bg-gray-100 rounded'>{log.action}</span></p>
                    <p><strong>Actor:</strong> {log.actorUid} ({log.actorRole})</p>
                    <p><strong>Target:</strong> {log.target}</p>
                    <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                    {log.reason && <p><strong>Reason:</strong> {log.reason}</p>}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                        <div>
                            <h4 className='font-semibold mb-2'>Before</h4>
                            {renderJson(log.before)}
                        </div>
                        <div>
                            <h4 className='font-semibold mb-2'>After</h4>
                            {renderJson(log.after)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AuditingPage() {
  const [logs, setLogs] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursors, setCursors] = useImmer([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async (page) => {
    setLoading(true);
    setError('');
    try {
      const result = await adminListAuditLogs({ cursor: cursors[page], limit: 15 });
      const { logs: fetchedLogs, nextCursor } = result.data as any;
      
      setLogs(fetchedLogs || []);

      if (nextCursor && page === cursors.length - 1) {
        setCursors(draft => { draft.push(nextCursor) });
      }
      // If there is no next cursor, it means we are on the last page. 
      // We might need to remove any forward cursors if user went back and then to a new branch of pagination
      else if (!nextCursor && page < cursors.length -1){
        // This logic can be improved to handle branching pagination history
      }

    } catch (err: any) {
      console.error(err);
      setError(`Failed to fetch audit logs: ${err.message}`);
    }
    setLoading(false);
  }, [cursors, setLogs, setCursors]);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, fetchLogs]);

  return (
    <div>
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
        <h1 className="text-3xl font-bold mb-6">Admin Audit Log</h1>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={6} className="text-center py-8">Loading logs...</td></tr>
                    ) : logs.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8">No audit logs found.</td></tr>
                    ) : (
                        logs.map(log => (
                            <tr key={log.id} className='hover:bg-gray-50'>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 font-mono">{log.action}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.actorRole} ({log.actorUid.substring(0,6)}...)</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{log.target}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button onClick={() => setSelectedLog(log)} className="btn-secondary text-xs">View Details</button>
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
