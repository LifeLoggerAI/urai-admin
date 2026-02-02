
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '../../lib/firebase';
import { Button } from '../ui/button';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Initialize Firebase auth
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    // Clear the server-side session
    await fetch('/api/auth/logout');
    // Sign out from the client-side
    await auth.signOut();
    // Redirect to login
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm">
            <span className="font-medium">{user.email}</span>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
        </Button>
      </div>
    </header>
  );
}
