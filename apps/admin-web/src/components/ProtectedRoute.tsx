'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  if (role && (user as any).customClaims?.uraiRole !== role) {
    return <p>Access disabled</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
