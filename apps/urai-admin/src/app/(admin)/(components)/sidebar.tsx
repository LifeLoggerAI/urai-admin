'use client'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRBAC } from "@/hooks/useRBAC";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Users", href: "/users" },
  { name: "Feature Flags", href: "/feature-flags" },
  { name: "Council", href: "/council" },
  { name: "Jobs", href: "/jobs" },
  { name: "Audit Log", href: "/audit-log" },
  { name: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRBAC();
  const { user } = useAuth();

  return (
    <div className="hidden md:flex flex-col w-64 border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <Link href="/" className="text-2xl font-bold">URAI Admin</Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "text-primary bg-muted": pathname === link.href,
                }
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{user?.email}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}
