
import { NextRequest } from "next/server";
import { verifyNodeRequest } from "@/security/verifyNode"; // Note: Path adjusted for library context
import { appendHashChainedEvent } from "./hashChain";
import { db } from "@/lib/firebaseAdmin"; // Import db to check freeze state

// A Set of routes that are exempt from the system freeze
const FREEZE_EXEMPT_ROUTES = new Set([
  "/api/federation/state",
  "/api/federation/incident",
]);

export async function enforceFederation(req: NextRequest, body: any) {
  // 1. Check the system's operational freeze state first.
  const stateDoc = await db.collection("sovereign").doc("state").get();
  const isFrozen = stateDoc.data()?.frozen || false;

  // Using `nextUrl.pathname` is more reliable than parsing headers for the route
  const route = req.nextUrl.pathname;

  if (isFrozen && !FREEZE_EXEMPT_ROUTES.has(route)) {
    throw new Error("FEDERATION_POLICY_VIOLATION: The system is currently frozen. All non-essential operations are temporarily suspended.");
  }

  // 2. If not frozen (or if the route is exempt), proceed with standard verification.
  try {
    const { satelliteId } = await verifyNodeRequest(req, body);
    return { satelliteId };
  } catch (err: any) {
    // Log the failed authentication/verification attempt
    await appendHashChainedEvent("admin_log", {
      type: "FEDERATION_REJECTED",
      reason: err.message,
      satelliteId: req.headers.get("x-urai-satellite-id") || "unknown",
      route: route,
      timestamp: Date.now(),
    });

    // Re-throw the specific error to be handled by the calling API route
    throw err;
  }
}
