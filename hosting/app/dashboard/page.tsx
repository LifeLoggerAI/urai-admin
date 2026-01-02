import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">URAI Admin</div>
        <nav>
          <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-gray-700">Dashboard</Link>
          <Link href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Users</Link>
          <Link href="/flags" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Feature Flags</Link>
          <Link href="/incidents" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Incidents</Link>
          <Link href="/support" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Support</Link>
          <Link href="/audit" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Audit</Link>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Incidents</h2>
            <p className="text-gray-700">3 Open</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">System Health</h2>
            <p className="text-gray-700">All systems normal</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Feature Flags</h2>
            <p className="text-gray-700">5 Active</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Support Cases</h2>
            <p className="text-gray-700">12 Open</p>
          </div>
        </div>
      </div>
    </div>
  );
}
