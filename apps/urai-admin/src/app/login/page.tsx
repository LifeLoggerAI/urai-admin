'use client';

import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';

const auth = getAuth(app);

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Do not redirect solely because Firebase client auth is still signed in.
      // A user may have logged out server-side and still have a cached Firebase
      // client session. The server session cookie is the source of truth for
      // admin console access.
      return;
    }
  }, [user]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setError(null);
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

      const data = await res.json().catch(() => null);

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        setError(data?.error ?? 'Sign in failed. Confirm your account has active admin access.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-slate-300">
          Checking admin session...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">URAI Admin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Sign in to the operations console</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use an active admin Google account. Server-side session checks protect the console after sign-in.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isSigningIn}
          className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="mt-4 min-h-5" aria-live="polite">
          {error ? (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
