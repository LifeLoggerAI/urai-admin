
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/roles">Roles</Link>
          <Link href="/audit-logs">Audit Logs</Link>
          <Link href="/feature-flags">Feature Flags</Link>
          <Link href="/user-management">User Management</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
