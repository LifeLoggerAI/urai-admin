'use client';

import { useEffect, useMemo, useState } from 'react';

export type CollectionKey =
  | 'adminUsers'
  | 'projectRegistry'
  | 'featureFlags'
  | 'jobs'
  | 'jobRuns'
  | 'deadLetters'
  | 'roles'
  | 'systemConfig'
  | 'systemRegistry'
  | 'privacyRequests'
  | 'auditLogs';

export type AdminColumn = { key: string; label: string };

type RecordValue = string | number | boolean | null | Record<string, unknown> | unknown[];
type AdminRecord = Record<string, RecordValue> & { id: string };

type AdminCollectionTableProps = {
  collection: CollectionKey;
  columns: AdminColumn[];
  emptyLabel: string;
  limit?: number;
};

function formatValue(value: RecordValue | undefined) {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    if (value === 'not_connected') return 'Not connected';
    if (value === 'staging_ready') return 'Staging ready';
    if (value === 'production_ready') return 'Production ready';
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function AdminCollectionTable({ collection, columns, emptyLabel, limit = 100 }: AdminCollectionTableProps) {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams({ collection, limit: String(limit) });
    return `/api/admin/collection?${params.toString()}`;
  }, [collection, limit]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(query, { cache: 'no-store' });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(typeof payload.error === 'string' ? payload.error : 'Failed to load records');
        }

        if (!cancelled) {
          setRecords(Array.isArray(payload.records) ? payload.records : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load records');
          setRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <div className="spatial-table-state">
        <span>Syncing live records</span>
        <strong>{collection}</strong>
        <p>Secure runtime data is loading through the authenticated admin API.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spatial-table-state spatial-table-error" role="alert">
        <span>Runtime API error</span>
        <strong>Unable to load {collection}</strong>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="spatial-table-shell">
      <div className="spatial-table-meta">
        <span>{collection}</span>
        <strong>{records.length} records</strong>
      </div>
      <div className="overflow-x-auto">
        <table className="spatial-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td className="spatial-table-empty" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  {columns.map((column) => (
                    <td key={column.key} title={formatValue(record[column.key])}>
                      {formatValue(record[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
