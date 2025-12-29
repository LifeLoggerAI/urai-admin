import React from 'react';
import UserManagement from './components/UserManagement';
import FeatureFlags from './components/FeatureFlags';
import AuditLogs from './components/AuditLogs';
import Analytics from './components/Analytics';
import Replays from './components/Replays';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">URAI Admin</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1">
                <UserManagement />
              </div>
              <div className="col-span-1">
                <FeatureFlags />
              </div>
              <div className="col-span-1">
                <AuditLogs />
              </div>
              <div className="col-span-1">
                <Analytics />
              </div>
              <div className="col-span-2">
                <Replays />
              </div>
              <div className="col-span-2">
                <Notifications />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
