'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

import { getClientAuth } from '@/lib/firebase/client';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    getClientAuth()
      .then((auth) => {
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!currentUser && pathname !== '/login') {
            router.push('/login');
          }
        });
      })
      .catch((error) => {
        console.error('Unable to initialize Firebase Auth:', error);
        if (!cancelled && pathname !== '/login') {
          router.push('/login');
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [pathname, router]);

  return <>{children}</>;
}
