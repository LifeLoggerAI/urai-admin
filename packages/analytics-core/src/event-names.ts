export const URAI_ANALYTICS_EVENT_NAMES = [
  'app.opened',
  'page.viewed',
  'session.started',
  'session.ended',
  'signup.started',
  'signup.completed',
  'workspace.created',
  'api_key.created',
  'event.ingested',
  'report.generated',
  'export.created',
  'insight.viewed',
  'alert.triggered',
  'billing.checkout_started',
  'billing.subscription_updated',
  'urai.passive_signal.received',
  'urai.mood_state.updated',
  'urai.cognitive_load.updated',
  'urai.relationship_signal.updated',
  'urai.narrator_insight.generated',
  'urai.ritual.completed',
  'urai.memory_map.viewed',
  'urai.spatial_session.started'
] as const;

export type UraiAnalyticsEventName = (typeof URAI_ANALYTICS_EVENT_NAMES)[number] | (string & {});

export function isReservedUraiEventName(eventName: string): eventName is (typeof URAI_ANALYTICS_EVENT_NAMES)[number] {
  return (URAI_ANALYTICS_EVENT_NAMES as readonly string[]).includes(eventName);
}

export function normalizeEventName(eventName: string): string {
  return eventName.trim().toLowerCase().replace(/[^a-z0-9_.:-]+/g, '_').replace(/_+/g, '_').slice(0, 120);
}
