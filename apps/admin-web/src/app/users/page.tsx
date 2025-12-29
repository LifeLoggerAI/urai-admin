import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebaseClient";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const listUsers = httpsCallable(functions, 'listUsers');
        const result = await listUsers();
        setUsers((result.data as any).users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Email</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.uid}</td>
              <td>{user.email}</td>
              <td>{user.disabled ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
