#!/bin/bash
# PATCH SET FOR URAI-ANALYTICS

set -e

# --- CONFIGURATION ---
TIMESTAMP=$(date +"%Y%m%dT%H%M%S")

# --- FILE BACKUPS ---
echo "2. CREATING BACKUPS..."
FILES_TO_MODIFY=(
    "firebase.json"
    "firestore.rules"
    "firestore.indexes.json"
    "functions/package.json"
    "functions/src/index.ts"
    "apps/urai-admin/package.json"
    "apps/urai-admin/src/app/(admin)/layout.tsx"
    "apps/urai-admin/src/middleware.ts"
    "apps/urai-admin/tsconfig.json"
)
for file in "${FILES_TO_MODIFY[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "${file}.bak.${TIMESTAMP}"
        echo "Backed up $file to ${file}.bak.${TIMESTAMP}"
    fi
done
echo "Backups CREATED."


# --- PATCH SET APPLICATION ---
echo "3. APPLYING PATCH SET..."

# A) Add zod dependency for schema validation
echo "--> Patching package.json files..."
jq '.dependencies.zod = "3.22.4"' apps/urai-admin/package.json > apps/urai-admin/package.json.tmp && mv apps/urai-admin/package.json.tmp apps/urai-admin/package.json
jq '.dependencies.zod = "3.22.4"' functions/package.json > functions/package.json.tmp && mv functions/package.json.tmp functions/package.json

# B) Create Event Schema
echo "--> Creating analytics schema file..."
mkdir -p apps/urai-admin/src/lib/analytics
cat << \'EOF\' > apps/urai-admin/src/lib/analytics/schema.ts
import { z } from \'zod\';

// 1. Core Event Schema v1
export const AnalyticsEventSchemaV1 = z.object({
  eventId: z.string().uuid().describe("Unique identifier for the event (UUID)."),
  eventName: z.string().min(1).max(100).describe("The name of the event, e.g., \'page_view\' or \'item_added_to_cart\'."),
  userId: z.string().nullable().describe("The ID of the user performing the action. Null for anonymous users."),
  sessionId: z.string().uuid().describe("The session ID for this user interaction."),
  timestamp: z.string().datetime().describe("ISO 8601 UTC timestamp of when the event occurred."),
  app: z.object({
    name: z.string().describe("Name of the application, e.g., \'urai-admin\'."),
    version: z.string().describe("Version of the application, e.g., \'1.2.3\'."),
  }),
  route: z.string().describe("The application route where the event occurred, e.g., \'/dashboard\'."),
  properties: z.record(z.any()).optional().describe("A JSON-serializable object for custom event properties."),
  consent: z.object({
    granted: z.boolean().describe("Whether the user has granted consent for this category of data processing."),
    category: z.string().describe("The consent category, e.g., \'analytics\', \'performance\'."),
  }).describe("Snapshot of user consent status at the time of the event."),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchemaV1>;
EOF

# C) Create Client-Side Tracker
echo "--> Creating analytics client helper..."
cat << \'EOF\' > apps/urai-admin/src/lib/analytics/client.ts
"use client";
import { v4 as uuidv4 } from \'uuid\';

// This is a placeholder. In a real app, this would come from a consent management platform.
const getConsentStatus = (category: string): boolean => {
  // Default to deny. Only track if consent is explicitly given.
  // Replace with actual integration with urai-privacy.
  if (typeof window !== \'undefined\') {
    const consent = localStorage.getItem("urai-consent");
    if (consent) {
        const parsed = JSON.parse(consent);
        return parsed[category] === true;
    }
  }
  return false;
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const consentGranted = getConsentStatus(\'analytics\');
  
  if (!consentGranted) {
    console.log(`[Analytics] Consent not granted for \'analytics\'. Event "${eventName}" NOT sent.`);
    return;
  }

  const eventPayload = {
    eventId: uuidv4(),
    eventName,
    userId: null, // Replace with actual user ID when available
    sessionId: getSessionId(), // Implement session management
    timestamp: new Date().toISOString(),
    app: {
      name: \'urai-admin\',
      version: process.env.NEXT_PUBLIC_APP_VERSION || \'0.1.0\',
    },
    route: window.location.pathname,
    properties: properties || {},
    consent: {
      granted: true,
      category: \'analytics\',
    },
  };

  // In a real app, you might batch these and send to /api/ingest
  // For this implementation, we use a beacon to ensure it sends on page unload.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(\'/api/ingest\', JSON.stringify(eventPayload));
  } else {
    fetch(\'/api/ingest\', {
      method: \'POST\',
      body: JSON.stringify(eventPayload),
      headers: { \'Content-Type\': \'application/json\' },
      keepalive: true,
    });
  }
};

function getSessionId(): string {
    const key = \'urai-session-id\';
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
}
EOF

# D) Create Ingestion API Route
echo "--> Creating Next.js ingestion API route..."
mkdir -p apps/urai-admin/src/app/api/ingest
cat << \'EOF\' > apps/urai-admin/src/app/api/ingest/route.ts
import { NextResponse } from \'next/server\';
import { getFirestore } from \'firebase-admin/firestore\';
import { initializeApp, getApps, cert } from \'firebase-admin/app\';
import { AnalyticsEventSchemaV1 } from \'@/lib/analytics/schema\';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON!))
  });
}

