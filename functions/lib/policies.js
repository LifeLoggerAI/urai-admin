"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgePolicy = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
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