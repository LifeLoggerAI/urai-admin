"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportService = void 0;
const firebase_1 = require("../firebase");
const auditService_1 = require("./auditService");
class SupportService {
    constructor() {
        this.db = firebase_1.admin.firestore();
    }
    async getCases() {
        const snapshot = await this.db.collection('supportCases').orderBy('updatedAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async createCase(supportCase, actor) {
        const newCase = await this.db.collection('supportCases').add({
            ...supportCase,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [{ at: new Date(), text: supportCase.description, byUid: actor.uid }]
        });
        await auditService_1.auditService.log('SUPPORTCASE_CREATE', { caseId: newCase.id }, actor);
        return newCase.id;
    }
    async addMessage(caseId, message, actor) {
        await this.db.collection('supportCases').doc(caseId).update({
            messages: firebase_1.admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: message, byUid: actor.uid }),
            updatedAt: new Date(),
        });
        await auditService_1.auditService.log('SUPPORTCASE_MESSAGE', { caseId }, actor);
    }
    async closeCase(caseId, actor) {
        await this.db.collection('supportCases').doc(caseId).update({ status: 'closed', updatedAt: new Date() });
        await auditService_1.auditService.log('SUPPORTCASE_CLOSE', { caseId }, actor);
    }
}
exports.supportService = new SupportService();
//# sourceMappingURL=supportService.js.map