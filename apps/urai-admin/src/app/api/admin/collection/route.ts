import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const COLLECTIONS = {
  adminUsers: { collection: 'adminUsers', orderBy: 'createdAt', direction: 'desc', roles: ['owner', 'admin'] },
  projectRegistry: { collection: 'projectRegistry', roles: ['owner', 'admin', 'viewer'] },
  featureFlags: { collection: 'featureFlags', orderBy: 'name', direction: 'asc', roles: ['owner', 'admin', 'viewer'] },
  jobs: { collection: 'jobs', roles: ['owner', 'admin', 'viewer'] },
  jobRuns: { collection: 'jobRuns', orderBy: 'startedAt', direction: 'desc', roles: ['owner', 'admin', 'viewer'] },
  deadLetters: { collection: 'deadLetters', orderBy: 'createdAt', direction: 'desc', roles: ['owner', 'admin', 'viewer'] },
  roles: { collection: 'roles', roles: ['owner', 'admin', 'viewer'] },
  systemConfig: { collection: 'systemConfig', orderBy: 'updatedAt', direction: 'desc', roles: ['owner', 'admin', 'viewer'] },
  auditLogs: { collection: 'auditLogs', orderBy: 'ts', direction: 'desc', roles: ['owner', 'admin'] },
} as const;

const REDACTED = '[REDACTED]';
const SENSITIVE_KEY_PATTERN = /(api[-_]?key|auth[-_]?token|bearer|client[-_]?secret|credential|id[-_]?token|private[-_]?key|refresh[-_]?token|secret|service[-_]?account|session|stripe|token|webhook[-_]?secret|password)/i;
const SAFE_SENSITIVE_KEYS = new Set(['status', 'statusText', 'role', 'isActive']);

type CollectionKey = keyof typeof COLLECTIONS;
type AdminRole = 'owner' | 'admin' | 'viewer';
type Direction = 'asc' | 'desc';

type FirestoreDocument = {
  id: string;
  data: () => Record<string, unknown>;
};

function isCollectionKey(value: string | null): value is CollectionKey {
  return Boolean(value && value in COLLECTIONS);
}

function parseLimit(value: string | null) {
  const parsed = value ? Number.parseInt(value, 10) : 100;

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 100;
  }

  return Math.min(parsed, 250);
}

function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, normalizeValue(nested)]),
    );
  }

  return value;
}

function isSensitiveKey(key: string) {
  return !SAFE_SENSITIVE_KEYS.has(key) && SENSITIVE_KEY_PATTERN.test(key);
}

function redactSensitiveFields(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (Array.isArray(value)) {
    return value.map(redactSensitiveFields);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        isSensitiveKey(key) ? REDACTED : redactSensitiveFields(nested),
      ]),
    );
  }

  return value;
}

function sanitizeRecord(data: Record<string, unknown>) {
  return redactSensitiveFields(normalizeValue(data)) as Record<string, unknown>;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionKey = searchParams.get('collection');

    if (!isCollectionKey(collectionKey)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    const config = COLLECTIONS[collectionKey];
    await requireAdminSession(req, [...config.roles] as AdminRole[]);

    let query = firestore.collection(config.collection).limit(parseLimit(searchParams.get('limit')));

    if ('orderBy' in config && config.orderBy) {
      query = firestore
        .collection(config.collection)
        .orderBy(config.orderBy, (config.direction ?? 'desc') as Direction)
        .limit(parseLimit(searchParams.get('limit')));
    }

    const snapshot = await query.get();
    const records = (snapshot.docs as FirestoreDocument[]).map((doc: FirestoreDocument) => ({
      id: doc.id,
      ...sanitizeRecord(doc.data()),
    }));

    return NextResponse.json({ collection: collectionKey, records });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to read admin collection:', error);
    return NextResponse.json({ error: 'Failed to read admin collection' }, { status: 500 });
  }
}
