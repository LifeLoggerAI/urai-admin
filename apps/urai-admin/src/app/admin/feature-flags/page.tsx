import { firestore } from '@/lib/firebase/admin';
import { FeatureFlagActions } from './FeatureFlagActions';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type FeatureFlagRow = {
  id: string;
  name: string;
  enabled: boolean;
  rollout: number | null;
  description: string | null;
  updatedAt: unknown;
  updatedBy: string | null;
};

async function getFeatureFlags(): Promise<FeatureFlagRow[]> {
  try {
    const snapshot = await firestore.collection('featureFlags').orderBy('name').limit(200).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: typeof data.name === 'string' ? data.name : doc.id,
        enabled: data.enabled === true,
        rollout: typeof data.rollout === 'number' ? data.rollout : null,
        description: typeof data.description === 'string' ? data.description : null,
        updatedAt: data.updatedAt ?? null,
        updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
      };
    });
  } catch (error) {
    console.warn('Unable to load feature flags during admin render:', error);
    return [];
  }
}

export default async function FeatureFlagsPage() {
  const flags = await getFeatureFlags();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-sm text-muted-foreground">Live feature flag state from Firestore. Mutations go through hardened admin APIs and audit logs.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Flag</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Rollout</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Updated By</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>No feature flags found.</td>
              </tr>
            ) : (
              flags.map((flag) => (
                <tr key={flag.id} className="border-t align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{flag.name}</div>
                    <div className="text-xs text-muted-foreground">{flag.id}</div>
                    {flag.description ? <div className="mt-1 text-xs text-muted-foreground">{flag.description}</div> : null}
                  </td>
                  <td className="px-4 py-3">{flag.enabled ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-3">{flag.rollout === null ? '—' : `${flag.rollout}%`}</td>
                  <td className="px-4 py-3">{formatDate(flag.updatedAt)}</td>
                  <td className="px-4 py-3">{flag.updatedBy ?? '—'}</td>
                  <td className="px-4 py-3"><FeatureFlagActions flagId={flag.id} enabled={flag.enabled} rollout={flag.rollout} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
