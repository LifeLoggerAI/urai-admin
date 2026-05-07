
import { NextResponse, NextRequest } from "next/server";
import { enforceFederation } from "@/lib/federation/enforceFederation";
import { appendHashChainedEvent } from "@/lib/federation/hashChain";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  try {
    const { satelliteId } = await enforceFederation(req, rawBody);
    const body = JSON.parse(rawBody);

    // Record the verified incident to the primary, immutable incident ledger
    await appendHashChainedEvent("incident_ledger", {
      satelliteId,
      type: "INCIDENT_REPORT",
      data: body.data || {},
      status: "OPEN", // Incidents are open until explicitly closed by governance
    });

    return NextResponse.json({ status: "recorded" });

  } catch (err: any) {
    if (err.message.startsWith("FEDERATION")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    console.error("Unexpected error in incident route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
