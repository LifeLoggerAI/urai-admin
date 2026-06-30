import { z } from 'zod';

// 1. Core Event Schema v1
export const AnalyticsEventSchemaV1 = z.object({
  eventId: z.string().uuid().describe("Unique identifier for the event (UUID)."),
  eventName: z.string().min(1).max(100).describe("The name of the event, e.g., 'page_view' or 'item_added_to_cart'."),
  userId: z.string().nullable().describe("The ID of the user performing the action. Null for anonymous users."),
  sessionId: z.string().uuid().describe("The session ID for this user interaction."),
  timestamp: z.string().datetime().describe("ISO 8601 UTC timestamp of when the event occurred."),
  app: z.object({
    name: z.string().describe("Name of the application, e.g., 'urai-admin'."),
    version: z.string().describe("Version of the application, e.g., '1.2.3'."),
  }),
  route: z.string().describe("The application route where the event occurred, e.g., '/dashboard'."),
  properties: z.record(z.any()).optional().describe("A JSON-serializable object for custom event properties."),
  consent: z.object({
    granted: z.boolean().describe("Whether the user has granted consent for this category of data processing."),
    category: z.string().describe("The consent category, e.g., 'analytics', 'performance'."),
  }).describe("Snapshot of user consent status at the time of the event."),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchemaV1>;
