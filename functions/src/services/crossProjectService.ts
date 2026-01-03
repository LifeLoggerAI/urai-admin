import "../firebase";
import { auditService } from './auditService';
import axios from 'axios';
import * as crypto from 'crypto';

class CrossProjectService {
    private db = require("firebase-admin").firestore();

    async forwardDSAR(uid: string, type: 'export' | 'delete', reason: string | undefined, actor: any) {
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
                        await axios.post(`${privacyUrl}/dsar`, {
                            uid,
                            type,
                            reason,
                            correlationId
                        }, {
                            headers: { Authorization: `Bearer ${serviceToken}` }
                        });
                        await auditService.log('DSAR_FORWARD', { uid, type, correlationId }, actor);
                        return { status: 'forwarded', correlationId };
                    } catch (error: any) {
                        await auditService.log('DSAR_FORWARD_FAILED', { uid, type, error: error.message }, actor);
                        await this.createFallbackCase(uid, type, reason, actor, `Forwarding failed: ${error.message}`);
                        return { status: 'fallback', reason: `Forwarding failed: ${error.message}` };
                    }
                } else {
                    await this.createFallbackCase(uid, type, reason, actor, 'DSAR service token not configured');
                    return { status: 'fallback', reason: 'DSAR service token not configured' };
                }
            } else {
                await this.createFallbackCase(uid, type, reason, actor, 'DSAR service token reference is invalid or revoked');
                return { status: 'fallback', reason: 'DSAR service token reference is invalid or revoked' };
            }
        } else {
            await this.createFallbackCase(uid, type, reason, actor, 'DSAR endpoint or token reference not configured');
            return { status: 'fallback', reason: 'DSAR endpoint or token reference not configured' };
        }
    }

    private async createFallbackCase(uid: string, type: 'export' | 'delete', reason: string | undefined, actor: any, fallbackReason: string) {
        const caseDetails = {
            userUid: uid,
            category: 'privacy',
            subject: `DSAR Fallback: ${type} request for ${uid}`,
            description: `A DSAR request of type '${type}' for user ${uid} could not be automatically forwarded. Reason: ${fallbackReason}. Manual processing required. Original reason: ${reason || 'N/A'}`,
        };
        const caseId = await this.db.collection('supportCases').add(caseDetails);
        await auditService.log('DSAR_FALLBACK', { uid, type, fallbackReason, caseId: caseId.id }, actor);
    }
}

export const crossProjectService = new CrossProjectService();
