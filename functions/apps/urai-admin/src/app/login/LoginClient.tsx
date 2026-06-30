'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  type UserCredential,
} from 'firebase/auth';
import { getClientAuth, getFirebaseConfigStatus } from '@/lib/firebase/client';
import { CommandWorld } from '@/components/marketing/CommandWorld';

type ConfigState = {
  ready: boolean;
  source: string;
  missing: string[];
  authDomain?: string;
  projectId?: string;
};

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
  if (message.includes('auth/popup-blocked')) {
    return 'Google popup was blocked. Use Google redirect or email/password fallback.';
  }
  if (message.includes('auth/api-key-not-valid')) {
    return 'Firebase Auth config is invalid. The app will try Firebase Hosting runtime config; rebuild and redeploy if this persists.';
  }
  if (message.includes('Admin access is not active')) {
    return 'This account exists, but it is not active in adminUsers yet. Run pnpm bootstrap:owner or activate the admin record.';
  }
  return message || 'Login failed. Check Firebase config, adminUsers, and server logs.';
}

async function openAdminSession(credential: UserCredential) {
  const idToken = await credential.user.getIdToken(true);
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || `Admin session failed with status ${response.status}`);
  }

  window.location.assign('/admin');
}

export function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Loading Firebase config...');
  const [config, setConfig] = useState<ConfigState>({ ready: false, source: 'loading', missing: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [auth, nextConfig] = await Promise.all([getClientAuth(), getFirebaseConfigStatus()]);
        if (cancelled) return;

        setConfig(nextConfig);
        setStatus(nextConfig.ready ? 'Firebase config loaded' : 'Firebase config missing');

        const redirectCredential = await getRedirectResult(auth);
        if (redirectCredential) {
          setStatus('Completing Google redirect session...');
          await openAdminSession(redirectCredential);
        }
      } catch (nextError) {
        if (!cancelled) {
          setConfig({ ready: false, source: 'missing', missing: [] });
          setError(loginErrorMessage(nextError));
          setStatus('Firebase config unavailable');
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGooglePopup() {
    setSubmitting(true);
    setError('');
    setStatus('Opening Google popup...');

    try {
      const auth = await getClientAuth();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      setStatus('Opening secure admin session...');
      await openAdminSession(credential);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Google popup blocked');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleRedirect() {
    setSubmitting(true);
    setError('');
    setStatus('Starting Google redirect...');

    try {
      const auth = await getClientAuth();
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Google redirect failed');
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('Verifying Firebase credentials...');
    setSubmitting(true);

    try {
      const auth = await getClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setStatus('Opening secure admin session...');
      await openAdminSession(credential);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Email/password failed');
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
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Sign in to URAI Admin.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            This route supports Google popup, Google redirect, and email/password sign-in so provider or popup issues do not block admin access.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
            <div className="flex justify-between gap-4"><span>Status</span><strong className="text-white">{status}</strong></div>
            <div className="flex justify-between gap-4"><span>Project</span><strong className="text-white">{config.projectId ?? 'loading'}</strong></div>
            <div className="flex justify-between gap-4"><span>Auth config</span><strong className="text-white">{config.ready ? config.source : config.missing.join(', ') || 'loading'}</strong></div>
            {config.authDomain ? <div className="flex justify-between gap-4"><span>Auth domain</span><strong className="text-white">{config.authDomain}</strong></div> : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="button"
              onClick={handleGooglePopup}
            >
              Google popup
            </button>
            <button
              className="rounded-2xl border border-cyan-300/40 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="button"
              onClick={handleGoogleRedirect}
            >
              Google redirect
            </button>
          </div>

          <form className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4" onSubmit={handleSubmit}>
            <h2 className="font-semibold">Email/password fallback</h2>
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

            <button
              className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="submit"
            >
              {submitting ? 'Opening session...' : 'Sign in with email'}
            </button>
          </form>
        </div>
      </section>

      <section className="hidden lg:block">
        <CommandWorld compact />
      </section>
    </main>
  );
}
