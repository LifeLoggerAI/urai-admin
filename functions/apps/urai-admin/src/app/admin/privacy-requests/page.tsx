import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function PrivacyRequestsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Privacy operations"
      title="Privacy requests"
      description="Review data export, deletion, correction, and consent-related requests that require privileged privacy operations handling."
      signalValue="Privacy queue"
      collection="privacyRequests"
      emptyLabel="No privacy requests found."
      columns={[
        { key: 'id', label: 'Request' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'requesterEmail', label: 'Requester' },
        { key: 'createdAt', label: 'Created' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
