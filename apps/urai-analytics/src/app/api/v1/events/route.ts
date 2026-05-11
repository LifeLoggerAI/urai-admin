import { NextRequest, NextResponse } from 'next/server';
import {
  AnalyticsEventInputSchema,
  ApiKeySchema,
  assertAnalyticsConsent,
  assertApiKeyTenantScope,
  rawEventCollectionName,
  redactJsonValue,
  type ApiKey
} from '@urai/analytics-core';
import { db } from '@/lib/server/firebase-admin';
import { hashApiKey, hashIp, timingSafeEqualHex } from '@/lib/server/crypto';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = Number(process.env.URAI_ANALYTICS_INGEST_RATE_LIMIT_PER_MINUTE ?? 600);
const memoryRateLimit = new Map<string, { count: number; resetAt: number }>();

function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function rateLimit(key: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  const current = memoryRateLimit.get(key);
  if (!current || current.resetAt <= now) {
    memoryRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  current.count += 1;
  if (current.count > RATE_LIMIT_MAX) {
    return { ok: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { ok: true };
}

async function loadApiKey(rawKey: string): Promise<ApiKey | null> {
  const prefix = rawKey.split('_').slice(0, 2).join('_') || rawKey.slice(0, 12);
  const keyHash = hashApiKey(rawKey);
  const snapshot = await db.collectionGroup('apiKeys').where('prefix', '==', prefix).limit(10).get();

  for (const doc of snapshot.docs) {
    const parsed = ApiKeySchema.safeParse({ id: doc.id, ...doc.data() });
    if (!parsed.success) continue;
    if (timingSafeEqualHex(parsed.data.secretHash, keyHash)) {
      return parsed.data;
    }
  }
  return null;
}

async function auditRejected(reason: string, body: unknown, request: NextRequest) {
  await db.collection('analyticsAuditLogs').add({
    kind: 'event_ingest_rejected',
    reason,
    bodyPreview: JSON.stringify(body).slice(0, 2000),
    ipHash: hashIp(request.headers.get('x-forwarded-for') ?? request.ip ?? null),
    createdAt: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const rawKey = bearerToken(request);
  if (!rawKey) {
    await auditRejected('missing_api_key', body, request);
    return NextResponse.json({ error: 'missing_api_key' }, { status: 401 });
  }

  const limit = rateLimit(rawKey.slice(0, 24));
  if (!limit.ok) {
    await auditRejected('rate_limited', body, request);
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } });
  }

  const apiKey = await loadApiKey(rawKey);
  if (!apiKey) {
    await auditRejected('invalid_api_key', body, request);
    return NextResponse.json({ error: 'invalid_api_key' }, { status: 403 });
  }

  const parsedEvent = AnalyticsEventInputSchema.safeParse({ ...(body as Record<string, unknown>), apiKeyId: apiKey.id });
  if (!parsedEvent.success) {
    await auditRejected('invalid_event_schema', body, request);
    return NextResponse.json({ error: 'invalid_event_schema', issues: parsedEvent.error.flatten() }, { status: 400 });
  }

  const event = parsedEvent.data;
  const scopeCheck = assertApiKeyTenantScope(apiKey, {
    organizationId: event.organizationId,
    workspaceId: event.workspaceId,
    environment: event.environment
  });
  if (!scopeCheck.ok) {
    await auditRejected(scopeCheck.reason, body, request);
    return NextResponse.json({ error: scopeCheck.reason }, { status: 403 });
  }

  const consentCheck = assertAnalyticsConsent(event.consent);
  if (!consentCheck.ok) {
    await auditRejected(consentCheck.reason, body, request);
    return NextResponse.json({ error: consentCheck.reason }, { status: 403 });
  }

  const redacted = redactJsonValue(event.properties);
  const now = new Date().toISOString();
  const collectionName = rawEventCollectionName(new Date(event.timestamp));
  const docRef = db.collection(collectionName).doc(event.eventId);
  const storedEvent = {
    ...event,
    properties: redacted.value,
    redactedPaths: redacted.redactedPaths,
    ingestedAt: now,
    receivedAt: now,
    ipHash: hashIp(request.headers.get('x-forwarded-for') ?? request.ip ?? null),
    requestId: request.headers.get('x-request-id') ?? undefined,
    rejected: false
  };

  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(docRef);
    if (!existing.exists) {
      transaction.set(docRef, storedEvent);
      transaction.set(
        db.collection('organizations').doc(event.organizationId).collection('workspaces').doc(event.workspaceId).collection('ingestionHealth').doc(event.eventId),
        { eventId: event.eventId, status: 'accepted', redactedPaths: redacted.redactedPaths, createdAt: now }
      );
    }
  });

  await db.collection('organizations').doc(event.organizationId).collection('workspaces').doc(event.workspaceId).collection('apiKeyUsage').doc(apiKey.id).set(
    { lastUsedAt: now, lastEventId: event.eventId },
    { merge: true }
  );

  return NextResponse.json({ accepted: true, eventId: event.eventId, redactedPaths: redacted.redactedPaths }, { status: 202 });
}
