
'use client';

import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import UserList from '@/components/UserList';

export default function AdminPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      user.getIdToken().then(idToken => {
        fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
      });
    }
  }, [user]);

  const handleSignOut = () => {
    router.push('/logout');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <button onClick={handleSignOut}>Sign Out</button>

      <div>
        <UserList />
      </div>

      <div>
        <h2>Access Requests</h2>
        {/* Access request components will go here */}
      </div>

      <div>
        <h2>Feature Flags</h2>
        {/* Feature flag components will go here */}
      </div>

      <div>
        <h2>System Health</h2>
        {/* System health components will go here */}
      </div>

      <div>
        <h2>Audit Logs</h2>
        {/* Audit log components will go here */}
      </div>
    </div>
  );
}
