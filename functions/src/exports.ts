import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { requireAdmin } from "./authz";
import * as admin from "firebase-admin";
import { createHash } from "crypto";

async function getLatest(collection: string): Promise<string> {
  const last = await admin.firestore().collection(collection).orderBy("ts", "desc").limit(1).get();
  if (last.empty) {
    return "GENESIS";
  }
  return last.docs[0].data().entryHash;
}

function canonicalize(obj: any): string {
  const sorted = Object.keys(obj)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

async function writeAudit(action: any) {
  const prevHash = await getLatest("adminAudit");
  const entry = {
    ts: new Date(),
    ...action,
    prevHash,
  };
  const canonical = canonicalize(entry);
  entry.entryHash = createHash("sha256").update(canonical).digest("hex");
  await admin.firestore().collection("adminAudit").add(entry);
}




export const adminCreateExport = onCall(async (request: any) => {
  await requireAdmin(request);
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

export const adminRunExportJob = onCall(async (request) => {
  await requireAdmin(request);
  const { exportId } = request.data;

  const exportDoc = await admin.firestore().collection("adminExports").doc(exportId).get();
  if (!exportDoc.exists) {
    throw new HttpsError("not-found", "Export not found");
  }

  const data = exportDoc.data()!;

  let csv = "";
  if (data.type === "users") {
    const users = await admin.auth().listUsers();
    csv = users.users.map(user => `${user.uid},${user.email},${user.disabled}`).join("\n");
  }

  const bucket = getStorage().bucket();
  const filePath = `exports/${exportId}.csv`;
  const file = bucket.file(filePath);
  await file.save(csv);

  const sha256 = createHash("sha256").update(csv).digest("hex");

  await admin.firestore().collection("adminExports").doc(exportId).update({
    status: "done",
    filePath,
    rowCount: csv.split("\n").length,
    sha256,
  });

  return { success: true };
});

export const adminGetExportDownloadUrl = onCall(async (request) => {
  await requireAdmin(request);
  const { exportId } = request.data;

  const exportDoc = await admin.firestore().collection("adminExports").doc(exportId).get();
  if (!exportDoc.exists) {
    throw new HttpsError("not-found", "Export not found");
  }

  const data = exportDoc.data()!;
  if (data.status !== "done") {
    throw new HttpsError("failed-precondition", "Export is not complete");
  }

  const bucket = getStorage().bucket();
  const file = bucket.file(data.filePath);
  const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 15 });

  return { downloadUrl: url };
});

export const adminVerifyAuditLedger = onCall(async (request) => {
  await requireAdmin(request);

  const auditTrail = await admin.firestore().collection("adminAudit").orderBy("ts", "asc").get();
  let prevHash = "GENESIS";
  for (const doc of auditTrail.docs) {
    const entry = doc.data();
    const expectedHash = createHash("sha256").update(canonicalize({ ...entry, entryHash: undefined })).digest("hex");
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
