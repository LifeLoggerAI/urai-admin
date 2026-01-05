
import { logger } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
// This is the middleware that checks for an admin user.
export const requireAdmin = (handler: any) => {
  return onCall(async (request) => {
    const { auth, data, rawRequest } = request;

    // 1. Check for Firebase Auth ID token
    if (!auth || !auth.token) {
      logger.warn("Authentication failed: No token provided.", {
        requestId: rawRequest.get("function-execution-id"),
      });
      throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    // 2. Verify admin custom claim
    if (auth.token.admin !== true) {
      logger.warn("Permission denied: User is not an admin.", {
        uid: auth.uid,
        email: auth.token.email,
        requestId: rawRequest.get("function-execution-id"),
      });
      throw new HttpsError("permission-denied", "You must be an admin to perform this action.");
    }
    
    // 3. Ensure POST method
    if (rawRequest.method !== "POST") {
        throw new HttpsError("failed-precondition", "This function must be called with a POST request.");
    }

    logger.info("Admin action authorized.", {
      uid: auth.uid,
      email: auth.token.email,
      requestId: rawRequest.get("function-execution-id"),
    });

    // If all checks pass, proceed to the actual function logic
    return handler(data, auth);
  });
};
