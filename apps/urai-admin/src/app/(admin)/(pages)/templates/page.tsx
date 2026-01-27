
'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useImmer } from 'use-immer';
import { adminListTemplates } from '@/lib/firebase';

export default function TemplatesListPage() {
  const [templates, setTemplates] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursors, setCursors] = useImmer([null]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchTemplates = useCallback(async (page) => {
    setLoading(true);
    setError('');
    try {
      const result = await adminListTemplates({ cursor: cursors[page], limit: 20 });
      const { templates: fetchedTemplates, nextCursor } = result.data as any;
      
      setTemplates(fetchedTemplates || []);

      if (nextCursor && page === cursors.length - 1) {
        setCursors(draft => { draft.push(nextCursor) });
      }
    } catch (err: any) {
      console.error(err);
      setError(`Failed to fetch templates: ${err.message}`);
    }
    setLoading(false);
  }, [cursors, setTemplates, setCursors]);

  useEffect(() => {
    fetchTemplates(currentPage);
  }, [currentPage, fetchTemplates]);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Film Templates</h1>
        <Link href="/templates/new" className="btn-primary">Create Template</Link>
      </div>

      {error && <p class="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      <div class="bg-white shadow-md rounded-lg overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated By</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} class="text-center py-8">Loading templates...</td></tr>
            ) : templates.length === 0 ? (
              <tr><td colSpan={5} class="text-center py-8">No templates found.</td></tr>
            ) : (
              templates.map((template: any) => (
                <tr key={template.id}>
                  <td class="px-6 py-4 font-mono">{template.id}</td>
                  <td class="px-6 py-4">{new Date(template.updatedAt).toLocaleString()}</td>
                  <td class="px-6 py-4 font-mono">{template.updatedBy}</td>
                  <td class="px-6 py-4">{template.version}</td>
                  <td class="px-6 py-4 text-right">
                    <Link href={`/templates/${template.id}`} className="btn-secondary">Manage</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0 || loading} className="btn-secondary">Previous</button>
        <span>Page {currentPage + 1}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= cursors.length - 1 || loading || templates.length === 0} className="btn-secondary">Next</button>
      </div>
    </div>
  );
}
