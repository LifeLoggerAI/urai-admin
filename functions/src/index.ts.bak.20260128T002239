
import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

// Initialize once
initializeApp();
const db = getFirestore();
const auth = getAuth();

type Role = "superadmin" | "admin" | "support" | "readonly";

const ensureAdmin = (context: any, requiredRoles: Role[]) => {
  const userRole = context.auth?.token?.role;
  if (!userRole) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  if (userRole === "superadmin") {
    return; // Superadmin bypasses role checks
  }
  if (!requiredRoles.includes(userRole)) {
    throw new HttpsError("permission-denied", `Caller does not have sufficient permissions. Required one of: ${requiredRoles.join(", ")}.`);
  }
};

const writeAuditLog = async (
  actorUid: string,
  action: string,
  target: string,
  reason?: string,
  before: any = {},
  after: any = {}
) => {
  const { role = "unknown" } = (await auth.getUser(actorUid).catch(() => ({})))?.customClaims || {};
  const logEntry = {
    actorUid,
    actorRole: role,
    action,
    target,
    reason,
    before: JSON.stringify(before),
    after: JSON.stringify(after),
    timestamp: FieldValue.serverTimestamp(),
  };
  await db.collection("adminAuditLogs").add(logEntry);
};

// --- User Management V2 ---
export const adminListUsersV2 = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { pageToken, limit = 50 } = request.data;
    
    try {
        const userRecords = await auth.listUsers(limit, pageToken);
        const uids = userRecords.users.map(u => u.uid);

        if (uids.length === 0) {
            return { users: [], nextPageToken: null };
        }

        const userDocsSnap = await db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", uids).get();
        const usersData: Record<string, any> = {};
        userDocsSnap.forEach(doc => {
            usersData[doc.id] = doc.data();
        });

        const combinedUsers = userRecords.users.map(user => {
            const firestoreData = usersData[user.uid] || {};
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                disabled: user.disabled,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
                role: user.customClaims?.role || null,
                ...firestoreData,
            };
        });

        return { users: combinedUsers, nextPageToken: userRecords.pageToken };
    } catch (error) {
        logger.error("adminListUsersV2 failed", error);
        throw new HttpsError("internal", "Failed to list users.");
    }
});

export const adminSetUserRoleV2 = onCall(async (request) => {
  ensureAdmin(request, ["superadmin", "admin"]);
  const { targetUid, newRole, reason } = request.data;
  const actorUid = request.auth!.uid;

  if (actorUid === targetUid) {
    throw new HttpsError("invalid-argument", "Admins cannot change their own role.");
  }
  if (newRole === "superadmin") {
      ensureAdmin(request, ["superadmin"]);
  }

  const user = await auth.getUser(targetUid);
  const oldRole = user.customClaims?.role || null;

  await auth.setCustomUserClaims(targetUid, { ...user.customClaims, role: newRole });
  await writeAuditLog(actorUid, "ADMIN_SET_ROLE", targetUid, reason, { role: oldRole }, { role: newRole });

  return { success: true, newRole };
});

export const adminUpdateUserFlags = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support"]);
    const { targetUid, flags, reason } = request.data;
    const actorUid = request.auth!.uid;
    const userRef = db.collection("users").doc(targetUid);
    
    const userDoc = await userRef.get();
    const beforeFlags = userDoc.exists ? userDoc.data() : {};

    await userRef.set(flags, { merge: true });
    await writeAuditLog(actorUid, "ADMIN_UPDATE_FLAGS", targetUid, reason, beforeFlags, flags);

    return { success: true };
});

// --- System ---
export const adminGetSystemStatus = onCall(async (request) => {
  ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
  const doc = await db.collection("system").doc("status").get();
  return doc.exists ? doc.data() : {};
});

export const adminUpdateSystemStatus = onCall(async (request) => {
  ensureAdmin(request, ["superadmin", "admin"]);
  const { newStatus, reason } = request.data;
  const actorUid = request.auth!.uid;
  const docRef = db.collection("system").doc("status");

  const before = (await docRef.get()).data() || {};
  await docRef.set(newStatus, { merge: true });
  await writeAuditLog(actorUid, "UPDATE_SYSTEM_STATUS", "system/status", reason, before, newStatus);
  
  return { success: true };
});

