import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type DeadLetterRow = {
  id: string;
  source: string;
  reason: string;
  lastError: string;
  attempts: number | null;
  createdAt: unknown;
};

async function getDeadLetters(): Promise<DeadLetterRow[]> {
  const snapshot = await firestore.collection('deadLetters').limit(200).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      source: typeof data.source === 'string' ? data.source : '—',
      reason: typeof data.reason === 'string' ? data.reason : '—',
      lastError: typeof data.lastError === 'string' ? data.lastError : '—',
      attempts: typeof data.attempts === 'number' ? data.attempts : null,
      createdAt: data.createdAt ?? data.updatedAt ?? null,
    };
  });
}

export default async function DeadLettersPage() {
  const letters = await getDeadLetters();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dead Letters</h1>
        <p className="text-sm text-muted-foreground">Read-only queue failures that need operational follow-up.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Letter</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Last Error</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {letters.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>No dead letters found.</td>
              </tr>
            ) : (
              letters.map((letter) => (
                <tr key={letter.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{letter.id}</td>
                  <td className="px-4 py-3">{letter.source}</td>
                  <td className="px-4 py-3">{letter.reason}</td>
                  <td className="max-w-lg truncate px-4 py-3 font-mono text-xs">{letter.lastError}</td>
                  <td className="px-4 py-3">{letter.attempts ?? '—'}</td>
                  <td className="px-4 py-3">{formatDate(letter.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
