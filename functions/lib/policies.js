"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgePolicy = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();
// Helper function to ensure the user is authenticated
function assertAuth(auth) {
    if (!auth) {
        throw new https_1.HttpsError("unauthenticated", "This function must be called by an authenticated user.");
    }
}
exports.acknowledgePolicy = (0, https_1.onCall)(async (request) => {
    assertAuth(request.auth);
    const { policyId } = request.data;
    if (!policyId || typeof policyId !== 'string') {
        throw new https_1.HttpsError("invalid-argument", "The function must be called with a 'policyId' string argument.");
    }
    // Ensure it's a known policy to prevent arbitrary data writes
    const validPolicies = ["incident-response", "admin-security-policy", "dsr-policy"];
    if (!validPolicies.includes(policyId)) {
        throw new https_1.HttpsError("invalid-argument", `Invalid policyId: ${policyId}`);
    }
    const uid = request.auth.uid;
    try {
        // Record the acknowledgement
        await db.collection("policyAcknowledgements").add({
            userId: uid,
            policyId: policyId,
            acknowledgedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { result: `Policy ${policyId} acknowledged successfully.` };
    }
    catch (error) {
        console.error(`Error acknowledging policy ${policyId} for user ${uid}:`, error);
        throw new https_1.HttpsError("internal", "Failed to record policy acknowledgement.", error);
    }
});
//# sourceMappingURL=policies.js.map