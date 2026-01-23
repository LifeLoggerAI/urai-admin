export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  roles: {
    admin: boolean;
  };
  featureFlags?: {
    [key: string]: boolean;
  };
}

export interface AuditEvent {
  id: string;
  actor: {
    uid: string;
    email: string | null;
  };
  action: string;
  timestamp: number;
  payload: any;
}

export interface AdminAction {
  id: string;
  actor: {
    uid: string;
    email: string | null;
  };
  action: string;
  timestamp: number;
  payload: any;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
  env: 'staging' | 'production' | 'all';
}

export interface SystemHealth {
  id: string;
  service: string;
  status: 'ok' | 'degraded' | 'outage';
  lastChecked: number;
}

export interface Job {
  id: string;
  type: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  payload: any;
  retries: number;
  failReason: string | null;
}

export interface PolicyDoc {
  id: string;
  title: string;
  content: string;
  version: number;
}
