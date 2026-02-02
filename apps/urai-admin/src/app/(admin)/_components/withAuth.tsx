'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuthComponent = (props: P) => {
    const [user, loading] = useAuthState(auth);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else {
          const checkAuthorization = async () => {
            const adminUserDoc = await getDoc(doc(db, 'adminUsers', user.uid));
            if (adminUserDoc.exists() && adminUserDoc.data().isActive) {
              setIsAuthorized(true);
            } else {
              await auth.signOut();
              router.push('/login');
              alert('Access denied. You are not an authorized admin.');
            }
          };
          checkAuthorization();
        }
      }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}
