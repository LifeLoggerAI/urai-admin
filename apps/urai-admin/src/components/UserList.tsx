
'use client';

import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface User {
  uid: string;
  email: string;
  displayName: string;
  customClaims: { [key: string]: any };
  metadata: {
    lastSignInTime: string;
  };
}

export default function UserList() {
  const [currentUser] = useAuthState(auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        setCurrentUserRole(idTokenResult.claims.role);
      });
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        await fetch('/api/users/set-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ uid, role: newRole }),
        });
        // Refresh the user list to show the updated role
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <button onClick={fetchUsers}>Refresh Users</button>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Display Name</th>
            <th>Role</th>
            <th>Last Login</th>
            {currentUserRole === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.displayName}</td>
              <td>{user.customClaims?.role}</td>
              <td>{new Date(user.metadata.lastSignInTime).toLocaleString()}</td>
              {currentUserRole === 'admin' && (
                <td>
                  <select
                    value={user.customClaims?.role || 'viewer'}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                  >
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
  );
}
