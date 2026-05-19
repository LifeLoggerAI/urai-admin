'use client';

import { ReactNode, useEffect, useState } from 'react';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

import { getClientAuth } from '@/lib/firebase/client';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    getClientAuth()
      .then((auth) => {
        if (cancelled) return;
        unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
          setUser(nextUser);
          setLoading(false);

          if (nextUser) {
            const idToken = await nextUser.getIdToken();
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            });
          } else {
            await fetch('/api/auth/session', { method: 'DELETE' });
          }
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

  useEffect(() => {
    if (!loading && !user && pathname && !pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [loading, user, pathname, router]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
