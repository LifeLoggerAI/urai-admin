import type { NextApiResponse } from 'next';
import { firestore } from '@/lib/firebase/admin';
import { withAdminAuth } from '@/lib/with-auth-api';

async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { maintenanceMode } = req.body;

  if (typeof maintenanceMode !== 'boolean') {
    return res.status(400).json({ message: 'Invalid maintenanceMode value' });
  }

  try {
    const configRef = firestore.collection('systemConfig').doc('runtime');
    const auditRef = firestore.collection('auditLogs').doc();

    await firestore.runTransaction(async (transaction) => {
      const current = await transaction.get(configRef);
      const before = current.exists ? current.data() : null;

      transaction.set(configRef, {
        ...(before ?? {}),
        maintenanceMode,
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      }, { merge: true });

      transaction.set(auditRef, {
        actorUid: req.user.uid,
        actorEmail: req.user.email ?? null,
        actorRole: req.user.role,
        action: 'system.maintenance.update',
        target: { type: 'systemConfig', id: 'runtime' },
        metadata: { before: before?.maintenanceMode ?? null, after: maintenanceMode },
        createdAt: new Date(),
      });
    });

    return res.status(200).json({ success: true, maintenanceMode });
  } catch (error) {
    console.error('Failed to update maintenance mode:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdminAuth(handler, ['owner', 'admin']);
