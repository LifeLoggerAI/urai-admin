import { AppShell, MetricCard } from '@/components/app-shell';
import { demoMetrics, eventTrend } from '@/lib/demo-data';

export default function AppOverviewPage() {
  return (
    <AppShell title="Analytics overview">
      <div className="grid">
        <MetricCard label="Total events" value={demoMetrics.totalEvents.toLocaleString()} detail="Accepted events in selected date range" />
        <MetricCard label="Active users" value={demoMetrics.activeUsers.toLocaleString()} detail="Known users with at least one event" />
        <MetricCard label="Sessions" value={demoMetrics.sessions.toLocaleString()} detail="Session-start and inferred sessions" />
      </div>
      <section className="section grid two">
        <div className="card"><h3>Event trend</h3><table className="table"><tbody>{eventTrend.map((row) => <tr key={row.date}><td>{row.date}</td><td>{row.events.toLocaleString()} events</td><td>{row.users.toLocaleString()} users</td></tr>)}</tbody></table></div>
        <div className="card"><h3>Ingestion health</h3><p>Accepted: {demoMetrics.ingestionHealth.accepted.toLocaleString()}</p><p>Rejected: {demoMetrics.ingestionHealth.rejected.toLocaleString()}</p><p>Redacted: {demoMetrics.ingestionHealth.redacted.toLocaleString()}</p></div>
      </section>
    </AppShell>
  );
}
