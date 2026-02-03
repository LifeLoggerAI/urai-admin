
'use client';

import { useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';

const auth = getAuth(app);

export default function LoginPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = '/admin';
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        // Handle login failure
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (loading || user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Urai Admin</h1>
        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
