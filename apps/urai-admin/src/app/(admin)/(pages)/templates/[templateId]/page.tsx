
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useImmer } from 'use-immer';
import { adminUpdateTemplate, adminGetTemplateVersions, adminRollbackTemplate } from '@/lib/firebase';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function TemplateEditPage() {
  const { templateId } = useParams();
  const router = useRouter();
  const { role } = useAdminAuth();
  const [content, setContent] = useState('');
  const [reason, setReason] = useState('');
  const [versions, setVersions] = useImmer([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isNew = templateId === 'new';
  const canEdit = role === 'superadmin' || role === 'admin';

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      adminGetTemplateVersions({ templateId, limit: 1 })
        .then((result: any) => {
          if (result.data.versions.length > 0) {
            setContent(JSON.stringify(result.data.versions[0].content, null, 2));
          }
          setLoading(false);
        })
        .catch(err => {
          setError(`Failed to load template: ${err.message}`);
          setLoading(false);
        });

      adminGetTemplateVersions({ templateId, limit: 10 })
        .then((result: any) => setVersions(result.data.versions || []));
    }
  }, [templateId, isNew, setVersions]);

  const handleSave = async () => {
    if (!canEdit) {
      alert('Permission denied.');
      return;
    }
    if (!reason) {
      alert('A reason is required to save changes.');
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      alert('Invalid JSON content.');
      return;
    }

    setLoading(true);
    try {
      await adminUpdateTemplate({ templateId, content: parsedContent, reason });
      alert('Template saved successfully!');
      router.push('/templates');
    } catch (err: any) {
      setError(`Failed to save template: ${err.message}`);
    }
    setLoading(false);
  };

  const handleRollback = async (versionId: string) => {
    const rollbackReason = prompt(`Reason for rolling back to version ${versionId}?`);
    if (!rollbackReason) return;

    setLoading(true);
    try {
      await adminRollbackTemplate({ templateId, versionId, reason: rollbackReason });
      alert('Rollback successful! A new version has been created with the old content.');
      router.push('/templates');
    } catch (err: any) {
      setError(`Failed to roll back: ${err.message}`);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isNew ? 'Create New Template' : `Edit Template: ${templateId}`}</h1>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 shadow-md rounded-lg">
          <textarea
            className="w-full h-96 p-2 border rounded font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='Enter template content as JSON...'
            disabled={!canEdit || loading}
          />
          <input 
            type="text"
            className="input w-full mt-4"
            placeholder="Reason for this change (required)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            disabled={!canEdit || loading}
          />
          <button onClick={handleSave} className="btn-primary mt-4" disabled={!canEdit || loading}>
            {loading ? 'Saving...' : 'Save Template'}
          </button>
        </div>

        {!isNew && (
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Version History</h2>
            {versions.length > 0 ? (
              <ul className="space-y-3">
                {versions.map((v: any) => (
                  <li key={v.id} className='p-3 border rounded-md text-sm'>
                    <p><strong>Version:</strong> {v.version}</p>
                    <p><strong>Created:</strong> {new Date(v.createdAt).toLocaleString()}</p>
                    <p><strong>By:</strong> <span className='font-mono'>{v.createdBy}</span></p>
                    <p><strong>Reason:</strong> {v.reason}</p>
                    {canEdit && <button onClick={() => handleRollback(v.id)} className='btn-secondary mt-2' disabled={loading}>Rollback to this version</button>}
                  </li>
                ))}
              </ul>
            ) : <p>No versions found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
