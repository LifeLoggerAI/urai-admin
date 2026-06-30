import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function AdminUsersPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Identity control"
      title="Admin users"
      description="Review owners, admins, viewers, active access, and recent session state through the authenticated runtime admin API."
      signalValue="Access registry"
      collection="adminUsers"
      emptyLabel="No admin users found."
      columns={[
        { key: 'id', label: 'UID' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'isActive', label: 'Active' },
        { key: 'lastLoginAt', label: 'Last Login' },
      ]}
    />
  );
}
