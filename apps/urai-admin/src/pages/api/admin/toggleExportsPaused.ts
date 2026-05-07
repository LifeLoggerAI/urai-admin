import type { NextApiResponse } from 'next';
import { firestore } from '@/lib/firebase/admin';
import { withAdminAuth } from '@/lib/with-auth-api';

async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { exportsPaused } = req.body;

  if (typeof exportsPaused !== 'boolean') {
    return res.status(400).json({ message: 'Invalid exportsPaused value' });
  }

  try {
    const configRef = firestore.collection('systemConfig').doc('runtime');
    const auditRef = firestore.collection('auditLogs').doc();

    await firestore.runTransaction(async (transaction) => {
      const current = await transaction.get(configRef);
      const before = current.exists ? current.data() : null;

      transaction.set(configRef, {
        ...(before ?? {}),
        exportsPaused,
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      }, { merge: true });

      transaction.set(auditRef, {
        actorUid: req.user.uid,
        actorEmail: req.user.email ?? null,
        actorRole: req.user.role,
        action: 'system.exportsPaused.update',
        target: { type: 'systemConfig', id: 'runtime' },
        metadata: { before: before?.exportsPaused ?? null, after: exportsPaused },
        createdAt: new Date(),
      });
    });

    return res.status(200).json({ success: true, exportsPaused });
  } catch (error) {
    console.error('Failed to update exports paused:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdminAuth(handler, ['owner', 'admin']);
