import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function FeatureFlagsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-sm text-muted-foreground">Live feature flag records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="featureFlags"
        emptyLabel="No feature flags found."
        columns={[
          { key: 'id', label: 'Flag ID' },
          { key: 'name', label: 'Name' },
          { key: 'enabled', label: 'Enabled' },
          { key: 'rollout', label: 'Rollout' },
          { key: 'updatedAt', label: 'Updated' }
        ]}
      />
    </main>
  );
}
