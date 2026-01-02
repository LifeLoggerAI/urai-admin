import { Request, Response, NextFunction } from 'express';
import { getFirestore } from "firebase-admin/firestore";

type Role = 'superAdmin' | 'council' | 'support' | 'auditor' | 'moderator' | 'ops';

export const requireRole = (roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            res.status(401).send('Unauthorized');
            return;
        }

        const userRoles = user.roles || (await getFirestore().collection('adminUsers').doc(user.uid).get()).data()?.roles;

        if (!userRoles || !roles.some(role => userRoles[role])) {
            res.status(403).send('Forbidden');
            return;
        }

        next();
    };
};