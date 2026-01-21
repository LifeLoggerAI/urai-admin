
import { auth } from '@/lib/firebaseClient';
import { User } from 'firebase/auth';

export type Role = 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';

export interface UserWithClaims extends User {
  claims: {
    role?: Role;
    [key: string]: any;
  };
}

export const getUserClaims = async (user: User): Promise<UserWithClaims> => {
  await user.getIdToken(true); // Force refresh of the token
  const decodedToken = await user.getIdTokenResult();
  return {
    ...user,
    claims: decodedToken.claims as { role?: Role },
  };
};
