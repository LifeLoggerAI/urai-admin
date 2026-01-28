'use client';

import { withAuth } from '@/lib/auth/with-auth';

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the Urai Admin Dashboard.</p>
    </div>
  );
}

export default withAuth(DashboardPage);
