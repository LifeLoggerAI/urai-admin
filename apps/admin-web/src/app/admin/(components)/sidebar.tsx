'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, List, FileText, Settings, Briefcase, Flag } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/leads', icon: List, label: 'Leads' },
  { href: '/admin/broadcast', icon: Briefcase, label: 'Broadcast' },
  { href: '/admin/demo-access', icon: Flag, label: 'Demo Access' },
  { href: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">URAI Admin</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}
            className={`flex items-center px-4 py-2 text-sm rounded-md ${pathname.startsWith(item.href) ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
