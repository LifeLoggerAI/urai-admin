import 'server-only';

import { cache } from 'react';
import { User } from 'firebase/auth';

export const ROLES = { SUPERADMIN: 'superadmin' };

export const isSuperadmin = cache(async (user: User) => {
  const superadmins = (process.env.URAI_SUPERADMINS || '').split(',');
  return superadmins.includes(user.email || '');
});
