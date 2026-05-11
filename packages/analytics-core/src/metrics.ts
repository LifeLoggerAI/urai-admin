import { z } from 'zod';
import { IdSchema, IsoDateTimeSchema, AnalyticsEnvironmentSchema } from './schemas';

export const DailyWorkspaceMetricsSchema = z.object({
  id: IdSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  organizationId: IdSchema,
  workspaceId: IdSchema,
  environment: AnalyticsEnvironmentSchema,
  totalEvents: z.number().int().nonnegative(),
  activeUsers: z.number().int().nonnegative(),
  anonymousUsers: z.number().int().nonnegative(),
  sessions: z.number().int().nonnegative(),
  topEvents: z.array(z.object({ eventName: z.string(), count: z.number().int().nonnegative() })).default([]),
  topRoutes: z.array(z.object({ route: z.string(), count: z.number().int().nonnegative() })).default([]),
  sourceBreakdown: z.record(z.number().int().nonnegative()).default({}),
  privacyClassBreakdown: z.record(z.number().int().nonnegative()).default({}),
  ingestionHealth: z.object({
    accepted: z.number().int().nonnegative(),
    rejected: z.number().int().nonnegative(),
    redacted: z.number().int().nonnegative()
  }),
  generatedAt: IsoDateTimeSchema
});
export type DailyWorkspaceMetrics = z.infer<typeof DailyWorkspaceMetricsSchema>;

export const ReportSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  workspaceId: IdSchema,
  name: z.string().min(1).max(160),
  kind: z.enum(['executive_summary', 'workspace_usage', 'event_export', 'privacy_export', 'investor_snapshot']),
  status: z.enum(['draft', 'queued', 'running', 'complete', 'failed']),
  createdBy: IdSchema.optional(),
  createdAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema.optional(),
  downloadUrl: z.string().url().optional()
});
export type Report = z.infer<typeof ReportSchema>;

export const FeatureEntitlementSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  plan: z.enum(['free', 'pro', 'founder', 'team', 'business', 'enterprise', 'internal', 'developer', 'white_label']),
  monthlyEventLimit: z.number().int().nonnegative(),
  retentionDays: z.number().int().positive(),
  aiInsightsPerMonth: z.number().int().nonnegative(),
  reportsPerMonth: z.number().int().nonnegative(),
  apiKeysAllowed: z.number().int().nonnegative(),
  seatsAllowed: z.number().int().positive(),
  updatedAt: IsoDateTimeSchema
});
export type FeatureEntitlement = z.infer<typeof FeatureEntitlementSchema>;
