import { AppShell, MetricCard } from '@/components/app-shell';
import { demoMetrics } from '@/lib/demo-data';

export default function SessionsPage() {
  const averageEventsPerSession = Math.round(demoMetrics.totalEvents / demoMetrics.sessions);
  return (
    <AppShell title="Sessions">
      <div className="grid">
        <MetricCard label="Sessions" value={demoMetrics.sessions.toLocaleString()} detail="Tracked and inferred sessions" />
        <MetricCard label="Events/session" value={averageEventsPerSession.toString()} detail="Average event density" />
        <MetricCard label="Anonymous users" value={demoMetrics.anonymousUsers.toLocaleString()} detail="Anonymous identities before login" />
      </div>
      <section className="section card">
        <h3>Session model</h3>
        <p>V1 treats explicit session.started/session.ended events as authoritative and uses sessionId on incoming events for continuity. V2 adds inactivity-window inference and retention cohorts.</p>
      </section>
    </AppShell>
  );
}
