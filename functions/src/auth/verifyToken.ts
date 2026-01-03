import { Request, Response, NextFunction } from 'express';
import { admin } from "../firebase";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken;
        return next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Unauthorized');
    }
};