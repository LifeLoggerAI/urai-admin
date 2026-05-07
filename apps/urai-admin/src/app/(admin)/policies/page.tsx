import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type RoleRow = {
  id: string;
  permissions: string[];
  description: string | null;
  updatedAt: unknown;
};

async function getRoles(): Promise<RoleRow[]> {
  const snapshot = await firestore.collection('roles').limit(100).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      permissions: Array.isArray(data.permissions) ? data.permissions.map(String) : [],
      description: typeof data.description === 'string' ? data.description : null,
      updatedAt: data.updatedAt ?? data.createdAt ?? null,
    };
  });
}

export default async function PoliciesPage() {
  const roles = await getRoles();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles & Policies</h1>
        <p className="text-sm text-muted-foreground">Read-only RBAC policy view from Firestore roles.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>No roles found.</td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{role.id}</td>
                  <td className="px-4 py-3">{role.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    {role.permissions.length === 0 ? (
                      '—'
                    ) : (
                      <div className="flex max-w-2xl flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span key={permission} className="rounded-full border px-2 py-1 text-xs">
                            {permission}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(role.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
