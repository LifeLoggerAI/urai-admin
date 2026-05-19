import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function FeatureFlagsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Release control"
      title="Feature flags"
      description="Inspect rollout state, enablement, targeting, and recent flag updates through the authenticated runtime admin API."
      signalValue="Rollout matrix"
      collection="featureFlags"
      emptyLabel="No feature flags found."
      columns={[
        { key: 'id', label: 'Flag' },
        { key: 'name', label: 'Name' },
        { key: 'enabled', label: 'Enabled' },
        { key: 'rollout', label: 'Rollout' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
