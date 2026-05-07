'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminRole = 'owner' | 'admin' | 'viewer';

type AdminUserActionsProps = {
  uid: string;
  role: string | null;
  isActive: boolean;
};

const roles: AdminRole[] = ['owner', 'admin', 'viewer'];

export function AdminUserActions({ uid, role, isActive }: AdminUserActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function setActive(nextActive: boolean) {
    if (!nextActive) {
      const confirmed = window.confirm(
        'Deactivate this admin user? They will immediately lose console access.',
      );

      if (!confirmed) {
        return;
      }
    }

    setPendingAction(nextActive ? 'activate' : 'deactivate');
    setError(null);
    setSuccess(null);

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

      router.refresh();
      setSuccess(nextActive ? 'Admin user activated.' : 'Admin user deactivated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin user');
    } finally {
      setPendingAction(null);
    }
  }

  async function updateRole(nextRole: AdminRole) {
    if (nextRole === role) return;

    if (role === 'owner' || nextRole === 'owner') {
      const confirmed = window.confirm(
        `Change this admin role from ${role ?? 'unknown'} to ${nextRole}? Owner role changes are high impact.`,
      );

      if (!confirmed) {
        return;
      }
    }

    setPendingAction(`role:${nextRole}`);
    setError(null);
    setSuccess(null);

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

      router.refresh();
      setSuccess(`Admin role updated to ${nextRole}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin role');
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => setActive(!isActive)}
          className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
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
          onChange={(event) => updateRole(event.target.value as AdminRole)}
          className="rounded-md border bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Change admin role"
        >
          <option value="" disabled>Role</option>
          {roles.map((nextRole) => (
            <option key={nextRole} value={nextRole}>{nextRole}</option>
          ))}
        </select>
      </div>
      <div className="min-h-4" aria-live="polite">
        {error ? <div className="max-w-56 text-xs text-red-600">{error}</div> : success ? <div className="max-w-56 text-xs text-green-600">{success}</div> : null}
      </div>
    </div>
  );
}