// --- Auditing ---
export const adminListAuditLogs = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { cursor, limit = 25 } = request.data;

    try {
        let query = db.collection("adminAuditLogs").orderBy("timestamp", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate().toISOString(),
        }));
        
        const nextCursor = logs.length === limit ? logs[logs.length - 1].timestamp : null;

        return { logs, nextCursor };

    } catch (error) {
        logger.error("adminListAuditLogs failed", error);
        throw new HttpsError("internal", "Failed to list audit logs.");
    }
});

// --- Execution Runs ---
export const adminListExecutionRuns = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { limit = 25, cursor, status, intent, version } = request.data;

    try {
        let query: admin.firestore.Query = db.collection("executionRuns");

        // Apply filters
        if (status) {
            query = query.where("status", "==", status);
        }
        if (intent) {
            query = query.where("intent", "==", intent);
        }
        if (version) {
            query = query.where("manifest.version", "==", version);
        }

        query = query.orderBy("createdAt", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const runs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
        }));

        const nextCursor = runs.length === limit ? runs[runs.length - 1].createdAt : null;

        return { runs, nextCursor };

    } catch (error) {
        logger.error("adminListExecutionRuns failed", error);
        throw new HttpsError("internal", "Failed to list execution runs.");
    }
});

const updateRunStatus = async (runId: string, newStatus: string, actorUid: string, reason: string) => {
    const runRef = db.collection("executionRuns").doc(runId);
    const runDoc = await runRef.get();

    if (!runDoc.exists) {
        throw new HttpsError("not-found", "Execution run not found.");
    }
    const before = runDoc.data();
    const after = { ...before, status: newStatus };

    await runRef.update({ status: newStatus });
    await writeAuditLog(actorUid, `RUN_${newStatus.toUpperCase()}`, runId, reason, before, after);

    return { success: true, runId, newStatus };
};


export const adminPauseRun = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support"]);
    const { runId, reason } = request.data;
    const actorUid = request.auth!.uid;
    return updateRunStatus(runId, "paused", actorUid, reason);
});

export const adminResumeRun = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support"]);
    const { runId, reason } = request.data;
    const actorUid = request.auth!.uid;
    return updateRunStatus(runId, "running", actorUid, reason);
});

export const adminCancelRun = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin"]);
    const { runId, reason } = request.data;
    const actorUid = request.auth!.uid;
    return updateRunStatus(runId, "canceled", actorUid, reason);
});

export const adminRerun = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin"]);
    const { runId, reason } = request.data;
    const actorUid = request.auth!.uid;
    
    const originalRunRef = db.collection("executionRuns").doc(runId);
    const originalRunDoc = await originalRunRef.get();

    if (!originalRunDoc.exists) {
        throw new HttpsError("not-found", "Original execution run not found.");
    }

    const originalData = originalRunDoc.data();
    
    const newRunData = {
        ...originalData,
        status: "queued",
        createdAt: FieldValue.serverTimestamp(),
        rerunOf: runId,
        runId: undefined,
    };

    const newRunRef = await db.collection("executionRuns").add(newRunData);
    
    await writeAuditLog(
        actorUid,
        "RUN_RERUN",
        newRunRef.id,
        reason,
        { originalRunId: runId },
        { newRunId: newRunRef.id }
    );
    
    return { success: true, newRunId: newRunRef.id };
});

// --- Asset Renders ---
export const adminListRenders = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { limit = 25, cursor, uid, runId } = request.data;

    try {
        let query: admin.firestore.Query = db.collection("assetRenders");

        // Apply filters
        if (uid) {
            query = query.where("uid", "==", uid);
        }
        if (runId) {
            query = query.where("runId", "==", runId);
        }

        query = query.orderBy("createdAt", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const renders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
        }));

        const nextCursor = renders.length === limit ? renders[renders.length - 1].createdAt : null;

        return { renders, nextCursor };

    } catch (error) {
        logger.error("adminListRenders failed", error);
        throw new HttpsError("internal", "Failed to list asset renders.");
    }
});

