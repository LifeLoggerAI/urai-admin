import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type ProjectRow = {
  id: string;
  name: string;
  status: string;
  owner: string | null;
  description: string | null;
  updatedAt: unknown;
};

async function getProjects(): Promise<ProjectRow[]> {
  try {
    const snapshot = await firestore.collection('projectRegistry').limit(200).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: typeof data.name === 'string' ? data.name : doc.id,
        status: typeof data.status === 'string' ? data.status : 'unknown',
        owner: typeof data.owner === 'string' ? data.owner : null,
        description: typeof data.description === 'string' ? data.description : null,
        updatedAt: data.updatedAt ?? data.createdAt ?? null,
      };
    });
  } catch (error) {
    console.warn('Unable to load projects during admin render:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Registry</h1>
        <p className="text-sm text-muted-foreground">Read-only view of registered URAI projects and operational ownership.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>No projects found.</td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-t align-top">
                  <td className="px-4 py-3"><div className="font-medium">{project.name}</div><div className="text-xs text-muted-foreground">{project.id}</div></td>
                  <td className="px-4 py-3">{project.status}</td>
                  <td className="px-4 py-3">{project.owner ?? '—'}</td>
                  <td className="max-w-lg truncate px-4 py-3">{project.description ?? '—'}</td>
                  <td className="px-4 py-3">{formatDate(project.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
