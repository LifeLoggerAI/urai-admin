import * as admin from "firebase-admin";

admin.initializeApp();

// Import and re-export functions from other files
export * from "./authz";
export * from "./exports";
export * from "./users";
