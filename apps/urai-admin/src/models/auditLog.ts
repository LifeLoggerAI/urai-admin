
export interface AuditLog {
  id: string;
  ts: number;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  meta?: any;
}
