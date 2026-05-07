import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

function renderMetadata(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

type AuditLogRow = {
  id: string;
  actorUid: string | null;
  actorEmail: string | null;
  actorRole: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: unknown;
  createdAt: unknown;
};

async function getAuditLogs(): Promise<AuditLogRow[]> {
  const snapshot = await firestore.collection('auditLogs').orderBy('createdAt', 'desc').limit(200).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const target = data.target && typeof data.target === 'object' ? data.target : null;

    return {
      id: doc.id,
      actorUid: typeof data.actorUid === 'string' ? data.actorUid : null,
      actorEmail: typeof data.actorEmail === 'string' ? data.actorEmail : null,
      actorRole: typeof data.actorRole === 'string' ? data.actorRole : null,
      action: typeof data.action === 'string' ? data.action : 'unknown',
      targetType: target && 'type' in target ? String(target.type) : typeof data.targetType === 'string' ? data.targetType : null,
      targetId: target && 'id' in target ? String(target.id) : typeof data.targetId === 'string' ? data.targetId : null,
      metadata: data.metadata ?? data.meta ?? data.diff ?? null,
      createdAt: data.createdAt ?? data.ts ?? null,
    };
  });
}

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Recent admin actions, mutation targets, and before/after metadata.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>No audit logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t align-top">
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{log.actorEmail ?? log.actorUid ?? 'Unknown actor'}</div>
                    <div className="text-xs text-muted-foreground">{log.actorRole ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3">
                    <div>{log.targetType ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{log.targetId ?? '—'}</div>
                  </td>
                  <td className="max-w-xl truncate px-4 py-3 font-mono text-xs">{renderMetadata(log.metadata)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
