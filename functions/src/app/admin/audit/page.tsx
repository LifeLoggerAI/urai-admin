import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function AuditPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Live audit records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="auditLogs"
        emptyLabel="No audit logs found."
        columns={[
          { key: 'id', label: 'Log ID' },
          { key: 'actorEmail', label: 'Actor' },
          { key: 'action', label: 'Action' },
          { key: 'target', label: 'Target' },
          { key: 'createdAt', label: 'Created' }
        ]}
      />
    </main>
  );
}
