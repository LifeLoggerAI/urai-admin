import { admin } from "../firebase";
import { auditService } from './auditService';

class SupportService {
    private db = admin.firestore();

    async getCases() {
        const snapshot = await this.db.collection('supportCases').orderBy('updatedAt', 'desc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }

    async createCase(supportCase: any, actor: any) {
        const newCase = await this.db.collection('supportCases').add({
            ...supportCase,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [{ at: new Date(), text: supportCase.description, byUid: actor.uid }]
        });
        await auditService.log('SUPPORTCASE_CREATE', { caseId: newCase.id }, actor);
        return newCase.id;
    }

    async addMessage(caseId: string, message: string, actor: any) {
        await this.db.collection('supportCases').doc(caseId).update({
            messages: admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: message, byUid: actor.uid }),
            updatedAt: new Date(),
        });
        await auditService.log('SUPPORTCASE_MESSAGE', { caseId }, actor);
    }

    async closeCase(caseId: string, actor: any) {
        await this.db.collection('supportCases').doc(caseId).update({ status: 'closed', updatedAt: new Date() });
        await auditService.log('SUPPORTCASE_CLOSE', { caseId }, actor);
    }
}

export const supportService = new SupportService();
