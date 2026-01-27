
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { adminListRenders, adminQueueAssetCleanup } from '@/lib/firebase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDebounce } from '@/hooks/useDebounce';

const RenderDetailModal = ({ render, onClose }) => {
    if (!render) return null;

    const getUrlList = (urls) => {
        if (!urls) return <p>No URLs</p>;
        if (Array.isArray(urls)) {
            return (
                <ul className='list-disc pl-5'>
                    {urls.map((url, i) => <li key={i}><a href={url} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>Asset {i+1}</a></li>)}
                </ul>
            );
        }
        if (typeof urls === 'object'){
            return (
                <ul className='list-disc pl-5'>
                   {Object.entries(urls).map(([key, value]) => <li key={key}><strong>{key}:</strong> <a href={value as string} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>Link</a></li>)}
                </ul>
            )
        }
        return <a href={urls} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>View Asset</a>
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                 <div className='flex justify-between items-start'>
                    <h2 className="text-2xl font-bold mb-4">Render Detail</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>&times;</button>
                </div>
                <div className='space-y-3 text-sm'>
                    <p><strong>ID:</strong> <span className='font-mono'>{render.id}</span></p>
                    <p><strong>User:</strong> {render.uid}</p>
                    <p><strong>Run ID:</strong> {render.runId}</p>
                    <p><strong>Created At:</strong> {new Date(render.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {render.status}</p>
                    <div className='mt-4'>
                        <h4 className='font-semibold mb-2'>Asset URLs</h4>
                        {getUrlList(render.assetUrls)}
                    </div>
                    {render.error && <div className='mt-4'>
                        <h4 className='font-semibold text-red-600 mb-2'>Error</h4>
                        <p className='text-red-500 text-xs'>{render.error}</p>
                    </div>}
                </div>
            </div>
        </div>
    );
};


export default function RendersPage() {
  const { role } = useAdminAuth();
  const [renders, setRenders] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursors, setCursors] = useImmer([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRender, setSelectedRender] = useState(null);
  const [filters, setFilters] = useImmer({ uid: '', runId: '' });
  const debouncedFilters = useDebounce(filters, 500);

  const canCleanup = role === 'superadmin' || role === 'admin';

  const fetchRenders = useCallback(async (page, newFilters) => {
    setLoading(true);
    setError('');
    try {
        const result = await adminListRenders({ 
            cursor: cursors[page],
            limit: 15,
            uid: newFilters.uid || null,
            runId: newFilters.runId || null,
        });
        const { renders: fetchedRenders, nextCursor } = result.data as any;
        
        setRenders(fetchedRenders || []);

        if (nextCursor && page === cursors.length - 1) {
            setCursors(draft => { draft.push(nextCursor) });
        }
    } catch (err: any) {
        console.error(err);
        setError(`Failed to fetch renders: ${err.message}`);
    }
    setLoading(false);
  }, [cursors, setRenders, setCursors]);

  useEffect(() => {
    setCurrentPage(0);
    setCursors([null]);
    fetchRenders(0, debouncedFilters);
  }, [debouncedFilters, fetchRenders, setCursors]);

  const handleCleanup = async (assetId: string) => {
      const reason = prompt('Please provide a reason for this cleanup action:');
      if (!reason) return;
      try {
          await adminQueueAssetCleanup({ assetId, reason });
          alert('Cleanup job queued successfully!');
          fetchRenders(currentPage, filters);
      } catch (err: any) {
          alert(`Failed to queue cleanup job: ${err.message}`);
      }
  }

  return (
    <div>
        <RenderDetailModal render={selectedRender} onClose={() => setSelectedRender(null)} />
        <h1 className="text-3xl font-bold mb-6">Asset Renders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Filter by User ID" value={filters.uid} onChange={e => setFilters(draft => { draft.uid = e.target.value })} className="input" />
            <input type="text" placeholder="Filter by Run ID" value={filters.runId} onChange={e => setFilters(draft => { draft.runId = e.target.value })} className="input" />
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset ID</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Run</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                         <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={6} className="text-center py-8">Loading renders...</td></tr>
                    ) : renders.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8">No renders found.</td></tr>
                    ) : (
                        renders.map(render => (
                            <tr key={render.id}>
                                <td className='px-6 py-4 font-mono'><a href='#' onClick={() => setSelectedRender(render)} className='text-blue-600'>{render.id.substring(0,8)}...</a></td>
                                <td className='px-6 py-4 font-mono'>{render.uid.substring(0,6)}...</td>
                                <td className='px-6 py-4 font-mono'>{render.runId.substring(0,6)}...</td>
                                <td className='px-6 py-4'><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${render.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{render.status}</span></td>
                                <td className='px-6 py-4'>{new Date(render.createdAt).toLocaleDateString()}</td>
                                <td className='px-6 py-4 space-x-2'>
                                    {canCleanup && <button onClick={() => handleCleanup(render.id)} className='btn-danger'>Cleanup</button>}
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
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= cursors.length -1 || loading || renders.length === 0} className="btn-secondary">Next</button>
        </div>
    </div>
  );
}