const db = getFirestore();

// Block known sensitive keys
const BLOCKED_KEYS = [\'email\', \'password\', \'token\', \'secret\', \'address\', \'phone\', \'ssn\'];
const redact = (obj: any): any => {
    if (!obj) return obj;
    const newObj: any = {};
    for (const key in obj) {
        if (BLOCKED_KEYS.includes(key.toLowerCase())) {
            newObj[key] = \'[REDACTED]\';
        } else if (typeof obj[key] === \'object\') {
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
    const collectionName = `analytics_events_raw_${date.toISOString().split(\'T\')[0]}`;
    
    const eventRef = db.collection(collectionName).doc(eventId);
    
    // Use set() for idempotency. If the doc exists, it\'s overwritten with the same data.
    await eventRef.set(event);

    return NextResponse.json({ success: true, eventId }, { status: 202 });
  } catch (error) {
    console.error("INGESTION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
EOF

# E) Create Aggregation and Scheduled Functions
echo "--> Patching Firebase Functions..."
cat << \'EOF\' > functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {AnalyticsEventSchemaV1} from "./schema"; // We\'ll copy the schema here

admin.initializeApp();
const db = admin.firestore();

// --- SCHEDULED AGGREGATION JOB ---
export const aggregateAnalytics = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
    const jobId = "aggregateAnalytics";
    const runId = context.eventId;
    const runRef = db.collection("analytics_job_runs").doc(jobId).collection("runs").doc(runId);

    await runRef.set({ status: "started", startedAt: new Date() });

    try {
        // Aggregate for yesterday
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split(\'T\')[0];
        const rawCollectionName = `analytics_events_raw_${dateStr}`;

        const rawEventsSnapshot = await db.collection(rawCollectionName).get();
        if (rawEventsSnapshot.empty) {
            await runRef.update({ status: "completed", finishedAt: new Date(), message: "No events to process." });
            return;
        }

        const dau = new Set<string>();
        const eventsByName: Record<string, number> = {};

        rawEventsSnapshot.forEach(doc => {
            const event = doc.data();
            if (event.userId) dau.add(event.userId);
            eventsByName[event.eventName] = (eventsByName[event.eventName] || 0) + 1;
        });

        const batch = db.batch();
        
        // Idempotent write for DAU
        const dauRef = db.collection("analytics_aggregates").doc(`dau_${dateStr}`);
        batch.set(dauRef, { date: dateStr, count: dau.size, userIds: Array.from(dau).slice(0, 100) }); // Store a sample

        // Idempotent write for event counts
        const eventsRef = db.collection("analytics_aggregates").doc(`events_${dateStr}`);
        batch.set(eventsRef, { date: dateStr, counts: eventsByName });

        await batch.commit();
        
        await runRef.update({ 
            status: "completed", 
            finishedAt: new Date(), 
            processedCount: rawEventsSnapshot.size,
            results: { dau: dau.size, uniqueEvents: Object.keys(eventsByName).length }
        });
        
    } catch (error) {
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: (error as Error).message });
    }
});


// We need the schema for validation if we were to create an ingestion function here.
// For now, we are using the Next.js route handler.
// Copying schema for type safety if needed elsewhere.
import { z } from \'zod\';
const AnalyticsEventSchemaV1_copy = z.object({
  eventId: z.string().uuid(),
  eventName: z.string(),
  userId: z.string().nullable(),
  sessionId: z.string().uuid(),
  timestamp: z.string().datetime(),
  app: z.object({ name: z.string(), version: z.string() }),
  route: z.string(),
  properties: z.record(z.any()).optional(),
  consent: z.object({ granted: z.boolean(), category: z.string() }),
});
EOF

# F) Update Firestore Rules for Security
echo "--> Updating firestore.rules..."
cat << \'EOF\' > firestore.rules
rules_version = \'2\';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Helper function to check for admin role
    function isAdmin() {
      return request.auth.token.admin == true;
    }

    // Deny all reads/writes by default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Raw events can only be created by a server-side process (e.g. Firebase Function or App Engine)
    // Client-side SDKs CANNOT write here. This assumes the Next.js route uses the Admin SDK.
    match /analytics_events_raw_{date}/{eventId} {
      allow read: if isAdmin(); // Admins can read for debugging
      allow write: if request.auth == null; // Deny client SDKs (auth is null for Admin SDK)
    }
    
    // Aggregates can only be read by admins
    match /analytics_aggregates/{aggregateId} {
      allow read: if isAdmin();
      allow write: if request.auth == null; // Allow server-side writes
    }
    
    // Job run logs
    match /analytics_job_runs/{jobId}/runs/{runId} {
        allow read: if isAdmin();
        allow write: if request.auth == null; // Allow server-side writes
    }

    // Allow users to read their own data, assuming a users collection exists
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF

# G) Update Firestore Indexes
echo "--> Updating firestore.indexes.json..."
cat << \'EOF\' > firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "analytics_events_raw",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "analytics_aggregates",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

# H) Update Firebase Deploy Configuration
echo "--> Updating firebase.json..."
cat << \'EOF\' > firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions"
  },
  "hosting": {
    "public": "apps/urai-admin/.next",
    "rewrites": [
      {
        "source": "**",
        "function": "nextServer"
      }
    ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
EOF

# I) Create placeholder analytics dashboard pages
echo "--> Creating analytics dashboard pages..."
mkdir -p apps/urai-admin/src/app/\(admin\)/analytics/
cat << \'EOF\' > apps/urai-admin/src/app/\(admin\)/analytics/page.tsx
"use client";
import React from \'react\';

export default function AnalyticsDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Daily Active Users (DAU)</h2>
          <p className="text-2xl">Loading...</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Events (24h)</h2>
          <p className="text-2xl">Loading...</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Top Routes</h2>
          <p className="text-sm">Loading...</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-500">This is a placeholder dashboard. Full implementation requires fetching and displaying data from Firestore aggregates.</p>
    </div>
  );
}
EOF

# J) Create a simple smoke test
echo "--> Creating smoke test file..."
mkdir -p apps/urai-admin/src/app/api/health
cat << \'EOF\' > apps/urai-admin/src/app/api/health/route.ts
import { NextResponse } from \'next/server\';

export async function GET() {
  return NextResponse.json({ status: \'ok\', timestamp: new Date().toISOString() });
}
EOF

# K) Update tsconfig to include new paths
echo "--> Updating tsconfig.json..."
sed -i \'/\"@\/lib\/\*\": \["src\/lib\/\*\"\]/a \\      "zod": ["node_modules/zod"]\' apps/urai-admin/tsconfig.json

echo "Patch set APPLIED."
