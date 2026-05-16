import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

type RawEvent = {
  eventId: string;
  eventName: string;
  organizationId: string;
  workspaceId: string;
  environment: 'local' | 'development' | 'preview' | 'staging' | 'production';
  userId?: string;
  anonymousId?: string;
  sessionId?: string;
  route?: string;
  source?: string;
  privacyClass?: string;
  redactedPaths?: string[];
  rejected?: boolean;
};

function previousDateString(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function increment(map: Map<string, number>, key = 'unknown') {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function top(map: Map<string, number>, keyName: string) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([key, count]) => ({ [keyName]: key, count }));
}

export const aggregateUraiAnalyticsV1 = onSchedule(
  { schedule: 'every 24 hours', timeZone: 'UTC', memory: '512MiB', timeoutSeconds: 540 },
  async () => {
    const date = previousDateString();
    const collectionName = `analytics_events_raw_${date}`;
    const snapshot = await db.collection(collectionName).get();

    const groups = new Map<string, RawEvent[]>();
    snapshot.forEach((doc) => {
      const event = doc.data() as RawEvent;
      const key = `${event.organizationId}::${event.workspaceId}::${event.environment ?? 'production'}`;
      const items = groups.get(key) ?? [];
      items.push(event);
      groups.set(key, items);
    });

    const batch = db.batch();
    let aggregateCount = 0;

    for (const [key, events] of groups.entries()) {
      const [organizationId, workspaceId, environment] = key.split('::');
      const users = new Set<string>();
      const anonymousUsers = new Set<string>();
      const sessions = new Set<string>();
      const eventCounts = new Map<string, number>();
      const routeCounts = new Map<string, number>();
      const sourceBreakdown = new Map<string, number>();
      const privacyClassBreakdown = new Map<string, number>();
      let accepted = 0;
      let rejected = 0;
      let redacted = 0;

      for (const event of events) {
        if (event.userId) users.add(event.userId);
        if (event.anonymousId) anonymousUsers.add(event.anonymousId);
        if (event.sessionId) sessions.add(event.sessionId);
        increment(eventCounts, event.eventName);
        if (event.route) increment(routeCounts, event.route);
        increment(sourceBreakdown, event.source ?? 'unknown');
        increment(privacyClassBreakdown, event.privacyClass ?? 'customer');
        if (event.rejected) rejected += 1;
        else accepted += 1;
        if ((event.redactedPaths ?? []).length > 0) redacted += 1;
      }

      const aggregateId = `${organizationId}_${workspaceId}_${environment}_${date}`;
      const aggregate = {
        id: aggregateId,
        date,
        organizationId,
        workspaceId,
        environment,
        totalEvents: events.length,
        activeUsers: users.size,
        anonymousUsers: anonymousUsers.size,
        sessions: sessions.size,
        topEvents: top(eventCounts, 'eventName'),
        topRoutes: top(routeCounts, 'route'),
        sourceBreakdown: Object.fromEntries(sourceBreakdown),
        privacyClassBreakdown: Object.fromEntries(privacyClassBreakdown),
        ingestionHealth: { accepted, rejected, redacted },
        generatedAt: new Date().toISOString()
      };

      batch.set(db.collection('analyticsDailyWorkspaceMetrics').doc(aggregateId), aggregate, { merge: true });
      batch.set(
        db.collection('organizations').doc(organizationId).collection('workspaces').doc(workspaceId).collection('metricsDaily').doc(date),
        aggregate,
        { merge: true }
      );
      aggregateCount += 1;
    }

    batch.set(db.collection('analyticsJobRuns').doc(`urai_analytics_v1_${date}`), {
      job: 'aggregateUraiAnalyticsV1',
      date,
      rawCollection: collectionName,
      rawEvents: snapshot.size,
      aggregates: aggregateCount,
      completedAt: new Date().toISOString()
    });

    await batch.commit();
    logger.info('URAI Analytics V1 aggregation complete', { date, rawEvents: snapshot.size, aggregates: aggregateCount });
  }
);
