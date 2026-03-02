
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";

// In a real-world scenario, this endpoint would be protected by
// robust, multi-factor administrative authentication.

export async function POST(req: NextRequest) {
  const { frozen, reason } = await req.json();

  if (typeof frozen !== 'boolean' || !reason) {
    return NextResponse.json({ error: "Invalid request: 'frozen' (boolean) and 'reason' (string) are required." }, { status: 400 });
  }

  try {
    // 1. Log the administrative action to the immutable admin ledger FIRST.
    // This ensures there is always a record of the intent, even if the state change fails.
    const logEntry = {
      action: frozen ? "SYSTEM_FREEZE_ENGAGED" : "SYSTEM_FREEZE_LIFTED",
      reason,
      timestamp: Date.now(),
      // In a real system, we would log the authenticated admin's identity.
      // adminId: getAdminIdFromRequest(req),
    };
    await appendHashChainedEvent("admin_log", logEntry);

    // 2. Update the sovereign state of the entire federation.
    await db.collection("sovereign").doc("state").set({ frozen }, { merge: true });

    return NextResponse.json({ status: "ok", systemFrozen: frozen });

  } catch (err: any) {
    console.error("Error during system freeze operation:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
