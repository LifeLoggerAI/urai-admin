
'use client';

import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div></div>
      <div>
        <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );
}
