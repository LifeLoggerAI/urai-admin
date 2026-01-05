"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setEmail(u?.email ?? null));
    return () => unsub();
  }, []);

  async function login() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/claims");
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>URAI Admin Login</h1>
      <p>{email ? `Signed in as ${email}` : "Not signed in"}</p>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={login}>Sign in with Google</button>
        <button onClick={logout}>Sign out</button>
      </div>

      <p style={{ marginTop: 16, opacity: 0.75 }}>
        You must have <code>admin: true</code> custom claim to access admin pages.
      </p>
    </main>
  );
}
