import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { Header } from '@/components/layout/header';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
