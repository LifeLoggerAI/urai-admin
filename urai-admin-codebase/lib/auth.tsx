"use client";
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, User } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, googleProvider, funcs } from "@/lib/firebase";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AdminClaims = { admin?: boolean; roles?: string[]; perms?: string[] } | null;

const AuthCtx = createContext<{
  user: User | null;
  claims: AdminClaims;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAdminRole: (uid: string, roles: string[], perms: string[]) => Promise<any>;
}>({ 
  user: null,
  claims: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
  setAdminRole: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<AdminClaims>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult(true);
        setClaims((token.claims as any) ?? null);
        // set a lightweight cookie for middleware path guard
        if ((token.claims as any)?.admin) {
          if (typeof document !== 'undefined') document.cookie = `urai_admin=1; Path=/; Max-Age=3600; SameSite=Lax`;
        } else {
          if (typeof document !== 'undefined') document.cookie = `urai_admin=; Path=/; Max-Age=0; SameSite=Lax`;
        }
      } else {
        setClaims(null);
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({
    user, claims, loading,
    signInWithGoogle: async () => { await signInWithPopup(auth, googleProvider); },
    signInWithEmail: async (email: string, password: string) => { await signInWithEmailAndPassword(auth, email, password); },
    signOut: async () => { if (typeof document !== 'undefined') document.cookie = `urai_admin=; Path=/; Max-Age=0; SameSite=Lax`; await auth.signOut(); },
    setAdminRole: async (uid: string, roles: string[], perms: string[]) => {
      const fn = httpsCallable(funcs, "setAdminRole");
      return await fn({ uid, roles, perms });
    },
  }), [user, claims, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, claims, loading } = useAuth();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
  if (!claims?.admin) return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Admin access required</h2>
        <p className="text-slate-300">Your account is signed in but does not have admin privileges.<br/>Ask a superadmin to assign custom claims.</p>
      </div>
    </main>
  );
  return <>{children}</>;
}