export const adminQueueAssetCleanup = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin"]);
    const { assetId, reason } = request.data;
    const actorUid = request.auth!.uid;

    if (!assetId || !reason) {
        throw new HttpsError("invalid-argument", "assetId and reason are required.");
    }
    
    const assetRef = db.collection("assetRenders").doc(assetId);
    const assetDoc = await assetRef.get();

    if (!assetDoc.exists) {
        throw new HttpsError("not-found", "Asset render not found.");
    }

    const cleanupJob = {
        assetId,
        assetData: assetDoc.data(),
        status: "queued",
        queuedAt: FieldValue.serverTimestamp(),
        queuedBy: actorUid,
        reason,
    };

    const newJobRef = await db.collection("cleanupJobs").add(cleanupJob);

    await writeAuditLog(
        actorUid,
        "QUEUE_ASSET_CLEANUP",
        assetId,
        reason,
        { assetId },
        { cleanupJobId: newJobRef.id }
    );

    return { success: true, cleanupJobId: newJobRef.id };
});

// --- Notifications ---
export const adminListNotificationLogs = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { limit = 25, cursor, status, userId } = request.data;

    try {
        let query: admin.firestore.Query = db.collection("notificationLogs");

        if (status) {
            query = query.where("status", "==", status);
        }
        if (userId) {
            query = query.where("userId", "==", userId);
        }

        query = query.orderBy("timestamp", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate().toISOString(),
        }));

        const nextCursor = logs.length === limit ? logs[logs.length - 1].timestamp : null;

        return { logs, nextCursor };

    } catch (error) {
        logger.error("adminListNotificationLogs failed", error);
        throw new HttpsError("internal", "Failed to list notification logs.");
    }
});

export const adminRetryNotification = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support"]);
    const { logId, reason } = request.data;
    const actorUid = request.auth!.uid;

    if (!logId || !reason) {
        throw new HttpsError("invalid-argument", "logId and reason are required.");
    }

    const logRef = db.collection("notificationLogs").doc(logId);
    const logDoc = await logRef.get();

    if (!logDoc.exists) {
        throw new HttpsError("not-found", "Notification log not found.");
    }
    
    const originalLog = logDoc.data();

    // Assuming the original log has the necessary payload to retry
    const retryJob = {
        originalLogId: logId,
        notificationPayload: originalLog?.payload, // This needs to exist in the log
        status: "queued",
        queuedAt: FieldValue.serverTimestamp(),
        queuedBy: actorUid,
        reason,
    };

    if (!retryJob.notificationPayload) {
        throw new HttpsError("failed-precondition", "Notification log does not contain a retryable payload.");
    }

    const newJobRef = await db.collection("notificationRetryJobs").add(retryJob);

    await writeAuditLog(
        actorUid,
        "RETRY_NOTIFICATION",
        logId,
        reason,
        { logId },
        { retryJobId: newJobRef.id }
    );
    
    // Also update the original log to show it's being retried
    await logRef.update({ status: 'retrying', retryJobId: newJobRef.id });

    return { success: true, retryJobId: newJobRef.id };
});


// Mock provider status
export const adminGetProviderStatus = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    // In a real app, this would hit external APIs (e.g., Twilio, SendGrid status pages)
    return {
        email: {
            provider: "SendGrid",
            status: "operational",
            lastChecked: new Date().toISOString()
        },
        sms: {
            provider: "Twilio",
            status: "degraded_performance",
            lastChecked: new Date().toISOString()
        }
    }
});

// --- Content / Templates ---

export const adminListTemplates = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { limit = 25, cursor } = request.data;
    
    try {
        let query = db.collection("filmTemplates").orderBy("updatedAt", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const templates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            updatedAt: doc.data().updatedAt.toDate().toISOString(),
        }));

        const nextCursor = templates.length === limit ? templates[templates.length - 1].updatedAt : null;
        return { templates, nextCursor };

    } catch (error) {
        logger.error("adminListTemplates failed", error);
        throw new HttpsError("internal", "Failed to list templates.");
    }
});

