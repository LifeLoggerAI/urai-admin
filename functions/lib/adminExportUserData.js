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
exports.adminExportUserData = void 0;
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const adminAuth_1 = require("./adminAuth");
exports.adminExportUserData = (0, adminAuth_1.requireAdmin)(async (data, auth) => {
    const { uid } = data;
    if (!uid) {
        throw new https_1.HttpsError("invalid-argument", 'The "uid" must be provided.');
    }
    try {
        // This is a placeholder for a real data export.
        // In a real application, you would query your databases (Firestore, etc.)
        // and return a comprehensive JSON object of the user's data.
        const user = await admin.auth().getUser(uid);
        v2_1.logger.info(`Successfully exported data for user ${uid}`, {
            adminUid: auth.uid,
            targetUid: uid,
        });
        return { user };
    }
    catch (error) {
        v2_1.logger.error(`Error exporting data for user ${uid}`, { error });
        throw new https_1.HttpsError("internal", "An error occurred while exporting user data.");
    }
});
//# sourceMappingURL=adminExportUserData.js.map