"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(auth, provider);
      const idToken = await credential.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        window.location.href = '/admin';
      } else {
        await auth.signOut();
        console.error("Unable to create admin session");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Sign in with Google
      </button>
    </div>
  );
}
