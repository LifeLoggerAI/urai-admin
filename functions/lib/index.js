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
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateAnalytics = exports.adminSetUserFlag = exports.adminRetryJob = exports.adminListAuthUsers = exports.bootstrapAdmin = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
/**
 * Writes a record to the centralized audit log.
 * @param {string} action - The action performed (e.g., 'login', 'update-user').
 * @param {{ uid: string, email?: string }} actor - The user who performed the action.
 * @param {object} details - Additional details about the event.
 */
const adminWriteAuditLog = (action, actor, details = {}) => {
    if (!actor.uid) {
        console.error("Audit log write failed: actor.uid is mandatory.");
        return;
    }
    db.collection("auditLogs").add({
        action,
        actor: {
            uid: actor.uid,
            email: actor.email || "N/A",
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ...details,
    });
};
/**
 * Verifies if a user has admin privileges.
 * @param {string} uid - The user's ID to check.
 * @returns {Promise<boolean>} - True if the user is an active admin or owner.
 */
const verifyAdmin = async (uid) => {
    try {
        const adminUserDoc = await db.collection("adminUsers").doc(uid).get();
        if (!adminUserDoc.exists)
            return false;
        const adminUserData = adminUserDoc.data();
        if (!adminUserData)
            return false;
        return (adminUserData.isActive === true &&
            ["admin", "owner"].includes(adminUserData.role));
    }
    catch (error) {
        console.error("Error verifying admin status:", error);
        return false;
    }
};
// -----------------------------------------------------------------------------
// CALLABLE FUNCTIONS
// -----------------------------------------------------------------------------
/**
 * Bootstraps the first admin user if the `adminUsers` collection is empty
 * and the correct environment variable is set.
 */
exports.bootstrapAdmin = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be authenticated to call this function.");
    }
    const { uid, token } = context.auth;
    const email = token.email || "N/A";
    // Check for bootstrap environment variable
    if (process.env.ALLOW_ADMIN_BOOTSTRAP !== "true") {
        throw new functions.https.HttpsError("permission-denied", "Admin bootstrapping is not enabled.");
    }
    // Ensure the adminUsers collection is empty
    const adminUsersSnapshot = await db.collection("adminUsers").limit(1).get();
    if (!adminUsersSnapshot.empty) {
        throw new functions.https.HttpsError("already-exists", "An admin user already exists. Bootstrap is disabled.");
    }
    // Create the first owner
    await db.collection("adminUsers").doc(uid).set({
        email,
        role: "owner",
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    adminWriteAuditLog("bootstrap-admin-owner", { uid, email });
    return { status: "success", message: `User ${email} is now the owner.` };
});
/**
 * Lists all Firebase Authentication users.
 * Requires the caller to be an authenticated admin.
 */
exports.adminListAuthUsers = functions.https.onCall(async (data, context) => {
    if (!context.auth || !(await verifyAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "You do not have permission to perform this action.");
    }
    try {
        const userRecords = await admin.auth().listUsers();
        const users = userRecords.users.map((user) => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
        }));
        adminWriteAuditLog("list-auth-users", context.auth);
        return users;
    }
    catch (error) {
        console.error("Error listing users:", error);
        throw new functions.https.HttpsError("internal", "An internal error occurred while listing users.");
    }
});
/**
 * Marks a job for retry.
 * Requires the caller to be an authenticated admin.
 */
exports.adminRetryJob = functions.https.onCall(async (data, context) => {
    if (!context.auth || !(await verifyAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "You do not have permission.");
    }
    const { jobId } = data;
    if (!jobId || typeof jobId !== 'string') {
        throw new functions.https.HttpsError("invalid-argument", "A valid 'jobId' must be provided.");
    }
    // Example: Write to a 'jobRetries' collection to trigger a retry.
    await db.collection("jobRetries").add({
        jobId,
        requestedBy: context.auth.uid,
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
    });
    adminWriteAuditLog("retry-job", context.auth, { jobId });
    return { status: "success", message: `Job ${jobId} marked for retry.` };
});
/**
 * Sets a specific flag on a user's profile document (not Auth user).
 * Requires the caller to be an authenticated admin.
 */
exports.adminSetUserFlag = functions.https.onCall(async (data, context) => {
    if (!context.auth || !(await verifyAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "You do not have permission.");
    }
    const { targetUid, flagName, flagValue } = data;
    if (!targetUid || !flagName) {
        throw new functions.https.HttpsError("invalid-argument", "'targetUid' and 'flagName' are required.");
    }
    const userRef = db.collection("users").doc(targetUid);
    await userRef.set({
        flags: { [flagName]: flagValue }
    }, { merge: true });
    adminWriteAuditLog("set-user-flag", context.auth, { targetUid, flagName, flagValue });
    return { status: "success", message: `Flag '${flagName}' updated for user ${targetUid}.` };
});
// -----------------------------------------------------------------------------
// SCHEDULED JOBS
// -----------------------------------------------------------------------------
/**
 * Aggregates raw analytics events into daily summaries.
 * Runs every 24 hours.
 */
exports.aggregateAnalytics = functions
    .runWith({ memory: "512MB", timeoutSeconds: 300 })
    .pubsub.schedule("every 24 hours")
    .onRun(async (context) => {
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
        const dau = new Set();
        const eventsByName = {};
        rawEventsSnapshot.forEach(doc => {
            const event = doc.data();
            if (event.userId)
                dau.add(event.userId);
            eventsByName[event.eventName] = (eventsByName[event.eventName] || 0) + 1;
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
            results: { dau: dau.size, uniqueEvents: Object.keys(eventsByName).length },
        });
    }
    catch (error) {
        console.error(`[${jobId}:${runId}] FAILED:`, error);
        await runRef.update({ status: "failed", finishedAt: new Date(), error: (error instanceof Error ? error.message : String(error)) });
    }
});
