'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FeatureFlagActionsProps = {
  flagId: string;
  enabled: boolean;
  rollout: number | null;
};

export function FeatureFlagActions({ flagId, enabled, rollout }: FeatureFlagActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateFlag(nextEnabled: boolean) {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/set-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flagId,
          enabled: nextEnabled,
          rollout: rollout ?? undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? data?.message ?? 'Failed to update feature flag');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature flag');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => updateFlag(!enabled)}
        className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Saving...' : enabled ? 'Disable' : 'Enable'}
      </button>
      {error ? <div className="max-w-48 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
