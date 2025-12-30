import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Import and re-export functions from other files
export * from "./authz";
export * from "./exports";
export * from "./users";
