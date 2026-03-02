'''
import { db } from "@/lib/firebase-admin";

async function tamperLedger() {
  const snapshot = await db
    .collection("federation_events")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log("No federation events found to tamper with.");
    return;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  console.log("Tampering with event:", doc.id);
  // We will change the data but not re-calculate the hash.
  // This simulates a direct, unauthorized modification in the database.
  await doc.ref.update({
    "data.version": "tampered-by-auditor",
  });
  console.log("Tampering complete.");
}

tamperLedger();
'''