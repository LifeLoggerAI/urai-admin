'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="spatial-admin-os spatial-session-loader">
        <div>Loading secure URAI spatial command session...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="spatial-admin-os flex text-foreground">
      <Sidebar />
      <div className="spatial-admin-content">{children}</div>
    </div>
  );
}
