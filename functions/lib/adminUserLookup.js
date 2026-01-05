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
exports.adminUserLookup = void 0;
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const adminAuth_1 = require("./adminAuth");
exports.adminUserLookup = (0, adminAuth_1.requireAdmin)(async (data, auth) => {
    const { uid, email } = data;
    if (!uid && !email) {
        throw new https_1.HttpsError("invalid-argument", 'Either "uid" or "email" must be provided.');
    }
    let user;
    try {
        if (uid) {
            user = await admin.auth().getUser(uid);
        }
        else {
            user = await admin.auth().getUserByEmail(email);
        }
        v2_1.logger.info(`Admin lookup successful for ${uid || email}`, {
            adminUid: auth.uid,
            targetUid: user.uid,
        });
        return { user };
    }
    catch (error) { // Specify the type of error as 'any'
        v2_1.logger.error(`Error looking up user: ${uid || email}`, { error });
        if (error.code === "auth/user-not-found") {
            throw new https_1.HttpsError("not-found", "The requested user was not found.");
        }
        throw new https_1.HttpsError("internal", "An error occurred while looking up the user.");
    }
});
//# sourceMappingURL=adminUserLookup.js.map