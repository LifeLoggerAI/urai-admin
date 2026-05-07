
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";

const INACTIVITY_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const now = Date.now();
    const inactiveThreshold = now - INACTIVITY_THRESHOLD_MS;

    // Find all satellites that are currently considered active
    const activeSatellites = await db.collection("satellites")
      .where("status", "==", "active")
      .get();

    if (activeSatellites.empty) {
      return NextResponse.json({ status: "ok", message: "No active satellites to check." });
    }

    let anomaliesDetected = 0;
    const batch = db.batch();

    for (const doc of activeSatellites.docs) {
      const satellite = doc.data();
      const lastSeen = satellite.lastSeenAt || 0;

      // Check if the satellite has missed its check-in window
      if (lastSeen < inactiveThreshold) {
        anomaliesDetected++;

        // 1. Mark the satellite as inactive in the database
        batch.update(doc.ref, { status: "inactive" });

        // 2. Log a high-severity incident to the immutable ledger
        await appendHashChainedEvent("incident_ledger", {
          satelliteId: doc.id,
          type: "ANOMALY_SATELLITE_OFFLINE",
          data: {
            lastSeenAt: lastSeen,
            detectedAt: now,
          },
          status: "OPEN", // This incident requires investigation
        });
      }
    }

    // Commit all database updates in a single atomic batch
    if (anomaliesDetected > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      status: "ok",
      checked: activeSatellites.size,
      anomalies: anomaliesDetected,
    });

  } catch (err: any) {
    console.error("Error in anomaly detection cron job:", err);
    // Log the failure of the cron job itself to the admin log
    await appendHashChainedEvent("admin_log", {
      type: "CRON_JOB_FAILURE",
      reason: "ANOMALY_DETECTION_FAILED",
      error: err.message,
      timestamp: Date.now(),
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
