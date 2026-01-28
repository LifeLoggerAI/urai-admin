
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'staff' | 'viewer';
  createdAt: number;
  lastLoginAt: number;
}
