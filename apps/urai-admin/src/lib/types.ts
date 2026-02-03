
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}
