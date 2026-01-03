
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      const db = getFirestore();
      const flagsCollection = collection(db, 'featureFlags');
      const flagSnapshot = await getDocs(flagsCollection);
      const flagList = flagSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlags(flagList);
      setLoading(false);
    };

    fetchFlags();
  }, []);

  const handleFlagChange = async (id, isEnabled) => {
    const db = getFirestore();
    const flagRef = doc(db, 'featureFlags', id);
    await updateDoc(flagRef, { isEnabled });
    // Refresh the flag list
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Feature Flags</h1>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr key={flag.id}>
              <td>{flag.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={flag.isEnabled}
                  onChange={(e) => handleFlagChange(flag.id, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureFlagsPage;
