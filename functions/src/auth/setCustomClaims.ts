import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { auditService } from './auditService';

export const setCustomClaims = async (uid: string, roles: any) => {
    await admin.auth().setCustomUserClaims(uid, { roles });
    const db = getFirestore();
    await db.collection('adminUsers').doc(uid).update({ roles, updatedAt: new Date() });
    await auditService.log('ROLE_SET', { uid, roles });
};