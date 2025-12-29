
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();

// Helper function to ensure the user is authenticated
function assertAuth(auth: any) {
  if (!auth) {
    throw new HttpsError("unauthenticated", "This function must be called by an authenticated user.");
  }
}

export const acknowledgePolicy = onCall(async (request) => {
  assertAuth(request.auth);

  const { policyId } = request.data;
  if (!policyId || typeof policyId !== 'string') {
    throw new HttpsError("invalid-argument", "The function must be called with a 'policyId' string argument.");
  }

  // Ensure it's a known policy to prevent arbitrary data writes
  const validPolicies = ["incident-response", "admin-security-policy", "dsr-policy"];
  if (!validPolicies.includes(policyId)) {
    throw new HttpsError("invalid-argument", `Invalid policyId: ${policyId}`);
  }

  const uid = request.auth!.uid;

  try {
    // Record the acknowledgement
    await db.collection("policyAcknowledgements").add({
      userId: uid,
      policyId: policyId,
      acknowledgedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { result: `Policy ${policyId} acknowledged successfully.` };
  } catch (error: any) {
    console.error(`Error acknowledging policy ${policyId} for user ${uid}:`, error);
    throw new HttpsError("internal", "Failed to record policy acknowledgement.", error);
  }
});
