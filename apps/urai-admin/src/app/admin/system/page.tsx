import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function SystemPage() {
  return (
    <SpatialCollectionPage
      eyebrow="System control"
      title="System control surface"
      description="Inspect live configuration, operational health values, update provenance, and runtime state from the authenticated admin API."
      signalValue="Config lattice"
      collection="systemConfig"
      emptyLabel="No system config records found."
      columns={[
        { key: 'id', label: 'Config' },
        { key: 'value', label: 'Value' },
        { key: 'updatedAt', label: 'Updated' },
        { key: 'updatedBy', label: 'Updated By' },
      ]}
    />
  );
}
