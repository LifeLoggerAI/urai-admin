import { z } from 'zod';
import { normalizeEventName } from './event-names';
import { PrivacyClassSchema, RetentionClassSchema, defaultRetentionForPrivacyClass } from './privacy';

export const IdSchema = z.string().trim().min(3).max(160).regex(/^[A-Za-z0-9_:\-.]+$/);
export const IsoDateTimeSchema = z.string().datetime({ offset: true });
export const JsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonPrimitive = z.infer<typeof JsonPrimitiveSchema>;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([JsonPrimitiveSchema, z.array(JsonValueSchema), z.record(JsonValueSchema)])
);

export const AnalyticsEnvironmentSchema = z.enum(['local', 'development', 'preview', 'staging', 'production']);
export type AnalyticsEnvironment = z.infer<typeof AnalyticsEnvironmentSchema>;

export const ConsentCategorySchema = z.enum(['necessary', 'product_analytics', 'personalization', 'ai_insights', 'marketing']);
export type ConsentCategory = z.infer<typeof ConsentCategorySchema>;

export const ConsentSnapshotSchema = z.object({
  granted: z.boolean(),
  categories: z.array(ConsentCategorySchema).min(1),
  policyVersion: z.string().min(1).max(64).default('v1'),
  capturedAt: IsoDateTimeSchema.optional()
});
export type ConsentSnapshot = z.infer<typeof ConsentSnapshotSchema>;

export const TenantScopeSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema,
  environment: AnalyticsEnvironmentSchema.default('production')
});
export type TenantScope = z.infer<typeof TenantScopeSchema>;

export const DeviceContextSchema = z.object({
  type: z.enum(['desktop', 'mobile', 'tablet', 'server', 'unknown']).default('unknown'),
  os: z.string().max(80).optional(),
  browser: z.string().max(80).optional(),
  userAgent: z.string().max(600).optional(),
  locale: z.string().max(32).optional(),
  timezone: z.string().max(80).optional()
}).default({ type: 'unknown' });
export type DeviceContext = z.infer<typeof DeviceContextSchema>;

export const UTMContextSchema = z.object({
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(160).optional(),
  term: z.string().max(160).optional(),
  content: z.string().max(160).optional()
}).partial().optional();

export const AnalyticsEventInputSchema = z.object({
  eventId: IdSchema,
  eventName: z.string().min(2).max(120).transform(normalizeEventName),
  schemaVersion: z.literal('v1').default('v1'),
  organizationId: IdSchema,
  workspaceId: IdSchema,
  environment: AnalyticsEnvironmentSchema.default('production'),
  source: z.enum(['web', 'mobile', 'server', 'firebase', 'admin', 'api', 'demo']).default('web'),
  timestamp: IsoDateTimeSchema,
  anonymousId: IdSchema.optional(),
  userId: IdSchema.optional(),
  sessionId: IdSchema.optional(),
  route: z.string().max(300).optional(),
  referrer: z.string().max(600).optional(),
  utm: UTMContextSchema,
  device: DeviceContextSchema,
  properties: z.record(JsonValueSchema).default({}),
  consent: ConsentSnapshotSchema,
  privacyClass: PrivacyClassSchema.default('customer'),
  retentionClass: RetentionClassSchema.optional(),
  apiKeyId: IdSchema.optional()
}).transform((event) => ({
  ...event,
  retentionClass: event.retentionClass ?? defaultRetentionForPrivacyClass(event.privacyClass)
}));
export type AnalyticsEventInput = z.input<typeof AnalyticsEventInputSchema>;
export type AnalyticsEvent = z.output<typeof AnalyticsEventInputSchema>;

export const StoredAnalyticsEventSchema = AnalyticsEventInputSchema.and(z.object({
  ingestedAt: IsoDateTimeSchema,
  receivedAt: IsoDateTimeSchema,
  ipHash: z.string().max(128).optional(),
  requestId: IdSchema.optional(),
  rejected: z.boolean().default(false)
}));
export type StoredAnalyticsEvent = z.output<typeof StoredAnalyticsEventSchema>;

export const ApiKeySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  workspaceId: IdSchema,
  name: z.string().min(1).max(120),
  prefix: z.string().min(6).max(32),
  secretHash: z.string().min(32).max(256),
  status: z.enum(['active', 'revoked', 'expired']).default('active'),
  scopes: z.array(z.enum(['events:write', 'metrics:read', 'reports:read', 'admin'])).default(['events:write']),
  environment: AnalyticsEnvironmentSchema.default('production'),
  createdAt: IsoDateTimeSchema,
  expiresAt: IsoDateTimeSchema.optional(),
  lastUsedAt: IsoDateTimeSchema.optional()
});
export type ApiKey = z.infer<typeof ApiKeySchema>;

export const OrganizationSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(160),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  plan: z.enum(['free', 'pro', 'founder', 'team', 'business', 'enterprise', 'internal', 'developer', 'white_label']).default('free'),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const WorkspaceSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  name: z.string().min(1).max(160),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  environment: AnalyticsEnvironmentSchema.default('production'),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const MembershipSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  organizationId: IdSchema,
  workspaceIds: z.array(IdSchema).default([]),
  role: z.enum(['owner', 'admin', 'analyst', 'developer', 'viewer', 'billing']),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema
});
export type Membership = z.infer<typeof MembershipSchema>;
