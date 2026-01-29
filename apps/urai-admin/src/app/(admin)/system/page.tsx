
'use client';

import React from 'react';
import ControlButton from './(components)/control-button';
import { useAuth } from '../../../../contexts/AuthContext';

const SystemPage = () => {
  const { idToken } = useAuth();

  const handleAction = async (action: string) => {
    if (!idToken) {
      console.error('No ID token found');
      return;
    }

    try {
      const response = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      console.log(`${action} successful`);
    } catch (error) {
      console.error(`Error performing action: ${action}`, error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">System Controls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ControlButton label="Toggle Maintenance Mode" action={() => handleAction('setMaintenanceMode')} />
        <ControlButton label="Toggle Jobs Paused" action={() => handleAction('toggleJobsPaused')} />
        <ControlButton label="Toggle Exports Paused" action={() => handleAction('toggleExportsPaused')} />
        <ControlButton label="Invalidate Foundation Config Cache" action={() => handleAction('invalidateFoundationConfigCache')} />
        <ControlButton label="Invalidate Jobs Cache" action={() => handleAction('invalidateJobsCache')} />
      </div>
    </div>
  );
};

export default SystemPage;
