
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

const navItems = [
  { href: '/admin', label: 'Dashboard', roles: ['owner', 'admin', 'viewer'] },
  { href: '/admin/users', label: 'Users', roles: ['owner', 'admin'] },
  { href: '/admin/audit', label: 'Audit Logs', roles: ['owner', 'admin'] },
  { href: '/admin/settings', label: 'Settings', roles: ['owner', 'admin', 'viewer'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { role, loading } = useRBAC();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const filteredNavItems = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Urai Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-8">
          <ul>
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <p
                    className={`block px-4 py-2 transition-colors duration-200 ${
                      pathname === item.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md md:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <span className="mr-4">{user.email} ({role})</span>
            <button onClick={signOut} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
