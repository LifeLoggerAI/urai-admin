
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome, {user?.email}!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Jobs</h2>
          <p className="text-3xl font-bold">56</p>
        </div>

        {/* Recent Content Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Content Items</h2>
          <p className="text-3xl font-bold">78</p>
        </div>

        {/* Job Failures (Last 24h) */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-2">Job Failures (Last 24h)</h2>
          <p className="text-3xl font-bold text-red-500">3</p>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-2">System Health</h2>
          <div className="text-sm text-gray-600"><p>No errors reported in the last hour.</p></div>
        </div>
      </div>
    </div>
  );
}
