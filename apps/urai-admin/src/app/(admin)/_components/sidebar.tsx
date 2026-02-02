'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/content', label: 'Content' },
  { href: '/audit', label: 'Audit' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`block p-2 rounded ${pathname === link.href ? 'bg-gray-900' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
