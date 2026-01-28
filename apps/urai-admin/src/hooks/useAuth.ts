
import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged } from '../lib/auth';
import { doc, getFirestore, onSnapshot, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';

const db = getFirestore(app);

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsub = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            updateDoc(userDocRef, { lastLoginAt: serverTimestamp() });
            setRole(docSnap.data().role);
            setLoading(false);
          } else {
            const superAdmins = (process.env.NEXT_PUBLIC_URAI_SUPERADMINS || '').split(',');
            const newRole = superAdmins.includes(user.uid) ? 'admin' : 'viewer';
            setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: newRole,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            }).then(() => {
              setRole(newRole);
              setLoading(false);
            });
          }
        });
        return () => unsub();
      } else {
        setRole(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
