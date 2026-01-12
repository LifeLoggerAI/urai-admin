'use client';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div>{/* Can add breadcrumbs or search here */}</div>
      <div className="flex items-center space-x-4">
        <span>{user?.email}</span>
        <Button onClick={handleLogout} size="sm">Sign Out</Button>
      </div>
    </header>
  );
}
