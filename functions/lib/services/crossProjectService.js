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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossProjectService = void 0;
require("../firebase");
const auditService_1 = require("./auditService");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
class CrossProjectService {
    constructor() {
        this.db = require("firebase-admin").firestore();
    }
    async forwardDSAR(uid, type, reason, actor) {
        const config = (await this.db.collection('config').doc('global').get()).data();
        const privacyUrl = config?.links?.privacyUrl;
        const tokenRef = config?.dsarTokenRef;
        if (privacyUrl && tokenRef) {
            const tokenDoc = await this.db.collection('crossProjectTokens').doc(tokenRef).get();
            const tokenData = tokenDoc.data();
            if (tokenData && tokenData.status === 'active') {
                // This is a placeholder for how you might use the token.
                // In a real scenario, you would use a secure method to fetch the actual token.
                const serviceToken = process.env.DSAR_SERVICE_TOKEN;
                if (serviceToken) {
                    try {
                        const correlationId = crypto.randomBytes(16).toString('hex');
                        await axios_1.default.post(`${privacyUrl}/dsar`, {
                            uid,
                            type,
                            reason,
                            correlationId
                        }, {
                            headers: { Authorization: `Bearer ${serviceToken}` }
                        });
                        await auditService_1.auditService.log('DSAR_FORWARD', { uid, type, correlationId }, actor);
                        return { status: 'forwarded', correlationId };
                    }
                    catch (error) {
                        await auditService_1.auditService.log('DSAR_FORWARD_FAILED', { uid, type, error: error.message }, actor);
                        await this.createFallbackCase(uid, type, reason, actor, `Forwarding failed: ${error.message}`);
                        return { status: 'fallback', reason: `Forwarding failed: ${error.message}` };
                    }
                }
                else {
                    await this.createFallbackCase(uid, type, reason, actor, 'DSAR service token not configured');
                    return { status: 'fallback', reason: 'DSAR service token not configured' };
                }
            }
            else {
                await this.createFallbackCase(uid, type, reason, actor, 'DSAR service token reference is invalid or revoked');
                return { status: 'fallback', reason: 'DSAR service token reference is invalid or revoked' };
            }
        }
        else {
            await this.createFallbackCase(uid, type, reason, actor, 'DSAR endpoint or token reference not configured');
            return { status: 'fallback', reason: 'DSAR endpoint or token reference not configured' };
        }
    }
    async createFallbackCase(uid, type, reason, actor, fallbackReason) {
        const caseDetails = {
            userUid: uid,
            category: 'privacy',
            subject: `DSAR Fallback: ${type} request for ${uid}`,
            description: `A DSAR request of type '${type}' for user ${uid} could not be automatically forwarded. Reason: ${fallbackReason}. Manual processing required. Original reason: ${reason || 'N/A'}`,
        };
        const caseId = await this.db.collection('supportCases').add(caseDetails);
        await auditService_1.auditService.log('DSAR_FALLBACK', { uid, type, fallbackReason, caseId: caseId.id }, actor);
    }
}
exports.crossProjectService = new CrossProjectService();
//# sourceMappingURL=crossProjectService.js.map