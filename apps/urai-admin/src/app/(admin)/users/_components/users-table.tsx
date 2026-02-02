
interface User {
  uid: string;
  email: string;
  createdAt: string;
  lastSeen: string;
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="p-2">UID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-t">
              <td className="p-2">{user.uid}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.createdAt}</td>
              <td className="p-2">{user.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
