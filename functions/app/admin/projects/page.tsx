import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function ProjectsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Registry</h1>
        <p className="text-sm text-muted-foreground">Live project records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="projectRegistry"
        emptyLabel="No projects found."
        columns={[
          { key: 'id', label: 'Project ID' },
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'updatedAt', label: 'Updated' }
        ]}
      />
    </main>
  );
}
