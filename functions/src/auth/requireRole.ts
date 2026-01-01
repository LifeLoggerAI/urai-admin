import { Request, Response, NextFunction } from 'express';

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = (req as any).user?.roles || {};
    const hasRole = roles.some(role => userRoles[role]);

    if (!hasRole) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};
