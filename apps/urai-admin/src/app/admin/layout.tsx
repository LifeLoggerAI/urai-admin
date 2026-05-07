import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import { verifyAdminSessionCookie } from '@/lib/admin/require-admin-session';

async function requireConsoleAccess() {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    await verifyAdminSessionCookie(sessionCookie, ['owner', 'admin', 'viewer']);
  } catch {
    redirect('/login');
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireConsoleAccess();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
