
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-zinc-100 dark:bg-zinc-900 p-4">
            <div className="text-2xl font-bold mb-8">URAI Admin</div>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="hover:underline">Dashboard</Link>
              <Link href="/users" className="hover:underline">User Intelligence</Link>
              <Link href="/pipeline" className="hover:underline">Data Pipeline</Link>
              <Link href="/models" className="hover:underline">AI/Model Governance</Link>
              <Link href="/safety" className="hover:underline">Content Safety</Link>
              <Link href="/configuration" className="hover:underline">System Configuration</Link>
              <Link href="/roles" className="hover:underline">Roles & Permissions</Link>
              <Link href="/crisis" className="hover:underline">Incident & Crisis</Link>
              <Link href="/monetization" className="hover:underline">Monetization</Link>
              <Link href="/compliance" className="hover:underline">Compliance</Link>
            </nav>
          </aside>
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
