
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/jobs", label: "Jobs" },
  { href: "/content", label: "Content" },
  { href: "/audit", label: "Audit" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="text-2xl font-bold">Urai Admin</Link>
      </div>
      <nav className="flex-grow">
        <ul>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`block p-4 hover:bg-gray-700 ${pathname === href ? "bg-gray-900" : ""}`}>
                  {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
