import "../firebase";
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};