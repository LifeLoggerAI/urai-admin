import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { defineString } from 'firebase-functions/params';
import next from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export { aggregateUraiAnalyticsV1 } from './uraiAnalyticsV1';

admin.initializeApp();
const db = admin.firestore();

function errorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown error";
    }
}

// --- SCHEDULED AGGREGATION JOB ---
export const aggregateAnalytics = functions.runWith({ memory: '512MB', timeoutSeconds: 300 }).pubsub.schedule("every 24 hours").onRun(async (context) => {
    const jobId = "aggregateAnalytics";
    const runId = context.eventId;
    const runRef = db.collection("analytics_job_runs").doc(jobId).collection("runs").doc(runId);

    await runRef.set({ status: "started", startedAt: new Date(), processedCount: 0 });

    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];
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
            if (typeof event.userId === "string") {
                dau.add(event.userId);
            }
            if (typeof event.eventName === "string") {
                eventsByName[event.eventName] = (eventsByName[event.eventName] || 0) + 1;
            }
        });

        const batch = db.batch();
        
        const dauRef = db.collection("analytics_aggregates").doc(`dau_${dateStr}`);
        batch.set(dauRef, { date: dateStr, count: dau.size });

        const eventsRef = db.collection("analytics_aggregates").doc(`events_${dateStr}`);
        batch.set(eventsRef, { date: dateStr, counts: eventsByName });

        await batch.commit();
        
        await runRef.update({ 
            status: "completed", 
            finishedAt: new Date(), 
            processedCount: rawEventsSnapshot.size,
            results: { dau: dau.size, uniqueEvents: Object.keys(eventsByName).length }
        });
        
    } catch (error: unknown) {
        const message = errorMessage(error);
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: message });
    }
});

// --- Next.js Hosting ---
// The production build step packages apps/urai-admin into functions/apps/urai-admin
// so Firebase Functions deploys a self-contained server-rendered Next app.
const adminProductionUrl = defineString('URAI_ADMIN_PRODUCTION_URL');
const adminAllowedOrigins = defineString('URAI_ADMIN_ALLOWED_ORIGINS');

function bindAdminOriginEnvironment() {
  const productionUrl = adminProductionUrl.value().trim();
  const allowedOrigins = adminAllowedOrigins.value().trim();
  if (!productionUrl || !allowedOrigins) {
    throw new Error('Deployed Admin origin parameters are not configured.');
  }
  process.env.URAI_ADMIN_PRODUCTION_URL = productionUrl;
  process.env.URAI_ADMIN_ALLOWED_ORIGINS = allowedOrigins;
}

const packagedNextAppDir = join(__dirname, '..', 'apps', 'urai-admin');
const isDev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev: isDev, dir: packagedNextAppDir });
const handle = nextApp.getRequestHandler();

export interface AdminReadinessInput {
  projectIdentityPresent: boolean;
  revisionPresent: boolean;
  productionUrl: string;
  allowedOrigins: string;
  packagedAppPresent: boolean;
}

export interface AdminReadinessResult {
  ready: boolean;
  checks: Record<string, boolean>;
}

function httpsOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

export function evaluateAdminReadiness(input: AdminReadinessInput): AdminReadinessResult {
  const productionOrigin = httpsOrigin(input.productionUrl);
  const allowed = input.allowedOrigins.split(',').map((value) => value.trim()).filter(Boolean);
  const allowedOrigins = allowed.map(httpsOrigin);
  const checks = {
    projectIdentity: input.projectIdentityPresent,
    runtimeRevision: input.revisionPresent,
    productionOriginHttps: productionOrigin !== null,
    allowedOriginsPresent: allowed.length > 0,
    allowedOriginsHttps: allowed.length > 0 && allowedOrigins.every((origin) => origin !== null),
    productionOriginAllowed: productionOrigin !== null && allowedOrigins.includes(productionOrigin),
    packagedAdminApp: input.packagedAppPresent,
  };
  return {ready: Object.values(checks).every(Boolean), checks};
}

export const health = functions.https.onRequest((_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({
    service: 'urai-admin',
    status: 'ok',
    projectIdentityPresent: Boolean(process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT),
    revisionPresent: Boolean(process.env.K_REVISION),
  });
});

export const readiness = functions.https.onRequest((_req, res) => {
  let productionUrl = '';
  let allowedOrigins = '';
  try {
    productionUrl = adminProductionUrl.value().trim();
    allowedOrigins = adminAllowedOrigins.value().trim();
  } catch {
    // Missing protected runtime parameters are represented only as failed booleans below.
  }

  const result = evaluateAdminReadiness({
    projectIdentityPresent: Boolean(process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT),
    revisionPresent: Boolean(process.env.K_REVISION),
    productionUrl,
    allowedOrigins,
    packagedAppPresent: existsSync(join(packagedNextAppDir, 'package.json')),
  });

  res.set('Cache-Control', 'no-store');
  res.status(result.ready ? 200 : 503).json({
    service: 'urai-admin',
    status: result.ready ? 'ready' : 'not_ready',
    checks: result.checks,
  });
});

export const nextServer = functions.https.onRequest((req, res) => {
  bindAdminOriginEnvironment();
  return nextApp.prepare().then(() => handle(req, res));
});
