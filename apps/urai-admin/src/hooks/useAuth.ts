
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase/client';

const auth = getAuth(app);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await Promise.allSettled([
        fetch('/api/auth/logout', { method: 'POST' }),
        firebaseSignOut(auth),
      ]);
      window.location.href = '/login';
    } catch {}
  };

  return { user, loading, signOut };
}
