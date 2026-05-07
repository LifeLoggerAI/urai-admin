import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

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
            if (event.userId) dau.add(event.userId);
            eventsByName[event.eventName] = (eventsByName[event.eventName] || 0) + 1;
        });

        const batch = db.batch();
        
        // Idempotent write for DAU
        const dauRef = db.collection("analytics_aggregates").doc(`dau_${dateStr}`);
        batch.set(dauRef, { date: dateStr, count: dau.size });

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
        
    } catch (error: any) {
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: error.message });
    }
});

// --- Next.js Hosting ---
// This function is the server-side renderer for the Next.js app.
import next from 'next';

const isDev = process.env.NODE_ENV !== 'production';
// Assumes the script is run from the monorepo root
const nextApp = next({ dev: isDev, conf: { distDir: '../apps/urai-admin/.next' } });
const handle = nextApp.getRequestHandler();

export const nextServer = functions.https.onRequest((req, res) => {
  return nextApp.prepare().then(() => handle(req, res));
});
