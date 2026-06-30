import { z } from 'zod';

export const AdminUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  role: z.string(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  permissions: z.array(z.string()),
});

export type Role = z.infer<typeof RoleSchema>;

export const PermissionSchema = z.object({
  id: z.string(),
  description: z.string(),
});

export type Permission = z.infer<typeof PermissionSchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  actorUid: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  ts: z.number(),
  diff: z.record(z.any()).optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

export const ProjectRegistrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type ProjectRegistry = z.infer<typeof ProjectRegistrySchema>;

export const JobSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.string(),
  createdAt: z.number(),
});

export type Job = z.infer<typeof JobSchema>;

export const JobRunSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  state: z.string(),
  startedAt: z.number(),
  endedAt: z.number(),
});

export type JobRun = z.infer<typeof JobRunSchema>;

export const DeadLetterSchema = z.object({
  id: z.string(),
  reason: z.string(),
  lastError: z.string(),
});

export type DeadLetter = z.infer<typeof DeadLetterSchema>;

export const UserProfileSchema = z.object({
  uid: z.string(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const FeatureFlagSchema = z.object({
  key: z.string(),
  value: z.boolean(),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
