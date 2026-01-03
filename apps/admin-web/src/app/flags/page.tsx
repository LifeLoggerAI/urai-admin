
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

const FlagsPage = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagValue, setNewFlagValue] = useState('');

  useEffect(() => {
    const fetchFlags = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'featureFlags'));
      const flagsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlags(flagsData);
      setLoading(false);
    };

    fetchFlags();
  }, []);

  const handleFlagChange = async (id, enabled) => {
    const db = getFirestore();
    const flagRef = doc(db, 'featureFlags', id);
    await updateDoc(flagRef, { enabled: !enabled });
    // Refresh the flags
    const querySnapshot = await getDocs(collection(db, 'featureFlags'));
    const flagsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFlags(flagsData);
  };

  const handleCreateFlag = async () => {
    const db = getFirestore();
    await addDoc(collection(db, 'featureFlags'), {
      key: newFlagKey,
      value: newFlagValue,
      enabled: false,
      updatedAt: new Date(),
      updatedBy: 'admin', // Replace with actual user
    });
    // Refresh the flags
    const querySnapshot = await getDocs(collection(db, 'featureFlags'));
    const flagsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFlags(flagsData);
    setNewFlagKey('');
    setNewFlagValue('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Feature Flags</h1>
      <div>
        <input
          type="text"
          placeholder="Flag Key"
          value={newFlagKey}
          onChange={(e) => setNewFlagKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Flag Value"
          value={newFlagValue}
          onChange={(e) => setNewFlagValue(e.target.value)}
        />
        <button onClick={handleCreateFlag}>Create Flag</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr key={flag.id}>
              <td>{flag.key}</td>
              <td>{flag.value}</td>
              <td>{flag.enabled ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleFlagChange(flag.id, flag.enabled)}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlagsPage;
