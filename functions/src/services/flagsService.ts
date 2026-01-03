import "../firebase";
import { auditService } from './auditService';

class FlagsService {
    private db = require("firebase-admin").firestore();

    async getFlags() {
        const snapshot = await this.db.collection('featureFlags').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }

    async upsertFlag(flag: any, actor: any) {
        const existing = await this.db.collection('featureFlags').where('key', '==', flag.key).get();
        if (!existing.empty && existing.docs[0].id !== flag.id) {
            throw new Error('Flag key must be unique');
        }
        await this.db.collection('featureFlags').doc(flag.id).set({ ...flag, updatedAt: new Date() }, { merge: true });
        await auditService.log('FEATUREFLAG_UPSERT', { flagId: flag.id }, actor);
    }

    async toggleFlag(flagId: string, enabled: boolean, actor: any) {
        await this.db.collection('featureFlags').doc(flagId).update({ enabled, updatedAt: new Date() });
        await auditService.log('FEATUREFLAG_TOGGLE', { flagId, enabled }, actor);
    }
}

export const flagsService = new FlagsService();
