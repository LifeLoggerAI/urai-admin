'use client';
import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [user, isAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect will be handled by the useEffect
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign in to URAI Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full p-2 border rounded" />
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
