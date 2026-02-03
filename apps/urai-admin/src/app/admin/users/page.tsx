
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

interface AdminUser {
  uid: string;
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  createdAt: string;
  lastLoginAt: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const { role } = useRBAC();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${uid}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update role');
      }

      setUsers(users.map((u) => (u.uid === uid ? { ...u, role: newRole as any } : u)));
      alert('Role updated successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Last Login</th>
              {role === 'owner' && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((adminUser) => (
              <tr key={adminUser.uid} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{adminUser.email}</td>
                <td className="py-3 px-6 text-left">{adminUser.role}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(adminUser.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(adminUser.lastLoginAt).toLocaleDateString()}
                </td>
                {role === 'owner' && (
                  <td className="py-3 px-6 text-center">
                    <select
                      defaultValue={adminUser.role}
                      onChange={(e) => handleRoleChange(adminUser.uid, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
