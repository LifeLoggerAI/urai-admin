'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { getClientAuth } from '@/lib/firebase/client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

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

  const signOut = useCallback(async () => {
    const auth = await getClientAuth();
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    await firebaseSignOut(auth);
    window.location.href = '/login';
  }, []);

  const value = useMemo(() => ({ user, loading, signOut }), [user, loading, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
