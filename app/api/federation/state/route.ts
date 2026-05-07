
import { NextResponse, NextRequest } from "next/server";
import { enforceFederation } from "@/lib/federation/enforceFederation";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";
import { getGovernanceState } from "@/lib/governance"; // Import the new centralized function

export async function GET(req: NextRequest) {
  try {
    // Enforce federation security rules even for read-only endpoints
    const { satelliteId } = await enforceFederation(req, ""); // GET requests have no body

    // Log the state request to the immutable ledger for a complete audit trail
    await appendHashChainedEvent("federation_events", {
      satelliteId,
      type: "STATE_REQUEST",
      data: {},
    });

    // Fetch the definitive governance state using the new centralized function
    const state = await getGovernanceState();

    return NextResponse.json(state);

  } catch (err: any) {
    if (err.message.startsWith("FEDERATION")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    console.error("Unexpected error in state route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
