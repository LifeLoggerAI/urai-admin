'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';

export function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Urai Admin</h1>
        {user && (
          <div className="flex items-center">
            <span className="mr-4">{user.email}</span>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
        )}
      </div>
    </header>
  );
}
