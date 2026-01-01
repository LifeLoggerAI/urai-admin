import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '../app';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};
