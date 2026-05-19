import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function PoliciesPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Governance layer"
      title="Roles and policies"
      description="Review admin roles, policy descriptions, permissions, and update state from the authenticated runtime admin API."
      signalValue="RBAC matrix"
      collection="roles"
      emptyLabel="No roles found."
      columns={[
        { key: 'id', label: 'Role' },
        { key: 'description', label: 'Description' },
        { key: 'permissions', label: 'Permissions' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
