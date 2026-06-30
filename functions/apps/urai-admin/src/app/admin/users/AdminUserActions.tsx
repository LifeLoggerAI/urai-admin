'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminRole = 'owner' | 'admin' | 'viewer';

type AdminUserActionsProps = {
  uid: string;
  role: string | null;
  isActive: boolean;
};

type PendingConfirmation =
  | { type: 'active'; nextActive: boolean; phrase: string; title: string; body: string }
  | { type: 'role'; nextRole: AdminRole; phrase: string; title: string; body: string };

const roles: AdminRole[] = ['owner', 'admin', 'viewer'];

function roleLabel(value: string | null) {
  return value && roles.includes(value as AdminRole) ? value : 'unknown';
}

export function AdminUserActions({ uid, role, isActive }: AdminUserActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  function closeConfirmation() {
    if (pendingAction !== null) return;
    setPendingConfirmation(null);
    setConfirmationText('');
  }

  async function setActive(nextActive: boolean) {
    setPendingAction(nextActive ? 'activate' : 'deactivate');
    setError(null);

    try {
      const response = await fetch('/api/admin/set-user-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, isActive: nextActive }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to update admin user');
      }

      closeConfirmation();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin user');
    } finally {
      setPendingAction(null);
    }
  }

  async function updateRole(nextRole: AdminRole) {
    if (nextRole === role) return;

    setPendingAction(`role:${nextRole}`);
    setError(null);

    try {
      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, role: nextRole }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to update admin role');
      }

      closeConfirmation();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin role');
    } finally {
      setPendingAction(null);
    }
  }

  function requestActiveChange(nextActive: boolean) {
    const phrase = nextActive ? 'ACTIVATE ADMIN' : 'DEACTIVATE ADMIN';
    setPendingConfirmation({
      type: 'active',
      nextActive,
      phrase,
      title: nextActive ? 'Confirm admin activation' : 'Confirm admin deactivation',
      body: nextActive
        ? 'This will reactivate privileged console access for this admin user if the server-side role checks allow it.'
        : 'This will remove active privileged console access for this admin user. The server blocks self-deactivation and records an audit log.',
    });
    setConfirmationText('');
    setError(null);
  }

  function requestRoleChange(nextRole: AdminRole) {
    if (nextRole === role) return;

    const phrase = nextRole === 'owner' ? 'GRANT OWNER' : `SET ROLE ${nextRole.toUpperCase()}`;
    setPendingConfirmation({
      type: 'role',
      nextRole,
      phrase,
      title: nextRole === 'owner' ? 'Confirm owner escalation' : 'Confirm admin role change',
      body: `This will change the admin role from ${roleLabel(role)} to ${nextRole}. Owner escalation is especially sensitive and must only be performed by an authorized owner.`,
    });
    setConfirmationText('');
    setError(null);
  }

  async function confirmPendingAction() {
    if (!pendingConfirmation || confirmationText !== pendingConfirmation.phrase) return;

    if (pendingConfirmation.type === 'active') {
      await setActive(pendingConfirmation.nextActive);
      return;
    }

    await updateRole(pendingConfirmation.nextRole);
  }

  const confirmationMatches = Boolean(pendingConfirmation && confirmationText === pendingConfirmation.phrase);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => requestActiveChange(!isActive)}
          className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingAction === 'activate' || pendingAction === 'deactivate'
            ? 'Saving...'
            : isActive
              ? 'Deactivate'
              : 'Activate'}
        </button>
        <select
          value={roles.includes(role as AdminRole) ? role ?? '' : ''}
          disabled={pendingAction !== null}
          onChange={(event) => requestRoleChange(event.target.value as AdminRole)}
          className="rounded-md border bg-background px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Change admin role"
        >
          <option value="" disabled>Role</option>
          {roles.map((nextRole) => (
            <option key={nextRole} value={nextRole}>{nextRole}</option>
          ))}
        </select>
      </div>
      {pendingConfirmation ? (
        <div className="max-w-md rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 shadow-sm" role="alertdialog" aria-modal="true">
          <div className="font-semibold">{pendingConfirmation.title}</div>
          <p className="mt-1 leading-5">{pendingConfirmation.body}</p>
          <label className="mt-3 block font-medium" htmlFor={`confirm-${uid}`}>
            Type <span className="font-mono">{pendingConfirmation.phrase}</span> to continue.
          </label>
          <input
            id={`confirm-${uid}`}
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            className="mt-1 w-full rounded-md border bg-white px-2 py-1 font-mono text-xs text-slate-950"
            autoComplete="off"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!confirmationMatches || pendingAction !== null}
              onClick={confirmPendingAction}
              className="rounded-md border border-amber-700 bg-amber-700 px-3 py-1 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pendingAction ? 'Saving...' : 'Confirm'}
            </button>
            <button
              type="button"
              disabled={pendingAction !== null}
              onClick={closeConfirmation}
              className="rounded-md border px-3 py-1 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {error ? <div className="max-w-56 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
