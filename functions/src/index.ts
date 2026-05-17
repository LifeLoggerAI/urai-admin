import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import next from "next";
import path from "path";

admin.initializeApp();
const db = admin.firestore();

// --- SCHEDULED AGGREGATION JOB ---
export const aggregateAnalytics = functions.runWith({ memory: "512MB", timeoutSeconds: 300 }).pubsub.schedule("every 24 hours").onRun(async (context) => {
    const jobId = "aggregateAnalytics";
    const runId = context.eventId;
    const runRef = db.collection("analytics_job_runs").doc(jobId).collection("runs").doc(runId);

    await runRef.set({ status: "started", startedAt: new Date(), processedCount: 0 });

    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split("T")[0];
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
            if (typeof event.userId === "string") dau.add(event.userId);
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
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: message });
    }
});

// --- Production verification endpoints ---
export const api_health = functions.https.onRequest((_req, res) => {
  res.status(200).json({ status: "ok" });
});

export const admin_whoami = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    return;
  }

  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: "UNAUTHENTICATED" });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    const role = typeof decoded.role === "string" ? decoded.role : null;
    const isAdmin = decoded.admin === true || role === "owner" || role === "admin";

    if (!isAdmin) {
      res.status(403).json({ error: "PERMISSION_DENIED" });
      return;
    }

    res.status(200).json({
      uid: decoded.uid,
      email: decoded.email ?? null,
      role,
      admin: decoded.admin === true,
    });
  } catch (error: unknown) {
    console.error("admin_whoami verification failed", error);
    res.status(403).json({ error: "PERMISSION_DENIED" });
  }
});

// --- Next.js Hosting ---
// The launch script packages apps/urai-admin/.next into functions/.next before deploy.
const isDev = process.env.NODE_ENV !== "production";
const appDir = path.resolve(__dirname, "..");
const nextApp = next({ dev: isDev, dir: appDir, conf: { distDir: ".next" } });
const handle = nextApp.getRequestHandler();
const nextReady = nextApp.prepare();

export const nextServer = functions.runWith({ memory: "1GB", timeoutSeconds: 60 }).https.onRequest(async (req, res) => {
  await nextReady;
  return handle(req, res);
});
