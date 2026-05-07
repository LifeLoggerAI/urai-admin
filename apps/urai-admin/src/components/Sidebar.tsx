
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/dead-letters', label: 'Dead Letters' },
  { href: '/admin/feature-flags', label: 'Feature Flags' },
  { href: '/admin/policies', label: 'Roles & Policies' },
  { href: '/admin/system', label: 'System' },
  { href: '/admin/audit', label: 'Audit Log' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="flex w-64 flex-col justify-between bg-gray-800 p-4 text-white">
      <div>
        <h2 className="mb-8 text-2xl font-bold">URAI Admin</h2>
        <nav aria-label="Admin navigation">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md p-2 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700/70'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <Button onClick={signOut}>Logout</Button>
    </aside>
  );
}
