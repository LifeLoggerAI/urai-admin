import type { DailyWorkspaceMetrics } from '@urai/analytics-core';

export const demoMetrics: DailyWorkspaceMetrics = {
  id: 'org_demo_wrk_demo_production_2026-05-11',
  date: '2026-05-11',
  organizationId: 'org_demo',
  workspaceId: 'wrk_demo',
  environment: 'production',
  totalEvents: 18420,
  activeUsers: 1248,
  anonymousUsers: 391,
  sessions: 2964,
  topEvents: [
    { eventName: 'page.viewed', count: 8421 },
    { eventName: 'urai.mood_state.updated', count: 3180 },
    { eventName: 'insight.viewed', count: 2204 },
    { eventName: 'report.generated', count: 611 },
    { eventName: 'export.created', count: 194 }
  ],
  topRoutes: [
    { route: '/app', count: 3920 },
    { route: '/app/insights', count: 2811 },
    { route: '/app/reports', count: 1022 },
    { route: '/app/events', count: 814 }
  ],
  sourceBreakdown: { web: 14420, mobile: 2910, server: 1090 },
  privacyClassBreakdown: { customer: 12004, passive_signal: 3200, derived_ai_insight: 2216, internal: 1000 },
  ingestionHealth: { accepted: 18420, rejected: 83, redacted: 612 },
  generatedAt: '2026-05-11T12:00:00.000Z'
};

export const eventTrend = [
  { date: 'May 5', events: 10220, users: 802 },
  { date: 'May 6', events: 11880, users: 910 },
  { date: 'May 7', events: 13240, users: 980 },
  { date: 'May 8', events: 15110, users: 1092 },
  { date: 'May 9', events: 16040, users: 1138 },
  { date: 'May 10', events: 17180, users: 1194 },
  { date: 'May 11', events: 18420, users: 1248 }
];

export const recentEvents = [
  { id: 'evt_001', eventName: 'page.viewed', user: 'usr_184', route: '/app', privacy: 'customer', status: 'accepted' },
  { id: 'evt_002', eventName: 'urai.mood_state.updated', user: 'usr_201', route: '/app/insights', privacy: 'passive_signal', status: 'accepted' },
  { id: 'evt_003', eventName: 'insight.viewed', user: 'usr_077', route: '/app/insights', privacy: 'derived_ai_insight', status: 'accepted' },
  { id: 'evt_004', eventName: 'event.ingested', user: 'server', route: '/api/v1/events', privacy: 'internal', status: 'redacted' }
];

export const reports = [
  { id: 'rpt_exec_weekly', name: 'Executive Weekly Summary', type: 'executive_summary', status: 'complete', owner: 'Internal Admin' },
  { id: 'rpt_usage', name: 'Workspace Usage Export', type: 'workspace_usage', status: 'queued', owner: 'Analytics Team' },
  { id: 'rpt_privacy', name: 'Privacy Export Sample', type: 'privacy_export', status: 'draft', owner: 'Privacy Lead' }
];

export const apiKeys = [
  { id: 'key_live_demo', name: 'Production ingest key', prefix: 'urai_live', scopes: 'events:write', status: 'active' },
  { id: 'key_dev_demo', name: 'Development ingest key', prefix: 'urai_dev', scopes: 'events:write metrics:read', status: 'active' }
];
