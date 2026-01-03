
import * as admin from "firebase-admin";

admin.initializeApp();

// Admin functions
export { adminUserLookup } from "./adminUserLookup";
export { adminSetRole } from "./adminSetRole";
export { adminDeactivateUser } from "./adminDeactivateUser";
export { adminExportUserData } from "./adminExportUserData";
