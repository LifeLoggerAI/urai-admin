
import crypto from "crypto";
import { db } from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

const CLOCK_SKEW_MS = 30_000; // 30 seconds

// Helper function to safely compare signatures against timing attacks
function safeCompare(a: string, b: string) {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false; // Handle cases where strings are not valid hex
  }
}

// Helper function to generate the signature for a payload string
function signPayload(
  bodyString: string,
  timestamp: string,
  nonce: string,
  secret: string
) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(bodyString);
  hmac.update(timestamp);
  hmac.update(nonce);
  return hmac.digest("hex");
}

export async function verifyNodeRequest(req: NextRequest, rawBody: string) {
  const signature = req.headers.get("x-urai-signature");
  const timestamp = req.headers.get("x-urai-timestamp");
  const nonce = req.headers.get("x-urai-nonce");
  const satelliteId = req.headers.get("x-urai-satellite-id");

  if (!signature || !timestamp || !nonce || !satelliteId) {
    throw new Error("FEDERATION_MISSING_HEADERS");
  }

  const ts = Number(timestamp);
  if (isNaN(ts)) throw new Error("FEDERATION_INVALID_TIMESTAMP");

  if (Math.abs(Date.now() - ts) > CLOCK_SKEW_MS) {
    throw new Error("FEDERATION_TIMESTAMP_OUT_OF_RANGE");
  }

  const satelliteDoc = await db.collection("satellites").doc(satelliteId).get();
  if (!satelliteDoc.exists) {
    throw new Error("FEDERATION_UNKNOWN_SATELLITE");
  }

  const { secret, status } = satelliteDoc.data()!;
  if (status !== "active") {
    throw new Error("FEDERATION_SATELLITE_INACTIVE");
  }

  // Atomically check for nonce and record it to prevent replay attacks
  await db.runTransaction(async (tx) => {
    const nonceRef = db.collection("nonce_store").doc(nonce);
    const nonceDoc = await tx.get(nonceRef);

    if (nonceDoc.exists) {
      throw new Error("FEDERATION_NONCE_REPLAY");
    }

    tx.set(nonceRef, {
      createdAt: Date.now(),
      satelliteId,
    });
  });

  const expectedSignature = signPayload(rawBody, timestamp, nonce, secret);

  if (!safeCompare(expectedSignature, signature)) {
    throw new Error("FEDERATION_INVALID_SIGNATURE");
  }

  return { satelliteId };
}
