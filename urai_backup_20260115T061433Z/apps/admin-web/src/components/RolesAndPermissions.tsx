
const roles = [
    { id: 'role-1', name: 'Super Admin', permissions: ['All'] },
    { id: 'role-2', name: 'Operator', permissions: ['Manage Users', 'Manage Content'] },
  ];
  
  export default function RolesAndPermissions() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Roles & Permissions</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Role</th>
              <th className="p-2">Permissions</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{role.name}</td>
                <td className="p-2">{role.permissions.join(', ')}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
