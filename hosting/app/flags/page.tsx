import Link from "next/link";

export default function Flags() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">URAI Admin</div>
        <nav>
          <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link>
          <Link href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Users</Link>
          <Link href="/flags" className="block py-2.5 px-4 rounded transition duration-200 bg-gray-700">Feature Flags</Link>
          <Link href="/incidents" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Incidents</Link>
          <Link href="/support" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Support</Link>
          <Link href="/audit" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Audit</Link>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Feature Flags</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">New Flag</button>
        </div>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Key</th>
                        <th className="py-3 px-6 text-left">Enabled</th>
                        <th className="py-3 px-6 text-left">Description</th>
                        <th className="py-3 px-6 text-left">Rollout</th>
                        <th className="py-3 px-6 text-left">Environments</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">new-dashboard</td>
                        <td className="py-3 px-6 text-left">Yes</td>
                        <td className="py-3 px-6 text-left">The new dashboard experience</td>
                        <td className="py-3 px-6 text-left">global</td>
                        <td className="py-3 px-6 text-left">staging, prod</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
