export type OrganizationPlan = 'internal' | 'starter' | 'pro' | 'enterprise';

export type OrganizationStatus = 'active' | 'suspended' | 'archived';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
  ownerUid: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationMemberRole = 'owner' | 'admin' | 'viewer';

export type OrganizationMember = {
  uid: string;
  email: string;
  role: OrganizationMemberRole;
  isActive: boolean;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationInvite = {
  id: string;
  orgId: string;
  email: string;
  role: OrganizationMemberRole;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  createdAt: Date;
  expiresAt: Date;
};

export const DEFAULT_INTERNAL_ORG_ID = 'urai-internal';
