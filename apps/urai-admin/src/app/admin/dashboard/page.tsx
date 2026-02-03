
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Jobs</h2>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Content</h2>
          <p className="text-3xl font-bold">78</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Job Failures (24h)</h2>
          <p className="text-3xl font-bold text-red-500">3</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <p>No errors to report.</p>
      </div>
    </div>
  );
}
