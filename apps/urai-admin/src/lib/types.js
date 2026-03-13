import { z } from 'zod';
export var AdminUserSchema = z.object({
    uid: z.string(),
    email: z.string().email(),
    isActive: z.boolean(),
    role: z.string(),
});
export var RoleSchema = z.object({
    id: z.string(),
    permissions: z.array(z.string()),
});
export var PermissionSchema = z.object({
    id: z.string(),
    description: z.string(),
});
export var AuditLogSchema = z.object({
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
export var ProjectRegistrySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
});
export var JobSchema = z.object({
    id: z.string(),
    type: z.string(),
    status: z.string(),
    createdAt: z.number(),
});
export var JobRunSchema = z.object({
    id: z.string(),
    jobId: z.string(),
    state: z.string(),
    startedAt: z.number(),
    endedAt: z.number(),
});
export var DeadLetterSchema = z.object({
    id: z.string(),
    reason: z.string(),
    lastError: z.string(),
});
export var UserProfileSchema = z.object({
    uid: z.string(),
    displayName: z.string().optional(),
    photoURL: z.string().optional(),
});
export var FeatureFlagSchema = z.object({
    key: z.string(),
    value: z.boolean(),
});
