import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function PoliciesPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles & Policies</h1>
        <p className="text-sm text-muted-foreground">Live role records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="roles"
        emptyLabel="No roles found."
        columns={[
          { key: 'id', label: 'Role' },
          { key: 'description', label: 'Description' },
          { key: 'permissions', label: 'Permissions' },
          { key: 'updatedAt', label: 'Updated' }
        ]}
      />
    </main>
  );
}
