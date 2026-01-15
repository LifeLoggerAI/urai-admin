
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/users', label: 'User Intelligence' },
  { href: '/pipeline', label: 'Data Pipeline' },
  { href: '/models', label: 'AI/Model Governance' },
  { href: '/safety', label: 'Content Safety' },
  { href: '/configuration', label: 'System Config' },
  { href: '/roles', label: 'Roles & Permissions' },
  { href: '/incident', label: 'Incident Tools' },
  { href: '/monetization', label: 'Monetization' },
  { href: '/compliance', label: 'Compliance' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-100 dark:bg-zinc-900 p-4 border-r dark:border-zinc-800">
      <div className="text-2xl font-bold mb-4">URAI Admin</div>
      <nav>
        <ul>
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href}>
                <p className={`p-2 rounded-lg ${pathname === link.href ? 'bg-blue-500 text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
                  {link.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
