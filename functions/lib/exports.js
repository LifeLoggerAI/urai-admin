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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVerifyAuditLedger = exports.adminGetExportDownloadUrl = exports.adminRunExportJob = exports.adminCreateExport = void 0;
const https_1 = require("firebase-functions/v2/https");
const storage_1 = require("firebase-admin/storage");
const authz_1 = require("./authz");
const admin = __importStar(require("firebase-admin"));
const crypto_1 = require("crypto");
async function getLatest(collection) {
    const last = await admin.firestore().collection(collection).orderBy("ts", "desc").limit(1).get();
    if (last.empty) {
        return "GENESIS";
    }
    return last.docs[0].data().entryHash;
}
function canonicalize(obj) {
    const sorted = Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
    return JSON.stringify(sorted);
}
async function writeAudit(action) {
    const prevHash = await getLatest("adminAudit");
    const entry = {
        ts: new Date(),
        ...action,
        prevHash,
    };
    const canonical = canonicalize(entry);
    entry.entryHash = (0, crypto_1.createHash)("sha256").update(canonical).digest("hex");
    await admin.firestore().collection("adminAudit").add(entry);
}
exports.adminCreateExport = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { type, params } = request.data;
    const exportDoc = {
        ts: new Date(),
        actorUid: request.auth?.uid,
        actorEmail: request.auth?.token.email,
        type,
        params,
        status: "running",
    };
    const docRef = await admin.firestore().collection("adminExports").add(exportDoc);
    return { exportId: docRef.id };
});
exports.adminRunExportJob = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { exportId } = request.data;
    const exportDoc = await admin.firestore().collection("adminExports").doc(exportId).get();
    if (!exportDoc.exists) {
        throw new https_1.HttpsError("not-found", "Export not found");
    }
    const data = exportDoc.data();
    let csv = "";
    if (data.type === "users") {
        const users = await admin.auth().listUsers();
        csv = users.users.map(user => `${user.uid},${user.email},${user.disabled}`).join("\n");
    }
    const bucket = (0, storage_1.getStorage)().bucket();
    const filePath = `exports/${exportId}.csv`;
    const file = bucket.file(filePath);
    await file.save(csv);
    const sha256 = (0, crypto_1.createHash)("sha256").update(csv).digest("hex");
    await admin.firestore().collection("adminExports").doc(exportId).update({
        status: "done",
        filePath,
        rowCount: csv.split("\n").length,
        sha256,
    });
    return { success: true };
});
exports.adminGetExportDownloadUrl = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { exportId } = request.data;
    const exportDoc = await admin.firestore().collection("adminExports").doc(exportId).get();
    if (!exportDoc.exists) {
        throw new https_1.HttpsError("not-found", "Export not found");
    }
    const data = exportDoc.data();
    if (data.status !== "done") {
        throw new https_1.HttpsError("failed-precondition", "Export is not complete");
    }
    const bucket = (0, storage_1.getStorage)().bucket();
    const file = bucket.file(data.filePath);
    const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 15 });
    return { downloadUrl: url };
});
exports.adminVerifyAuditLedger = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const auditTrail = await admin.firestore().collection("adminAudit").orderBy("ts", "asc").get();
    let prevHash = "GENESIS";
    for (const doc of auditTrail.docs) {
        const entry = doc.data();
        const expectedHash = (0, crypto_1.createHash)("sha256").update(canonicalize({ ...entry, entryHash: undefined })).digest("hex");
        if (entry.prevHash !== prevHash) {
            return { ok: false, firstBadEntryId: doc.id, details: "prevHash mismatch" };
        }
        if (entry.entryHash !== expectedHash) {
            return { ok: false, firstBadEntryId: doc.id, details: "entryHash mismatch" };
        }
        prevHash = entry.entryHash;
    }
    return { ok: true };
});
//# sourceMappingURL=exports.js.map