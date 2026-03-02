
import crypto from "crypto";
import { db } from "@/lib/firebase-admin";

function computeHash(entry: any, previousHash: string) {
  const h = crypto.createHash("sha256");
  h.update(JSON.stringify(entry));
  h.update(previousHash);
  return h.digest("hex");
}

export async function appendHashChainedEvent(
  collection: string,
  entry: Record<string, any>
) {
  const ledgerRef = db.collection(collection);

  const latest = await ledgerRef
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  const previousHash = latest.empty
    ? "GENESIS"
    : latest.docs[0].data().hash;

  const timestamp = Date.now();

  const baseEntry = {
    ...entry,
    timestamp,
  };

  const hash = computeHash(baseEntry, previousHash);

  await ledgerRef.doc(hash).set({
    ...baseEntry,
    previousHash,
    hash,
  });

  return hash;
}

export async function verifyLedgerIntegrity(collection: string) {
  const snapshot = await db
    .collection(collection)
    .orderBy("timestamp", "asc")
    .get();

  let previousHash = "GENESIS";

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { satelliteId, type, ...rest } = data;
    const recomputed = computeHash(
      {
        satelliteId,
        type,
        data: rest.data,
        timestamp: data.timestamp,
      },
      previousHash
    );

    if (recomputed !== data.hash) {
      throw new Error(`LEDGER_TAMPER_DETECTED at doc ${doc.id}`);
    }

    previousHash = data.hash;
  }

  return true;
}
