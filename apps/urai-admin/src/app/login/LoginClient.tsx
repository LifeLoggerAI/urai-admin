'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { CommandWorld } from '@/components/marketing/CommandWorld';

function getFirebaseConfigStatus() {
  const required = [
    ['NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY],
    ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID],
  ];

  return required.filter(([, value]) => !value).map(([name]) => name);
}

function loginErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
    return 'The email or password was not accepted. Check credentials and try again.';
  }
  if (message.includes('auth/user-not-found')) {
    return 'No Firebase Auth user was found for that email.';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Firebase temporarily blocked attempts for this account. Wait, then try again.';
  }
  if (message.includes('Admin access is not active')) {
    return 'This account exists, but it is not active in adminUsers yet. Run pnpm bootstrap:owner or activate the admin record.';
  }
  return message || 'Login failed. Check Firebase config, adminUsers, and server logs.';
}

export function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const missingConfig = useMemo(getFirebaseConfigStatus, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('');

    if (missingConfig.length) {
      setError(`Missing Firebase browser config: ${missingConfig.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      setStatus('Verifying Firebase credentials...');
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken(true);

      setStatus('Opening secure admin session...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || `Admin session failed with status ${response.status}`);
      }

      setStatus('Session established. Entering command center...');
      window.location.assign('/admin');
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-world grid min-h-screen gap-8 px-6 py-8 text-white lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12">
      <section className="mx-auto w-full max-w-xl">
        <Link href="/" className="mb-8 inline-flex text-sm text-cyan-200 hover:text-white">
          ← URAI Admin
        </Link>
        <div className="hero-glass rounded-3xl p-7 md:p-9">
          <div className="neon-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs">
            Secure command access
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Enter the URAI command world.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Sign in with a Firebase Auth account that is active in `adminUsers`. The server will verify your ID token, create a secure session cookie, and enforce role access.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@uraiadmin.com"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {missingConfig.length > 0 ? (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                Missing Firebase browser config: {missingConfig.join(', ')}. Add the env vars and redeploy.
              </div>
            ) : null}

            {status ? (
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm text-cyan-100">
                {status}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              className="w-full rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || missingConfig.length > 0}
              type="submit"
            >
              {submitting ? 'Opening session...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-slate-400">
            White screen protection: this route now renders explicit loading, config, and auth errors instead of failing silently.
          </div>
        </div>
      </section>

      <section className="hidden lg:block">
        <CommandWorld compact />
      </section>
    </main>
  );
}
