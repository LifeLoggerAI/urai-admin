
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { adminListExecutionRuns, adminPauseRun, adminResumeRun, adminCancelRun, adminRerun } from '@/lib/firebase';
import { useAdminAuth, Role } from '@/hooks/useAdminAuth';

const RunDetailModal = ({ run, onClose }) => {
    if (!run) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className='flex justify-between items-start'>
                    <h2 className="text-2xl font-bold mb-4">Run Detail: <span className='font-mono'>{run.id}</span></h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>&times;</button>
                </div>
                <div className='space-y-4 text-sm'>
                    <div className='grid grid-cols-2 gap-4'>
                        <p><strong>Status:</strong> {run.status}</p>
                        <p><strong>Intent:</strong> {run.intent}</p>
                        <p><strong>User:</strong> {run.uid}</p>
                        <p><strong>Created:</strong> {new Date(run.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Manifest</h4>
                        <pre className="bg-gray-800 text-white p-3 rounded-md text-xs whitespace-pre-wrap">{JSON.stringify(run.manifest, null, 2)}</pre>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Phases</h4>
                        <div className='space-y-2'>
                        {(run.phases || []).map((phase, i) => (
                            <div key={i} className='p-2 border rounded-md bg-gray-50'>
                                <p><strong>{phase.name}</strong> - <span className='capitalize'>{phase.status}</span> ({phase.durationMs}ms)</p>
                                {phase.error && <p className='text-red-500 text-xs mt-1'>{phase.error}</p>}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function RunsPage() {
  const { role } = useAdminAuth();
  const [runs, setRuns] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursors, setCursors] = useImmer([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRun, setSelectedRun] = useState(null);
  const [filters, setFilters] = useImmer({ status: '', intent: '', version: ''});

  const canTakeAction = role === 'superadmin' || role === 'admin';
  const canTakeDestructiveAction = role === 'superadmin';

  const fetchRuns = useCallback(async (page, newFilters) => {
    setLoading(true);
    setError('');
    try {
      const result = await adminListExecutionRuns({ 
          cursor: cursors[page],
          limit: 15,
          ...newFilters
      });
      const { runs: fetchedRuns, nextCursor } = result.data as any;
      
      setRuns(fetchedRuns || []);

      if (nextCursor && page === cursors.length - 1) {
        setCursors(draft => { draft.push(nextCursor) });
      } 
    } catch (err: any) {
      console.error(err);
      setError(`Failed to fetch runs: ${err.message}`);
    }
    setLoading(false);
  }, [cursors, setRuns, setCursors]);

  useEffect(() => {
    // Reset pagination when filters change
    setCurrentPage(0);
    setCursors([null]);
    fetchRuns(0, filters);
  }, [filters, fetchRuns, setCursors]);

  const handleAction = async (action: Function, runId: string, successMessage: string) => {
      const reason = prompt(`Reason for this action?`);
      if(!reason) return;
      try {
          await action({ runId, reason });
          alert(successMessage);
          fetchRuns(currentPage, filters); // Refresh data
      } catch (err: any) { alert(`Action failed: ${err.message}`) }
  }

  return (
    <div>
      <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />
      <h1 className="text-3xl font-bold mb-6">Execution Runs</h1>

      <div className='grid grid-cols-3 gap-4 mb-4'>
        <input placeholder='Filter by Status' onChange={e => setFilters(d => {d.status = e.target.value})} className='input' />
        <input placeholder='Filter by Intent' onChange={e => setFilters(d => {d.intent = e.target.value})} className='input' />
        <input placeholder='Filter by Version' onChange={e => setFilters(d => {d.version = e.target.value})} className='input' />
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">{/* ... table head ... */}</thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading runs...</td></tr>
            ) : runs.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8">No runs found for the current filters.</td></tr>
            ) : (
                runs.map(run => (
                    <tr key={run.id} className='hover:bg-gray-50'>
                        <td className="px-6 py-4 font-mono"><a href="#" onClick={() => setSelectedRun(run)} className='text-blue-600'>{run.id.substring(0, 8)}...</a></td>
                        <td>{run.uid.substring(0, 6)}...</td>
                        <td>{run.status}</td>
                        <td>{run.intent}</td>
                        <td>{run.manifest?.version}</td>
                        <td>{new Date(run.createdAt).toLocaleDateString()}</td>
                        <td className='space-x-2'>
                           {canTakeAction && run.status === 'running' && <button onClick={() => handleAction(adminPauseRun, run.id, 'Run paused')} className='btn-secondary'>Pause</button>}
                           {canTakeAction && run.status === 'paused' && <button onClick={() => handleAction(adminResumeRun, run.id, 'Run resumed')} className='btn-secondary'>Resume</button>}
                           {canTakeDestructiveAction && <button onClick={() => handleAction(adminCancelRun, run.id, 'Run canceled')} className='btn-danger'>Cancel</button>}
                           {canTakeDestructiveAction && <button onClick={() => handleAction(adminRerun, run.id, 'Run re-queued')} className='btn-primary'>Rerun</button>}
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
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= cursors.length -1 || loading || runs.length === 0} className="btn-secondary">Next</button>
      </div>
    </div>
  );
}
