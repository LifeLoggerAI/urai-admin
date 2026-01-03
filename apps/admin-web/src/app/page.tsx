
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const DashboardPage = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore();
      const collections = ['users', 'events', 'moods', 'logs', 'exports'];
      const counts = {};

      for (const collectionName of collections) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          counts[collectionName] = querySnapshot.size;
        } catch (error) {
          counts[collectionName] = 'Not connected';
        }
      }

      setCounts(counts);
      setLoading(false);
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([collectionName, count]) => (
          <div key={collectionName} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
            <h2>{collectionName}</h2>
            <p>{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
