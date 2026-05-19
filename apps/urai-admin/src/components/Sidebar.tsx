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
  { href: '/admin/job-runs', label: 'Job Runs' },
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
    <aside className="spatial-admin-sidebar text-white">
      <div>
        <div className="spatial-admin-brand">
          <span>URAI Labs</span>
          <strong>Admin OS</strong>
        </div>
        <nav className="spatial-admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || Boolean(pathname?.startsWith(`${item.href}/`));

            return (
              <Link key={item.href} href={item.href} data-active={isActive ? 'true' : 'false'}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <Button onClick={signOut} className="mt-6 w-full">Logout</Button>
    </aside>
  );
}
