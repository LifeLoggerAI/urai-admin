
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseClient'; // Make sure you have this file

const auth = getAuth(app);

type Role = 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: Role[]) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<Role | null>(null);

    useEffect(() => {
      const unsubscribe = onIdTokenChanged(auth, async (user) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          const role = idTokenResult.claims.role as Role;
          setUserRole(role);
          if (!allowedRoles.includes(role)) {
            router.push('/access-denied');
          }
        } else {
          router.push('/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper skeleton loader
    }

    if (userRole && allowedRoles.includes(userRole)) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
