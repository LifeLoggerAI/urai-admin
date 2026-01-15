
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/users', label: 'User Intelligence' },
  { href: '/monitoring', label: 'System Monitoring' },
  { href: '/governance', label: 'AI Governance' },
  { href: '/safety', label: 'Content Safety' },
  { href: '/config', label: 'System Config' },
  { href: '/audits', label: 'Audits & Roles' },
  { href: '/incidents', label: 'Incident Response' },
  { href: '/monetization', label: 'Monetization' },
  { href: '/compliance', label: 'Compliance' },
];

export default function Nav() {
    const pathname = usePathname();

    return (
      <aside className="w-64 flex-shrink-0 bg-zinc-50 p-4 border-r dark:bg-zinc-900 dark:border-zinc-800">
        <div className="text-2xl font-semibold mb-4 dark:text-white">URAI Admin</div>
        <nav className="flex flex-col gap-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}>
                  {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
}