export const adminGetTemplateVersions = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin", "support", "readonly"]);
    const { templateId, limit = 10, cursor } = request.data;

    try {
        let query = db.collection("filmTemplates").doc(templateId).collection('versions').orderBy("createdAt", "desc").limit(limit);

        if (cursor) {
            query = query.startAfter(new Date(cursor));
        }

        const snapshot = await query.get();
        const versions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
        }));

        const nextCursor = versions.length === limit ? versions[versions.length - 1].createdAt : null;
        return { versions, nextCursor };
    
    } catch (error) {
        logger.error("adminGetTemplateVersions failed", error);
        throw new HttpsError("internal", "Failed to get template versions.");
    }
});


export const adminUpdateTemplate = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin"]);
    const { templateId, content, reason } = request.data;
    const actorUid = request.auth!.uid;

    // Basic validation
    if (!templateId || !content || !reason) {
        throw new HttpsError("invalid-argument", "templateId, content, and reason are required.");
    }

    const templateRef = db.collection("filmTemplates").doc(templateId);

    return db.runTransaction(async (transaction) => {
        const templateDoc = await transaction.get(templateRef);
        const oldData = templateDoc.exists ? templateDoc.data() : {};
        const newVersion = (oldData?.version || 0) + 1;
        
        const newVersionRef = templateRef.collection("versions").doc(`${newVersion}`);

        const versionData = {
            version: newVersion,
            content,
            createdAt: FieldValue.serverTimestamp(),
            createdBy: actorUid,
            reason,
        };
        
        transaction.set(newVersionRef, versionData);
        transaction.set(templateRef, {
            ...oldData,
            content,
            version: newVersion,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: actorUid,
        }, { merge: true });

        await writeAuditLog(actorUid, "UPDATE_TEMPLATE", templateId, reason, oldData, { content, version: newVersion });

        return { success: true, templateId, version: newVersion };
    });
});

export const adminRollbackTemplate = onCall(async (request) => {
    ensureAdmin(request, ["superadmin", "admin"]);
    const { templateId, versionId, reason } = request.data;
    const actorUid = request.auth!.uid;

    if (!templateId || !versionId || !reason) {
        throw new HttpsError("invalid-argument", "templateId, versionId, and reason are required.");
    }

    const versionRef = db.collection("filmTemplates").doc(templateId).collection("versions").doc(versionId);
    const versionDoc = await versionRef.get();

    if (!versionDoc.exists) {
        throw new HttpsError("not-found", "The specified template version does not exist.");
    }

    const rollbackContent = versionDoc.data()?.content;
    if (!rollbackContent) {
        throw new HttpsError("failed-precondition", "The specified version has no content to roll back to.");
    }

    // This will call the update function, creating a new version with the old content
    // It's safer as it preserves history.
    const rollbackReason = `Rollback to version ${versionId}. Reason: ${reason}`;
    
    // Re-using the logic from adminUpdateTemplate by calling it internally might be complex due to context.
    // So, we replicate the transaction logic here.
    const templateRef = db.collection("filmTemplates").doc(templateId);

    return db.runTransaction(async (transaction) => {
        const templateDoc = await transaction.get(templateRef);
        const oldData = templateDoc.data() || {};
        const newVersion = (oldData?.version || 0) + 1;
        
        const newVersionRef = templateRef.collection("versions").doc(`${newVersion}`);

        const versionData = {
            version: newVersion,
            content: rollbackContent,
            createdAt: FieldValue.serverTimestamp(),
            createdBy: actorUid,
            reason: rollbackReason,
        };
        
        transaction.set(newVersionRef, versionData);
        transaction.set(templateRef, {
            ...oldData,
            content: rollbackContent,
            version: newVersion,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: actorUid,
        }, { merge: true });

        await writeAuditLog(actorUid, "ROLLBACK_TEMPLATE", templateId, rollbackReason, oldData, { content: rollbackContent, version: newVersion });

        return { success: true, templateId, version: newVersion };
    });
});

export * from "./setAdminClaim";
