'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface User {
  uid: string;
  email: string;
}

interface ListUsersResult {
  users: User[];
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const functions = getFunctions();
      const adminListUsers = httpsCallable(functions, 'adminListUsers');
      const result = await adminListUsers();
      const data = result.data as ListUsersResult;
      setUsers(data.users);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleDeactivateUser = async (uid: string) => {
    const functions = getFunctions();
    const adminDeactivateUser = httpsCallable(functions, 'adminDeactivateUser');
    await adminDeactivateUser({ uid });
    // Refresh the user list
    const adminListUsers = httpsCallable(functions, 'adminListUsers');
    const result = await adminListUsers();
    const data = result.data as ListUsersResult;
    setUsers(data.users);
  };

  const handleExportUserData = async (uid: string) => {
    const functions = getFunctions();
    const adminExportUserData = httpsCallable(functions, 'adminExportUserData');
    await adminExportUserData({ uid });
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>User Management</h1>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>UID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.uid}</td>
              <td>
                <button onClick={() => handleDeactivateUser(user.uid)}>
                  Deactivate
                </button>
                <button onClick={() => handleExportUserData(user.uid)}>
                  Export Data
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
