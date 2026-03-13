'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
var navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/audit', label: 'Audit Log' },
    { href: '/admin/settings', label: 'Settings' },
];
export default function Sidebar() {
    var pathname = usePathname();
    var signOut = useAuth().signOut;
    return (<div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">Urai Admin</h2>
        <nav>
          <ul>
            {navItems.map(function (item) { return (<li key={item.href}>
                <Link href={item.href}>
                  <a className={"block p-2 rounded-md ".concat(pathname === item.href ? 'bg-gray-700' : '')}>
                    {item.label}
                  </a>
                </Link>
              </li>); })}
          </ul>
        </nav>
      </div>
      <Button onClick={signOut}>Logout</Button>
    </div>);
}
