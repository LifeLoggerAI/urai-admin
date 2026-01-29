
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../lib/firebase-admin';

const ROOT_ADMIN_UIDS = (process.env.ROOT_ADMIN_UIDS || '').split(',');

export default async function setAdminClaim(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, admin } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(authorization);
    const isRootAdmin = ROOT_ADMIN_UIDS.includes(decodedToken.uid);

    if (!isRootAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await auth.setCustomUserClaims(uid, { admin });
    return res.status(200).json({ message: `Admin claim set to ${admin} for user ${uid}` });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
