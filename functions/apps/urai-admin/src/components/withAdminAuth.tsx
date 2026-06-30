
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAdminAuth = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {
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
