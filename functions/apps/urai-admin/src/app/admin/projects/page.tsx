import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function ProjectsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Product registry"
      title="Project registry"
      description="Track registered URAI products, ownership, operational status, and recent updates through the authenticated runtime admin API."
      signalValue="Product map"
      collection="projectRegistry"
      emptyLabel="No projects found."
      columns={[
        { key: 'id', label: 'Project ID' },
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Owner' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
