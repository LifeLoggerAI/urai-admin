import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from './firebaseAdmin';

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    await adminAuth.verifyIdToken(token);
    return handler(req, res);
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Not authenticated.' });
  }
};
