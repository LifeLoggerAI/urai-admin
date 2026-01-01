import { firestore } from 'firebase-admin';
import { db } from '../app';

export const healthService = {
  async checkHealth() {
    try {
      // Check Firestore connectivity
      await db.collection('systemHealth').limit(1).get();

      // TODO: Ping other services (urai-privacy, urai-analytics)

      await db.collection('systemHealth').doc('firestore').set({
        subsystem: 'firestore',
        status: 'ok',
        lastCheckAt: firestore.Timestamp.now(),
      });
    } catch (error) {
      await db.collection('systemHealth').doc('firestore').set({
        subsystem: 'firestore',
        status: 'down',
        lastCheckAt: firestore.Timestamp.now(),
        lastError: { code: 'firestore-unreachable', message: (error as Error).message },
      });
    }
  },

  async getHealthStatus() {
    const snapshot = await db.collection('systemHealth').get();
    return snapshot.docs.map(doc => doc.data());
  },
};
