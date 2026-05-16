import type { ComponentType } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

export const withAdminAuth = <P extends object>(Component: ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      } else if (!loading && user && role !== 'admin' && role !== 'staff') {
        router.push('/unauthorized');
      }
    }, [user, role, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || (role !== 'admin' && role !== 'staff')) {
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};
