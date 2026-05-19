'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

function missingFirebaseConfig() {
  const required = [
    ['NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY],
    ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID],
  ];

  return required.filter(([, value]) => !value).map(([name]) => name);
}

function detailedError(error: unknown) {
  const anyError = error as { code?: string; message?: string; customData?: unknown };
  const code = anyError?.code || '';
  const message = anyError?.message || String(error);
  const customData = anyError?.customData ? ` | details: ${JSON.stringify(anyError.customData)}` : '';

  if (code === 'auth/popup-blocked') return `Google popup was blocked. Allow popups or use redirect sign-in. (${code})`;
  if (code === 'auth/popup-closed-by-user') return `The Google sign-in window was closed before authentication finished. (${code})`;
  if (code === 'auth/unauthorized-domain') return `This domain is not authorized in Firebase Auth. Add urai-admin.web.app and urai-4dc1d.firebaseapp.com in Firebase Authentication authorized domains. (${code})`;
  if (code === 'auth/operation-not-allowed') return `This provider is not enabled in Firebase Authentication. Enable Google and/or Email/Password sign-in. (${code})`;
  if (code === 'auth/invalid-credential') return `Email or password was not accepted. (${code})`;
  if (code === 'auth/user-not-found') return `No Firebase Auth user exists for that email. (${code})`;
  if (message.includes('Admin access is not active')) return 'Signed in, but this user is not active in adminUsers or does not have the required admin role.';

  return `${message}${code ? ` (${code})` : ''}${customData}`;
}

async function createAdminSession(idToken: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.error || `Admin session failed with status ${res.status}`);
  }
}

export default function LoginPage() {
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const missingConfig = useMemo(missingFirebaseConfig, []);

  useEffect(() => {
    let cancelled = false;

    async function finishRedirectLogin() {
      try {
        if (missingConfig.length) return;
        const [{ getAuth, getRedirectResult }, { app }] = await Promise.all([
          import('firebase/auth'),
          import('@/lib/firebase/client'),
        ]);
        const auth = getAuth(app);
        const result = await getRedirectResult(auth);
        if (!result || cancelled) return;
        setStatus('Finishing redirected Google sign-in...');
        const idToken = await result.user.getIdToken(true);
        await createAdminSession(idToken);
        window.location.assign('/admin');
      } catch (nextError) {
        if (!cancelled) {
          setError(detailedError(nextError));
          setStatus('Redirect login blocked');
        }
      }
    }

    finishRedirectLogin();
    return () => {
      cancelled = true;
    };
  }, [missingConfig.length]);

  async function handleGooglePopup() {
    setError('');
    setStatus('Starting Google popup sign-in...');
    setBusy(true);

    try {
      if (missingConfig.length) throw new Error(`Missing Firebase browser config: ${missingConfig.join(', ')}`);
      const [{ getAuth, GoogleAuthProvider, signInWithPopup }, { app }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebase/client'),
      ]);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);
      setStatus('Creating secure admin session...');
      await createAdminSession(idToken);
      window.location.assign('/admin');
    } catch (nextError) {
      setError(detailedError(nextError));
      setStatus('Google popup blocked');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleRedirect() {
    setError('');
    setStatus('Redirecting to Google...');
    setBusy(true);

    try {
      if (missingConfig.length) throw new Error(`Missing Firebase browser config: ${missingConfig.join(', ')}`);
      const [{ getAuth, GoogleAuthProvider, signInWithRedirect }, { app }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebase/client'),
      ]);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
    } catch (nextError) {
      setError(detailedError(nextError));
      setStatus('Google redirect blocked');
      setBusy(false);
    }
  }

  async function handleEmailPassword() {
    setError('');
    setStatus('Signing in with email/password...');
    setBusy(true);

    try {
      if (missingConfig.length) throw new Error(`Missing Firebase browser config: ${missingConfig.join(', ')}`);
      const [{ getAuth, signInWithEmailAndPassword }, { app }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebase/client'),
      ]);
      const auth = getAuth(app);
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await result.user.getIdToken(true);
      setStatus('Creating secure admin session...');
      await createAdminSession(idToken);
      window.location.assign('/admin');
    } catch (nextError) {
      setError(detailedError(nextError));
      setStatus('Email login blocked');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full gap-8 rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/40 md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div>
            <Link href="/" className="text-sm text-cyan-200 hover:text-white">← URAI Admin</Link>
            <p className="mt-10 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              Secure command access
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Sign in to URAI Admin.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              This route supports Google popup, Google redirect, and email/password sign-in so provider or popup issues do not block admin access.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
              <div className="flex justify-between gap-4"><span className="text-slate-400">Status</span><strong>{status}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-400">Project</span><strong>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'missing'}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-400">Auth domain</span><strong>{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'missing'}</strong></div>
            </div>

            {missingConfig.length ? (
              <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                Missing Firebase browser config: {missingConfig.join(', ')}
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={handleGooglePopup} disabled={busy || missingConfig.length > 0} className="rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">
                Google popup
              </button>
              <button type="button" onClick={handleGoogleRedirect} disabled={busy || missingConfig.length > 0} className="rounded-2xl border border-cyan-300/40 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60">
                Google redirect
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold">Email/password fallback</p>
              <div className="mt-3 grid gap-3">
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="admin email" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-300/30 focus:ring-4" />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="password" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-300/30 focus:ring-4" />
                <button type="button" onClick={handleEmailPassword} disabled={busy || !email || !password || missingConfig.length > 0} className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
                  Sign in with email
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 p-6">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-36 w-36 place-items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-2xl shadow-cyan-500/20">
                  <div className="grid h-24 w-24 place-items-center rounded-full border border-fuchsia-300/30 bg-slate-900">
                    <span className="text-sm font-bold tracking-[0.35em] text-cyan-100">URAI</span>
                  </div>
                </div>
                <h2 className="mt-8 text-2xl font-bold">Command Center</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                  Access requires Firebase sign-in, server session creation, active adminUsers record, and role authorization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
