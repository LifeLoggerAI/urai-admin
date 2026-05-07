
import { NextResponse, NextRequest } from "next/server";
import { enforceFederation } from "@/lib/federation/enforceFederation";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // Read the raw body once for signature verification

  try {
    // 1. Enforce all federation security rules: HMAC, nonce, timestamp, status
    const { satelliteId } = await enforceFederation(req, rawBody);
    const body = JSON.parse(rawBody);

    // 2. Record the event to the immutable, hash-chained ledger
    await appendHashChainedEvent("federation_events", {
      satelliteId,
      type: "HEARTBEAT",
      data: body.data || {},
    });

    // 3. Update the satellite's liveness status for monitoring
    await db.collection("satellites").doc(satelliteId).update({
      lastSeenAt: Date.now(),
      status: "active", // Mark as active on successful heartbeat
    });

    return NextResponse.json({ status: "ok" });

  } catch (err: any) {
    // The enforcement function already logs the rejection details.
    // This block just ensures the client receives the correct error status.
    if (err.message.startsWith("FEDERATION")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    // For unexpected errors
    console.error("Unexpected error in heartbeat route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
