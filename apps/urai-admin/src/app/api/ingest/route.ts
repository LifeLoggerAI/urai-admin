import { NextResponse } from 'next/server';
import { AnalyticsEventSchemaV1 } from '@/lib/analytics/schema';

// Firebase Admin is intentionally initialized lazily inside the handler because
// Next.js evaluates route modules during production build/page-data collection.
// Runtime identity must come from provider Application Default Credentials.

const BLOCKED_KEYS = ['email', 'password', 'token', 'secret', 'address', 'phone', 'ssn'];
const redact = (obj: any): any => {
  if (!obj) return obj;
  const newObj: any = {};
  for (const key in obj) {
    if (BLOCKED_KEYS.includes(key.toLowerCase())) {
      newObj[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      newObj[key] = redact(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

const FORBIDDEN_LONG_LIVED_FIREBASE_ENV = [
  'FIREBASE_ADMIN_SDK_JSON',
  'FIREBASE_SERVICE_ACCOUNT_KEY',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
] as const;

export async function POST(request: Request) {
  try {
    if (process.env.URAI_ADMIN_BUILD_STUB_FIREBASE === '1') {
      return NextResponse.json({ success: true, buildStub: true }, { status: 202 });
    }

    const configuredLegacyCredentials = FORBIDDEN_LONG_LIVED_FIREBASE_ENV.filter(
      (name) => Boolean(process.env[name]?.trim()),
    );
    if (configuredLegacyCredentials.length) {
      throw new Error(
        `URAI Admin ingest rejects long-lived Firebase credential variables: ${configuredLegacyCredentials.join(', ')}. Provider ADC/WIF is required.`,
      );
    }

    const { getFirestore } = await import('firebase-admin/firestore');
    const { initializeApp, getApps } = await import('firebase-admin/app');

    if (!getApps().length) {
      initializeApp();
    }

    const db = getFirestore();
    const body = await request.json();

    const validationResult = AnalyticsEventSchemaV1.safeParse(body);
    if (!validationResult.success) {
      console.warn('Invalid analytics event schema', validationResult.error.flatten());
      return NextResponse.json(
        { error: 'Invalid event schema', details: validationResult.error.flatten() },
        { status: 400 },
      );
    }

    const event = validationResult.data;

    if (!event.consent.granted) {
      return NextResponse.json({ error: 'Consent not granted for analytics.' }, { status: 403 });
    }

    if (event.properties) {
      event.properties = redact(event.properties);
    }

    const { eventId, timestamp } = event;
    const date = new Date(timestamp);
    const collectionName = `analytics_events_raw_${date.toISOString().split('T')[0]}`;
    const eventRef = db.collection(collectionName).doc(eventId);

    await eventRef.set(event);

    return NextResponse.json({ success: true, eventId }, { status: 202 });
  } catch (error) {
    console.error('INGESTION_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
