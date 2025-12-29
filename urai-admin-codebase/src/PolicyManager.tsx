
import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

const firestore = getFirestore();
const policiesCollection = collection(firestore, 'policies');

interface Policy {
  id: string;
  name: string;
  description: string;
}

const PolicyManager = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    // Listen for real-time updates to the policies collection
    const unsubscribe = onSnapshot(
      policiesCollection,
      (snapshot) => {
        const policyList = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
        }));
        setPolicies(policyList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching policies:", err);
        setError("Failed to fetch policies.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName || !policyDescription) {
      setError('Policy name and description cannot be empty.');
      return;
    }

    setError(null);

    try {
      if (editingPolicy) {
        // Update existing policy
        const policyDoc = doc(firestore, 'policies', editingPolicy.id);
        await updateDoc(policyDoc, { name: policyName, description: policyDescription });
      } else {
        // Create new policy
        await addDoc(policiesCollection, { name: policyName, description: policyDescription });
      }
      // Reset form
      setPolicyName('');
      setPolicyDescription('');
      setEditingPolicy(null);
    } catch (err) {
      console.error("Error saving policy:", err);
      setError("Failed to save the policy.");
    }
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setPolicyName(policy.name);
    setPolicyDescription(policy.description);
  };

  const handleDelete = async (id: string) => {
    try {
      const policyDoc = doc(firestore, 'policies', id);
      await deleteDoc(policyDoc);
    } catch (err) {
      console.error("Error deleting policy:", err);
      setError("Failed to delete the policy.");
    }
  };

  const cancelEdit = () => {
    setEditingPolicy(null);
    setPolicyName('');
    setPolicyDescription('');
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading policies...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Policy Management</h2>
      <p>Create, edit, and delete access control policies.</p>

      {/* Form for Creating/Editing Policies */}
      <form onSubmit={handleSubmit} style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>{editingPolicy ? 'Edit Policy' : 'Create New Policy'}</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Policy Name:</label><br />
          <input
            type="text"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            placeholder="e.g., ReadOnlyAccess"
            style={{ width: '300px', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Policy Description:</label><br />
          <textarea
            value={policyDescription}
            onChange={(e) => setPolicyDescription(e.target.value)}
            placeholder="e.g., Grants read-only access to all resources."
            style={{ width: '300px', height: '80px', padding: '0.5rem' }}
          />
        </div>
        <button type="submit">{editingPolicy ? 'Update Policy' : 'Create Policy'}</button>
        {editingPolicy && <button type="button" onClick={cancelEdit} style={{marginLeft: '1rem'}}>Cancel</button>}
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* List of Existing Policies */}
      <div>
        <h3>Existing Policies</h3>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
                <tr style={{borderBottom: '1px solid #ccc'}}>
                    <th style={{textAlign: 'left', padding: '0.5rem'}}>Name</th>
                    <th style={{textAlign: 'left', padding: '0.5rem'}}>Description</th>
                    <th style={{textAlign: 'left', padding: '0.5rem'}}>Actions</th>
                </tr>
            </thead>
            <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '0.5rem'}}>{policy.name}</td>
                <td style={{padding: '0.5rem'}}>{policy.description}</td>
                <td style={{padding: '0.5rem'}}>
                  <button onClick={() => handleEdit(policy)} style={{marginRight: '0.5rem'}}>Edit</button>
                  <button onClick={() => handleDelete(policy.id)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
        </table>
        {policies.length === 0 && <p>No policies found. Create one above.</p>}
      </div>
    </div>
  );
};

export default PolicyManager;
