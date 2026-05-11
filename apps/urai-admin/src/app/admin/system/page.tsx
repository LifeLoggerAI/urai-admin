import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function SystemPage() {
  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Control Surface</h1>
        <p className="text-sm text-muted-foreground">Live system configuration records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="systemConfig"
        emptyLabel="No system config records found."
        columns={[
          { key: 'id', label: 'Config ID' },
          { key: 'value', label: 'Value' },
          { key: 'updatedAt', label: 'Updated' },
          { key: 'updatedBy', label: 'Updated By' }
        ]}
      />
    </main>
  );
}
