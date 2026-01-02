import Link from "next/link";

export default function Support() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">URAI Admin</div>
        <nav>
          <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link>
          <Link href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Users</Link>
          <Link href="/flags" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Feature Flags</Link>
          <Link href="/incidents" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Incidents</Link>
          <Link href="/support" className="block py-2.5 px-4 rounded transition duration-200 bg-gray-700">Support</Link>
          <Link href="/audit" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Audit</Link>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Support Cases</h1>
      </div>
    </div>
  );
}
