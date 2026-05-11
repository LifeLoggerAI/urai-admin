import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function AdminUsersPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        <p className="text-sm text-muted-foreground">Live user records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="adminUsers"
        emptyLabel="No admin users found."
        columns={[
          { key: 'id', label: 'UID' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'isActive', label: 'Active' },
          { key: 'lastLoginAt', label: 'Last Login' }
        ]}
      />
    </main>
  );
}
