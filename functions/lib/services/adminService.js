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
exports.AdminService = void 0;
const admin = __importStar(require("firebase-admin"));
class AdminService {
    /**
     * Creates a new admin user in Firebase Authentication and adds their roles to Firestore.
     * @param email The email of the user to create.
     * @param roles The roles to assign to the user.
     * @returns The new user record.
     */
    static async createAdmin(email, roles) {
        const userRecord = await admin.auth().createUser({ email });
        await this.updateAdminRoles(userRecord.uid, roles);
        return userRecord;
    }
    /**
     * Updates the custom claims for a user in Firebase Authentication and their roles in Firestore.
     * @param uid The UID of the user to update.
     * @param roles The roles to assign to the user.
     */
    static async updateAdminRoles(uid, roles) {
        await admin.auth().setCustomUserClaims(uid, roles);
        // Also, update the roles in the adminUsers collection for fallback.
        await admin.firestore().collection('adminUsers').doc(uid).set({ roles }, { merge: true });
    }
    /**
     * Gets a list of all admin users from Firestore.
     * @returns A list of all admin users.
     */
    static async getAllAdmins() {
        const snapshot = await admin.firestore().collection('adminUsers').get();
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map