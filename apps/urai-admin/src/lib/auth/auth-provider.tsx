'use client';

import { ReactNode, useEffect, useState } from 'react';
import { User, onIdTokenChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

import { auth } from '@/config/firebase';
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
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const idToken = await user.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
      } else {
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname && !pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [loading, user, pathname, router]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
