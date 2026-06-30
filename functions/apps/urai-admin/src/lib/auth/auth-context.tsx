'use client';

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
