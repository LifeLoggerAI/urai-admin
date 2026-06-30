'use client';

import { ComponentType } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
      router.replace('/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
