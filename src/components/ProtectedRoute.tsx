import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { getFirebaseAuthAsync, getFirebaseDbAsync } from '../firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function attachAuth() {
      try {
        const [auth, db] = await Promise.all([getFirebaseAuthAsync(), getFirebaseDbAsync()]);
        if (cancelled) return;

        unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
          if (nextUser) {
            setUser(nextUser);
            const adminDocRef = doc(db, 'adminUsers', nextUser.uid);
            const adminDocSnap = await getDoc(adminDocRef);
            setIsAuthorized(adminDocSnap.exists() && Boolean(adminDocSnap.data().isActive));
          } else {
            setUser(null);
            setIsAuthorized(false);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Unable to initialize Firebase Auth:', error);
        if (!cancelled) {
          setUser(null);
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    }

    attachAuth();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
}
