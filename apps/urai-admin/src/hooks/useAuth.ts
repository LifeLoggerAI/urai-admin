import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { getClientAuth } from '@/lib/firebase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    if (typeof window === 'undefined') {
      setLoading(false);
      return undefined;
    }

    getClientAuth()
      .then((auth) => {
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Unable to initialize Firebase Auth:', error);
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    try {
      const auth = await getClientAuth();
      await auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, signOut };
}
