
'use client';

import { useAuth } from '@/hooks/useAuth';
import { getUserClaims, Role } from '@/lib/auth';
import { useEffect, useState } from 'react';

const withRole = (WrappedComponent: React.ComponentType, requiredRole: Role) => {
  const WithRole = (props: any) => {
    const { user, loading } = useAuth();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkClaims = async () => {
        if (user) {
          const userWithClaims = await getUserClaims(user);
          if (userWithClaims.claims.role === requiredRole) {
            setAuthorized(true);
          }
        }
      };

      if (!loading) {
        checkClaims();
      }
    }, [user, loading]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper skeleton loader
    }

    if (!authorized) {
      return <div>You are not authorized to view this page.</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithRole;
};

export default withRole;
