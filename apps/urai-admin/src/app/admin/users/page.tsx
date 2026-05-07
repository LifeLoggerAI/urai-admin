import { firestore } from '@/lib/firebase/admin';
import { AdminUserActions } from './AdminUserActions';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type AdminUserRow = {
  uid: string;
  email: string | null;
  role: string | null;
  isActive: boolean;
  createdAt: unknown;
  updatedAt: unknown;
  lastLoginAt: unknown;
};

async function getAdminUsers(): Promise<AdminUserRow[]> {
  const snapshot = await firestore.collection('adminUsers').orderBy('createdAt', 'desc').limit(200).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      uid: doc.id,
      email: typeof data.email === 'string' ? data.email : null,
      role: typeof data.role === 'string' ? data.role : null,
      isActive: data.isActive === true,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
      lastLoginAt: data.lastLoginAt ?? null,
    };
  });
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        <p className="text-sm text-muted-foreground">Manage active admin access and role assignments through hardened admin APIs.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border" role="region" aria-label="Admin users table">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={7}>No admin users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="border-t align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{user.email ?? 'Unknown email'}</div>
                    <div className="text-xs text-muted-foreground">{user.uid}</div>
                  </td>
                  <td className="px-4 py-3">{user.role ?? '—'}</td>
                  <td className="px-4 py-3">{user.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(user.updatedAt)}</td>
                  <td className="px-4 py-3">{formatDate(user.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <AdminUserActions uid={user.uid} role={user.role} isActive={user.isActive} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
