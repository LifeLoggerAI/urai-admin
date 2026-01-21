
export default function OverviewPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Global System Health</h2>
          <p>System status: All systems nominal.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Active Users</h2>
          <p>24h: 1,234</p>
          <p>7d: 5,678</p>
          <p>30d: 12,345</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Jobs</h2>
          <p>Running: 12</p>
          <p>Failed: 1</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">AI Systems</h2>
          <p>Online: 3</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Alerts & Warnings</h2>
          <p>No new alerts.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Revenue</h2>
          <p>Snapshot: $1,234.56</p>
        </div>
      </div>
    </div>
  );
}
