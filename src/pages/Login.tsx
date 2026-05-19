import React from 'react';
import { GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { getFirebaseAuthAsync, getFirebaseDbAsync } from '../lib/firebase/client';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const auth = await getFirebaseAuthAsync();
      const db = await getFirebaseDbAsync();
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;

      const adminDocRef = doc(db, 'adminUsers', user.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists() && adminDocSnap.data().isActive) {
        navigate('/');
        return;
      }

      const adminUsersSnapshot = await getDocs(collection(db, 'adminUsers'));
      if (adminUsersSnapshot.empty && import.meta.env.VITE_ALLOW_ADMIN_BOOTSTRAP === 'true') {
        await setDoc(adminDocRef, {
          email: user.email,
          role: 'owner',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        navigate('/');
        return;
      }

      navigate('/access-denied');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in with Google.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleGoogleSignIn}
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
