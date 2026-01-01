
const users = [
    { id: 'user-123', status: 'Active', tier: 'Premium', devices: 2, lastActivity: '2 hours ago', risk: 'None' },
    { id: 'user-456', status: 'Suspended', tier: 'Free', devices: 1, lastActivity: '1 day ago', risk: 'High' },
  ];
  
  export default function UserIntelligence() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">User Intelligence</h2>
        <div className="mb-4">
          <input type="text" placeholder="Search users..." className="w-full p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">User ID</th>
              <th className="p-2">Status</th>
              <th className="p-2">Tier</th>
              <th className="p-2">Devices</th>
              <th className="p-2">Last Activity</th>
              <th className="p-2">Risk</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.status}</td>
                <td className="p-2">{user.tier}</td>
                <td className="p-2">{user.devices}</td>
                <td className="p-2">{user.lastActivity}</td>
                <td className="p-2">{user.risk}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
