import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function SystemPage() {
  return (
    <SpatialCollectionPage
      eyebrow="System registry"
      title="URAI system-of-systems registry"
      description="Inspect the live canonical registry. Systems without exact deployment, rollback, smoke, and monitoring evidence remain Not connected, Blocked, or Degraded. Evidence date reflects the underlying release assessment; seeded time only records when that snapshot was written to this registry."
      signalValue="Release truth"
      collection="systemRegistry"
      emptyLabel="No canonical system registry records found. Run the guarded seed only against an approved target."
      columns={[
        { key: 'name', label: 'System' },
        { key: 'repo', label: 'Repository' },
        { key: 'status', label: 'Status' },
        { key: 'productionUrl', label: 'Production surface' },
        { key: 'lastReleaseSha', label: 'Release SHA' },
        { key: 'rollbackSha', label: 'Rollback SHA' },
        { key: 'lastSmokeResult', label: 'Smoke' },
        { key: 'monitoringUrl', label: 'Monitoring' },
        { key: 'registryEvidenceDate', label: 'Evidence date' },
        { key: 'updatedAt', label: 'Seeded / updated' },
      ]}
    />
  );
}