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
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const auditService_1 = require("../services/auditService");
const admin = __importStar(require("firebase-admin"));
const router = (0, express_1.Router)();
router.post('/roles/set', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)('superAdmin'), async (req, res) => {
    const { uid, roles } = req.body;
    try {
        await admin.auth().setCustomUserClaims(uid, { roles });
        await admin.firestore().collection('adminUsers').doc(uid).set({ roles }, { merge: true });
        await (0, auditService_1.logAuditEvent)(req.user.uid, req.user.email, 'ROLE_SET', { type: 'user', id: uid });
        res.status(200).send({ success: true });
    }
    catch (error) {
        console.error('Error setting roles', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map