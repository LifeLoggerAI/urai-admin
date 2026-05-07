"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextServer = exports.aggregateAnalytics = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// --- SCHEDULED AGGREGATION JOB ---
exports.aggregateAnalytics = functions.runWith({ memory: '512MB', timeoutSeconds: 300 }).pubsub.schedule("every 24 hours").onRun(async (context) => {
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
        const dau = new Set();
        const eventsByName = {};
        rawEventsSnapshot.forEach(doc => {
            const event = doc.data();
            if (event.userId)
                dau.add(event.userId);
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
    }
    catch (error) {
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: error.message });
    }
});
// --- Next.js Hosting ---
// This function is the server-side renderer for the Next.js app.
const next_1 = __importDefault(require("next"));
const isDev = process.env.NODE_ENV !== 'production';
// Assumes the script is run from the monorepo root
const nextApp = (0, next_1.default)({ dev: isDev, conf: { distDir: '../apps/urai-admin/.next' } });
const handle = nextApp.getRequestHandler();
exports.nextServer = functions.https.onRequest((req, res) => {
    return nextApp.prepare().then(() => handle(req, res));
});
