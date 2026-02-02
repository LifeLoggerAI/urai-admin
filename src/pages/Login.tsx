
import React from "react";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "../lib/firebase/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const adminDocRef = doc(db, "adminUsers", user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists() && adminDocSnap.data().isActive) {
          navigate("/");
        } else {
          const adminUsersCollection = collection(db, 'adminUsers');
          const adminUsersSnapshot = await getDocs(adminUsersCollection);

          if (adminUsersSnapshot.empty && import.meta.env.VITE_ALLOW_ADMIN_BOOTSTRAP === 'true') {
            await setDoc(adminDocRef, {
              email: user.email,
              role: "owner",
              isActive: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            navigate("/");
          } else {
            navigate("/access-denied");
          }
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Failed to sign in with Google.");
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
