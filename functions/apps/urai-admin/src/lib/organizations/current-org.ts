import { DEFAULT_INTERNAL_ORG_ID } from './types';

export function getDefaultOrgId() {
  return process.env.URAI_ADMIN_DEFAULT_ORG_ID || DEFAULT_INTERNAL_ORG_ID;
}

export function withDefaultOrg<T extends Record<string, unknown>>(data: T): T & { orgId: string } {
  return {
    ...data,
    orgId: typeof data.orgId === 'string' && data.orgId.length > 0 ? data.orgId : getDefaultOrgId(),
  };
}

export function getOrgScopedCollectionPath(collectionName: string, orgId = getDefaultOrgId()) {
  return `organizations/${orgId}/${collectionName}`;
}
