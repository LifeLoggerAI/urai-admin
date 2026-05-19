import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function AuditPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Traceability layer"
      title="Audit log"
      description="Review admin actions, actors, targets, and before or after metadata from the authenticated runtime admin API."
      signalValue="Action ledger"
      collection="auditLogs"
      emptyLabel="No audit logs found."
      columns={[
        { key: 'id', label: 'Log' },
        { key: 'actorEmail', label: 'Actor' },
        { key: 'action', label: 'Action' },
        { key: 'target', label: 'Target' },
        { key: 'createdAt', label: 'Created' },
      ]}
    />
  );
}
