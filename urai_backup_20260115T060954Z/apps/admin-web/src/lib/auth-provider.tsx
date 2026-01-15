'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onIdTokenChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { useRouter } from 'next/navigation';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, loading: true, isAdmin: false,
  signInWithEmail: async () => {}, 
  signInWithGoogle: async () => {}, 
  logout: async () => {}, 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const token = await user.getIdTokenResult();
        const userRole = token.claims.role;
        setIsAdmin(['admin', 'superadmin'].includes(userRole as string));
        setUser(user);
        document.cookie = `firebaseIdToken=${await user.getIdToken()}; path=/;`;
      } else {
        setUser(null);
        setIsAdmin(false);
        document.cookie = 'firebaseIdToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    signInWithEmail: (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass),
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export function RequireAdmin({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/access-denied');
        }
    }, [isAdmin, loading, router]);

    if (loading || !isAdmin) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return <>{children}</>;
}
