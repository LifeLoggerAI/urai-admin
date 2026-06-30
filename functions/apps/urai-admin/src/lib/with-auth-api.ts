import type { NextApiRequest, NextApiResponse } from 'next';
import { auth, firestore } from '@/lib/firebase/admin';

type AdminRole = 'owner' | 'admin' | 'viewer';

type AuthedRequest = NextApiRequest & {
  user?: {
    uid: string;
    email?: string;
    role: AdminRole;
  };
};

export const withAuthApi = (
  handler: (req: AuthedRequest, res: NextApiResponse) => Promise<void> | void,
  allowedRoles: AdminRole[] = ['owner', 'admin', 'viewer'],
) => async (req: AuthedRequest, res: NextApiResponse) => {
  const sessionCookie = req.cookies.__session;

  if (!sessionCookie) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const role = decodedToken.role as AdminRole | undefined;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const adminUserDoc = await firestore.collection('adminUsers').doc(decodedToken.uid).get();
    const adminUser = adminUserDoc.data();

    if (!adminUserDoc.exists || adminUser?.isActive !== true || adminUser?.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
    };

    return handler(req, res);
  } catch (error) {
    console.error('Pages API admin auth error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const withAdminAuth = (
  handler: (req: AuthedRequest, res: NextApiResponse) => Promise<void> | void,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
) => withAuthApi(handler, allowedRoles);
