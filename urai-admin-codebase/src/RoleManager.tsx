
import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firestore = getFirestore();
const functions = getFunctions();

// Firebase collections
const rolesCollection = collection(firestore, 'roles');
const policiesCollection = collection(firestore, 'policies');

// Callable functions
const getUsers = httpsCallable(functions, 'getUsers');
const setUserRole = httpsCallable(functions, 'setRole'); // Assumes 'setRole' is the name of your function

// --- Interfaces ---
interface Policy {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  policies: string[]; // Array of policy IDs
}

interface User {
  uid: string;
  email: string;
  role: string;
}

const RoleManager = () => {
  // --- State --- 
  const [roles, setRoles] = useState<Role[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [roleName, setRoleName] = useState('');
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const userResult: any = await getUsers();
        setUsers(userResult.data);

        // Fetch policies (real-time)
        const policyUnsubscribe = onSnapshot(policiesCollection, (snapshot) => {
          const policyList = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
          setPolicies(policyList);
        });

        // Fetch roles (real-time)
        const roleUnsubscribe = onSnapshot(rolesCollection, (snapshot) => {
          const roleList = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            policies: doc.data().policies || [],
          }));
          setRoles(roleList);
        });

        setLoading(false);
        return () => {
            policyUnsubscribe();
            roleUnsubscribe();
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unknown error occurred.');
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Event Handlers ---
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) {
      setError('Role name cannot be empty.');
      return;
    }
    setError(null);

    const roleData = { name: roleName, policies: selectedPolicies };

    try {
      if (editingRole) {
        const roleDoc = doc(firestore, 'roles', editingRole.id);
        await updateDoc(roleDoc, roleData);
      } else {
        await addDoc(rolesCollection, roleData);
      }
      // Reset form
      setRoleName('');
      setSelectedPolicies([]);
      setEditingRole(null);
    } catch (err) {
      console.error('Error saving role:', err);
      setError('Failed to save the role.');
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPolicies(role.policies);
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
        try {
            await deleteDoc(doc(firestore, 'roles', id));
        } catch (err) {
            console.error('Error deleting role:', err);
            setError('Failed to delete the role.');
        }
    }
  };

  const handleUserRoleChange = async (uid: string, newRole: string) => {
    try {
        await setUserRole({ userId: uid, role: newRole });
        // Optimistically update UI
        setUsers(users.map(user => user.uid === uid ? { ...user, role: newRole } : user));
    } catch (err: any) {
        console.error('Error updating user role:', err);
        setError(err.message || 'An error occurred while updating the user role.');
    }
  }

  const handlePolicyCheckbox = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId) 
        : [...prev, policyId]
    );
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setRoleName('');
    setSelectedPolicies([]);
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* --- Role Definition --- */}
      <section>
        <h2>Role Definitions</h2>
        <form onSubmit={handleRoleSubmit} style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
          <input value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Role Name" required />
          <div>
            <h4>Attach Policies</h4>
            {policies.map(policy => (
              <div key={policy.id}>
                <input 
                  type="checkbox" 
                  id={policy.id}
                  checked={selectedPolicies.includes(policy.id)}
                  onChange={() => handlePolicyCheckbox(policy.id)}
                />
                <label htmlFor={policy.id}>{policy.name}</label>
              </div>
            ))}
          </div>
          <button type="submit">{editingRole ? 'Update Role' : 'Create Role'}</button>
          {editingRole && <button type="button" onClick={cancelEdit} style={{marginLeft: '1rem'}}>Cancel</button>}
        </form>

        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead><tr><th>Role Name</th><th>Policies</th><th>Actions</th></tr></thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.policies.join(', ')}</td>
                <td>
                  <button onClick={() => handleEditRole(role)}>Edit</button>
                  <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr style={{margin: '3rem 0'}}/>

      {/* --- User Role Assignment --- */}
      <section>
        <h2>User Role Assignments</h2>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead><tr><th>User Email</th><th>Assigned Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.uid}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select onChange={(e) => handleUserRoleChange(user.uid, e.target.value)} value={user.role}>
                    <option value="">-- Unassign --</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default RoleManager;
