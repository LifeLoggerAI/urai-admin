
'use client';
import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { adminGetSystemStatus, adminUpdateSystemStatus } from '@/lib/firebase';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function SystemControlPage() {
  const { role } = useAdminAuth();
  const [status, setStatus] = useImmer(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canEdit = role === 'superadmin' || role === 'admin';

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const result = await adminGetSystemStatus();
        setStatus(result.data as any);
      } catch (err: any) {
        setError(`Failed to fetch system status: ${err.message}`);
      }
      setLoading(false);
    };
    fetchStatus();
  }, [setStatus]);

  const handleUpdate = async (key: string, value: boolean) => {
    if (!canEdit) return;
    const reason = prompt(`Reason for changing ${key}?`);
    if (!reason) return;

    const newStatus = { ...status, [key]: value };

    try {
      await adminUpdateSystemStatus({ newStatus, reason });
      setStatus(newStatus);
      alert('Status updated successfully!');
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) return <div>Loading System Status...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!status) return <div>No system status found.</div>

  const Toggle = ({ field, label, description }) => (
    <div className='flex items-center justify-between p-4 border-b'>
        <div>
            <h4 className='font-bold'>{label}</h4>
            <p className='text-sm text-gray-600'>{description}</p>
        </div>
        <label className='switch'>
            <input 
                type='checkbox' 
                checked={status[field]} 
                onChange={(e) => handleUpdate(field, e.target.checked)} 
                disabled={!canEdit}
            />
            <span className='slider round'></span>
        </label>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">System Control</h1>
      <div className="bg-white shadow-md rounded-lg">
        <Toggle 
            field="isMaintenanceMode"
            label="Maintenance Mode"
            description="Put the platform in maintenance mode. All public access will be disabled."
        />
        <Toggle 
            field="isGlobalKillSwitchActive"
            label="Global Kill Switch"
            description="Immediately halt all jobs and user actions. Use only in emergencies."
        />
         <div className='p-4 border-b'>
            <h4 className='font-bold'>Concurrency Limits</h4>
            <p className='text-sm text-gray-600 mb-2'>Max concurrent jobs allowed system-wide.</p>
            {canEdit ? (
                <input 
                    type="number" 
                    defaultValue={status.concurrencyLimit || 10} 
                    onBlur={(e) => handleUpdate('concurrencyLimit', parseInt(e.target.value, 10))}
                    className="input"
                />
            ) : (
                <p className='text-lg font-mono bg-gray-100 p-2 rounded inline-block'>{status.concurrencyLimit || 10}</p>
            )}
        </div>
        <div className='p-4'>
            <h4 className='font-bold'>Environment Variables (Read-only)</h4>
            <div className='text-sm bg-gray-900 text-white font-mono p-4 rounded-md mt-2 overflow-x-auto'>
                <pre>
                    PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}\n
                    AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
}
