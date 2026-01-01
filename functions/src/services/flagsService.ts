import { db } from '../app';
import { auditService } from './auditService';

export const flagsService = {
  async getFlags() {
    const snapshot = await db.collection('featureFlags').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async upsertFlag(flag: any, actor: any) {
    await db.collection('featureFlags').doc(flag.id).set(flag, { merge: true });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'FEATUREFLAG_UPDATE',
      target: { type: 'flag', id: flag.id },
    });
  },

  async toggleFlag(id: string, enabled: boolean, actor: any) {
    await db.collection('featureFlags').doc(id).update({ enabled });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'FEATUREFLAG_TOGGLE',
      target: { type: 'flag', id },
    });
  },
};
