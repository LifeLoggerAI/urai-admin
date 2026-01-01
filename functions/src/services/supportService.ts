import { firestore } from 'firebase-admin';
import { db } from '../app';
import { auditService } from './auditService';

export const supportService = {
  async getCases() {
    const snapshot = await db.collection('supportCases').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async createCase(kase: any, actor: any) {
    const newCaseRef = db.collection('supportCases').doc();
    await newCaseRef.set({
      ...kase,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      status: 'open',
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'SUPPORTCASE_CREATE',
      target: { type: 'supportCase', id: newCaseRef.id },
    });
    return newCaseRef.id;
  },

  async addMessage(caseId: string, message: any, actor: any) {
    await db.collection('supportCases').doc(caseId).update({
      messages: firestore.FieldValue.arrayUnion(message),
      updatedAt: firestore.Timestamp.now(),
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'SUPPORTCASE_MESSAGE',
      target: { type: 'supportCase', id: caseId },
    });
  },

  async closeCase(caseId: string, actor: any) {
    await db.collection('supportCases').doc(caseId).update({
      status: 'closed',
      updatedAt: firestore.Timestamp.now(),
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'SUPPORTCASE_CLOSE',
      target: { type: 'supportCase', id: caseId },
    });
  },
};
