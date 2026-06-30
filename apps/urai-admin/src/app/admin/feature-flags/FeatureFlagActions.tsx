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
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const nextEnabled = !enabled;
  const confirmationPhrase = nextEnabled ? 'ENABLE FLAG' : 'DISABLE FLAG';

  function closeConfirmation() {
    if (isPending) return;
    setIsConfirming(false);
    setConfirmationText('');
  }

  async function updateFlag() {
    if (confirmationText !== confirmationPhrase) return;

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

      closeConfirmation();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature flag');
    } finally {
      setIsPending(false);
    }
  }

  const confirmationMatches = confirmationText === confirmationPhrase;

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          setConfirmationText('');
          setIsConfirming(true);
        }}
        className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Saving...' : enabled ? 'Disable' : 'Enable'}
      </button>
      {isConfirming ? (
        <div className="max-w-md rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 shadow-sm" role="alertdialog" aria-modal="true">
          <div className="font-semibold">Confirm feature flag change</div>
          <p className="mt-1 leading-5">
            This changes a runtime flag and may affect product access or operator behavior. The server requires an owner/admin session and records an audit log.
          </p>
          <label className="mt-3 block font-medium" htmlFor={`confirm-flag-${flagId}`}>
            Type <span className="font-mono">{confirmationPhrase}</span> to continue.
          </label>
          <input
            id={`confirm-flag-${flagId}`}
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            className="mt-1 w-full rounded-md border bg-white px-2 py-1 font-mono text-xs text-slate-950"
            autoComplete="off"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!confirmationMatches || isPending}
              onClick={updateFlag}
              className="rounded-md border border-amber-700 bg-amber-700 px-3 py-1 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Confirm'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={closeConfirmation}
              className="rounded-md border px-3 py-1 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {error ? <div className="max-w-48 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
