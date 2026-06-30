
export interface AccessRequest {
  uid: string;
  email: string | null;
  displayName: string | null;
  requestedAt: number;
  status: 'pending' | 'approved' | 'denied';
  reviewedBy?: string;
  reviewedAt?: number;
}
