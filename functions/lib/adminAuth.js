"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
// This is the middleware that checks for an admin user.
const requireAdmin = (handler) => {
    return (0, https_1.onCall)(async (request) => {
        const { auth, data, rawRequest } = request;
        // 1. Check for Firebase Auth ID token
        if (!auth || !auth.token) {
            v2_1.logger.warn("Authentication failed: No token provided.", {
                requestId: rawRequest.get("function-execution-id"),
            });
            throw new https_1.HttpsError("unauthenticated", "The function must be called while authenticated.");
        }
        // 2. Verify admin custom claim
        if (auth.token.admin !== true) {
            v2_1.logger.warn("Permission denied: User is not an admin.", {
                uid: auth.uid,
                email: auth.token.email,
                requestId: rawRequest.get("function-execution-id"),
            });
            throw new https_1.HttpsError("permission-denied", "You must be an admin to perform this action.");
        }
        // 3. Ensure POST method
        if (rawRequest.method !== "POST") {
            throw new https_1.HttpsError("failed-precondition", "This function must be called with a POST request.");
        }
        v2_1.logger.info("Admin action authorized.", {
            uid: auth.uid,
            email: auth.token.email,
            requestId: rawRequest.get("function-execution-id"),
        });
        // If all checks pass, proceed to the actual function logic
        return handler(data, auth);
    });
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=adminAuth.js.map