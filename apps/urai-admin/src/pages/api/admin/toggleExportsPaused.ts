
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../../lib/firebase-admin';
import { auth } from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;
    const decodedToken = await auth().verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const configRef = firestore.doc('foundationConfig/config');
    const configDoc = await configRef.get();
    const currentExportsPaused = configDoc.data()?.exportsPaused || false;

    await configRef.update({ exportsPaused: !currentExportsPaused });

    await firestore.collection('auditLogs').add({
      uid: decodedToken.uid,
      action: 'toggleExportsPaused',
      ts: new Date(),
      meta: { exportsPaused: !currentExportsPaused },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
