import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getCurrentUser } from './auth';

export const logAdminAction = async (action: string, details: string) => {
  const user = await getCurrentUser();
  if (user) {
    await addDoc(collection(db, 'auditLogs'), {
      adminId: user.uid,
      action,
      details,
      timestamp: serverTimestamp(),
    });
  }
};
