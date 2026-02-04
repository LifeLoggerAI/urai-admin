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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminClaim = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize the Firebase Admin SDK.
admin.initializeApp();
/**
 * Sets the `admin` custom claim on a user's account.
 *
 * This function is triggered by an HTTP request and requires the user to be authenticated.
 * The user's UID is passed in the request body, and the function sets the `admin` custom claim to `true`.
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
    // Check if the user is authenticated.
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    // Check if the user is an admin.
    if (context.auth.token.admin !== true) {
        throw new functions.https.HttpsError("permission-denied", "The function must be called by an admin.");
    }
    // Get the user's UID from the request body.
    const { uid, admin } = data;
    // Set the `admin` custom claim on the user's account.
    await admin.auth().setCustomUserClaims(uid, { admin });
    // Log the action.
    console.log(`Set admin claim to ${admin} for user ${uid}`);
    // Return a success message.
    return { message: `Successfully set admin claim to ${admin} for user ${uid}` };
});
