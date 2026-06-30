import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function SettingsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Control plane"
      title="Settings"
      description="Review production runtime settings, operational toggles, and configuration records through the authenticated admin API."
      signalValue="Runtime settings"
      collection="systemConfig"
      emptyLabel="No settings records found."
      columns={[
        { key: 'id', label: 'Setting' },
        { key: 'value', label: 'Value' },
        { key: 'description', label: 'Description' },
        { key: 'updatedAt', label: 'Updated' },
        { key: 'updatedBy', label: 'Updated By' },
      ]}
    />
  );
}
