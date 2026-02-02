
"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../lib/firebase/firebase";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The user is now signed in. The auth state listener in the root layout
      // will handle the redirect to the admin dashboard.
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
