"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagsService = void 0;
require("../firebase");
const auditService_1 = require("./auditService");
class FlagsService {
    constructor() {
        this.db = require("firebase-admin").firestore();
    }
    async getFlags() {
        const snapshot = await this.db.collection('featureFlags').get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    async upsertFlag(flag, actor) {
        const existing = await this.db.collection('featureFlags').where('key', '==', flag.key).get();
        if (!existing.empty && existing.docs[0].id !== flag.id) {
            throw new Error('Flag key must be unique');
        }
        await this.db.collection('featureFlags').doc(flag.id).set({ ...flag, updatedAt: new Date() }, { merge: true });
        await auditService_1.auditService.log('FEATUREFLAG_UPSERT', { flagId: flag.id }, actor);
    }
    async toggleFlag(flagId, enabled, actor) {
        await this.db.collection('featureFlags').doc(flagId).update({ enabled, updatedAt: new Date() });
        await auditService_1.auditService.log('FEATUREFLAG_TOGGLE', { flagId, enabled }, actor);
    }
}
exports.flagsService = new FlagsService();
//# sourceMappingURL=flagsService.js.map