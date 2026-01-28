
import { getAuth, onAuthStateChanged as onFirebaseAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as signOutFirebase } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

export const getCurrentUser = () => auth.currentUser;

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOut = () => signOutFirebase(auth);

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return onFirebaseAuthStateChanged(auth, callback);
};
