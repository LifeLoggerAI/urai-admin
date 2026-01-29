import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { AnalyticsEventSchemaV1 } from '@/lib/analytics/schema';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  // Ensure the environment variable is set
  if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
    throw new Error('The FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
  }
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON))
  });
}

const db = getFirestore();

// Block known sensitive keys
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
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Schema Validation
    const validationResult = AnalyticsEventSchemaV1.safeParse(body);
    if (!validationResult.success) {
      console.warn('Invalid analytics event schema', validationResult.error.flatten());
      return NextResponse.json({ error: "Invalid event schema", details: validationResult.error.flatten() }, { status: 400 });
    }
    
    const event = validationResult.data;

    // 2. Consent Check (server-side enforcement)
    if (!event.consent.granted) {
      return NextResponse.json({ error: "Consent not granted for analytics." }, { status: 403 });
    }
    
    // 3. Redact sensitive properties
    if (event.properties) {
        event.properties = redact(event.properties);
    }

    // 4. Write to Firestore with idempotency
    const { eventId, timestamp } = event;
    const date = new Date(timestamp);
    const collectionName = `analytics_events_raw_${date.toISOString().split('T')[0]}`;
    
    const eventRef = db.collection(collectionName).doc(eventId);
    
    await eventRef.set(event);

    return NextResponse.json({ success: true, eventId }, { status: 202 });
  } catch (error) {
    console.error("INGESTION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
