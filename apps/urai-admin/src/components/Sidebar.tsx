
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Users', href: '/users' },
  { name: 'Execution Runs', href: '/runs' },
  { name: 'Asset Renders', href: '/renders' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Templates', href: '/templates' },
  { name: 'System Control', href: '/system' },
  { name: 'Audit Logs', href: '/audit' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, role } = useAdminAuth();

  if (!user || !role) {
    return null; // Don't render sidebar if not logged in or role not determined
  }

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">URAI ADMIN</div>
        <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
            <Link
                key={item.name}
                href={item.href}
                className={classNames(
                pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
            >
                {item.name}
            </Link>
            ))}
        </nav>
    </div>
  );
}
