
import { NextResponse, NextRequest } from "next/server";
import { enforceFederation } from "@/lib/federation/enforceFederation";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  try {
    // Enforce all federation security rules before proceeding
    const { satelliteId } = await enforceFederation(req, rawBody);
    const body = JSON.parse(rawBody);

    // Log the registration attempt to the immutable ledger
    await appendHashChainedEvent("federation_events", {
      satelliteId,
      type: "REGISTER",
      data: body.data || {},
    });

    // In a full implementation, this would trigger a multi-sig approval process.
    // For now, we'll automatically set the satellite to 'pending' status.
    await db.collection("satellites").doc(satelliteId).set({
      ...body.data,
      status: "pending", // New nodes must be approved
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
    }, { merge: true });

    return NextResponse.json({ status: "pending_approval" });

  } catch (err: any) {
    if (err.message.startsWith("FEDERATION")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    console.error("Unexpected error in register route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
