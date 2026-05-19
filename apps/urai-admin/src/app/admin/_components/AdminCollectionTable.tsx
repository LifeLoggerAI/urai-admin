'use client';

import { useEffect, useMemo, useState } from 'react';

type CollectionKey =
  | 'adminUsers'
  | 'projectRegistry'
  | 'featureFlags'
  | 'jobs'
  | 'jobRuns'
  | 'deadLetters'
  | 'roles'
  | 'systemConfig'
  | 'privacyRequests'
  | 'auditLogs';

type RecordValue = string | number | boolean | null | Record<string, unknown> | unknown[];
type AdminRecord = Record<string, RecordValue> & { id: string };

type AdminCollectionTableProps = {
  collection: CollectionKey;
  columns: Array<{ key: string; label: string }>;
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
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Loading {collection} records…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive" role="alert">
        <strong className="block font-semibold">Unable to load {collection}</strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground">
        <span>{collection}</span>
        <strong>{records.length} records</strong>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-t">
                  {columns.map((column) => (
                    <td key={column.key} className="max-w-[18rem] truncate px-4 py-3" title={formatValue(record[column.key])}>
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
