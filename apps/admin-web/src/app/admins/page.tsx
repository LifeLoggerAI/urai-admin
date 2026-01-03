
import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const AdminsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const functions = getFunctions();
      const adminListUsers = httpsCallable(functions, 'adminListUsers');
      const result = await adminListUsers();
      setUsers(result.data.users);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, role) => {
    const functions = getFunctions();
    const adminSetRole = httpsCallable(functions, 'adminSetRole');
    await adminSetRole({ uid, role });
    // Refresh the user list
    const adminListUsers = httpsCallable(functions, 'adminListUsers');
    const result = await adminListUsers();
    setUsers(result.data.users);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admins Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.customClaims?.uraiRole}</td>
              <td>
                <select
                  value={user.customClaims?.uraiRole}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsPage;
