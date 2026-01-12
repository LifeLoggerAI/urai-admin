'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/tenants', label: 'Tenants', icon: Briefcase },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex-shrink-0">
      <div className="p-6 text-2xl font-bold text-center">URAI</div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.label} className="px-4 py-2">
              <Link href={item.href} className={cn(
                'flex items-center p-2 rounded-lg transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
