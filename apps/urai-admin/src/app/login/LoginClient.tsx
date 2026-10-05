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

type AdminSessionPayload = {
  success?: boolean;
  error?: string;
  refreshRequired?: boolean;
  reauthRequired?: boolean;
};

function loginErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
    return 'The email or password was not accepted. Check credentials and try again.';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Sign-in attempts are temporarily limited. Try again later or contact support.';
  }
  if (message.includes('auth/popup-blocked')) {
    return 'The sign-in window was blocked. Use another available sign-in method.';
  }
  if (message.includes('Recent sign-in required')) {
    return 'Your sign-in is too old for an admin session. Sign in again to continue.';
  }
  return 'Sign-in could not be completed. Try another available sign-in method or contact support.';
}

async function exchangeAdminSession(idToken: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({} as AdminSessionPayload)) as AdminSessionPayload;
  return { response, payload };
}

async function openAdminSession(credential: UserCredential) {
  let idToken = await credential.user.getIdToken(true);
  let exchange = await exchangeAdminSession(idToken);

  if (exchange.response.status === 409 && exchange.payload.refreshRequired === true) {
    idToken = await credential.user.getIdToken(true);
    exchange = await exchangeAdminSession(idToken);
  }

  if (!exchange.response.ok || exchange.payload.success === false) {
    if (exchange.payload.reauthRequired) {
      throw new Error('Recent sign-in required');
    }
    throw new Error('Admin session unavailable');
  }

  window.location.assign('/admin');
}

export function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Checking sign-in availability...');
  const [config, setConfig] = useState<ConfigState>({ ready: false, source: 'loading', missing: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [auth, nextConfig] = await Promise.all([getClientAuth(), getFirebaseConfigStatus()]);
        if (cancelled) return;

        setConfig(nextConfig);
        setStatus(nextConfig.ready ? 'Sign-in available' : 'Sign-in temporarily unavailable');

        const redirectCredential = await getRedirectResult(auth);
        if (redirectCredential) {
          setStatus('Completing sign-in...');
          await openAdminSession(redirectCredential);
        }
      } catch (nextError) {
        if (!cancelled) {
          setConfig({ ready: false, source: 'missing', missing: [] });
          setError(loginErrorMessage(nextError));
          setStatus('Sign-in temporarily unavailable');
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
    setStatus('Opening sign-in window...');

    try {
      const auth = await getClientAuth();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      setStatus('Opening secure admin session...');
      await openAdminSession(credential);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Sign-in did not complete');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleRedirect() {
    setSubmitting(true);
    setError('');
    setStatus('Starting secure sign-in...');

    try {
      const auth = await getClientAuth();
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Sign-in did not complete');
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('Verifying credentials...');
    setSubmitting(true);

    try {
      const auth = await getClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setStatus('Opening secure admin session...');
      await openAdminSession(credential);
    } catch (nextError) {
      setError(loginErrorMessage(nextError));
      setStatus('Sign-in did not complete');
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
            Authorized operators can use an available organization sign-in method. Access still requires an active administrator record and an allowed role.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300" role="status" aria-live="polite">
            <div className="flex justify-between gap-4"><span>Status</span><strong className="text-white">{status}</strong></div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="min-h-12 rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="button"
              onClick={handleGooglePopup}
            >
              Continue with Google
            </button>
            <button
              className="min-h-12 rounded-2xl border border-cyan-300/40 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="button"
              onClick={handleGoogleRedirect}
            >
              Use redirect sign-in
            </button>
          </div>

          <form className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4" onSubmit={handleSubmit} aria-busy={submitting}>
            <h2 className="font-semibold">Email sign in</h2>
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <button
              className="min-h-12 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !config.ready}
              type="submit"
            >
              {submitting ? 'Opening session...' : 'Sign in with email'}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-400">Need help? <a className="text-cyan-200 underline underline-offset-4 hover:text-white" href="mailto:support@urailabs.com">Contact support</a>.</p>
        </div>
      </section>

      <section className="hidden lg:block" aria-hidden="true">
        <CommandWorld compact />
      </section>
    </main>
  );
}
