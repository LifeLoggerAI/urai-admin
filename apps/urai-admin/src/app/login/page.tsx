'use client';

import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div>
      <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
