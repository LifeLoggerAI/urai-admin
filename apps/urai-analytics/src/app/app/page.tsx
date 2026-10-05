import { AppShell, MetricCard } from '@/components/app-shell';
import { demoMetrics, eventTrend } from '@/lib/demo-data';

export default function AppOverviewPage() {
  return (
    <AppShell title="Analytics overview">
      <div className="grid">
        <MetricCard label="Sample total events" value={demoMetrics.totalEvents.toLocaleString()} detail="Static accepted-event fixture" />
        <MetricCard label="Sample active users" value={demoMetrics.activeUsers.toLocaleString()} detail="Static known-user fixture" />
        <MetricCard label="Sample sessions" value={demoMetrics.sessions.toLocaleString()} detail="Static session fixture" />
      </div>
      <section className="section grid two">
        <div className="card table-shell"><h3>Event trend</h3><table className="table"><caption className="sr-only">Static demo event trend</caption><thead><tr><th scope="col">Date</th><th scope="col">Events</th><th scope="col">Users</th></tr></thead><tbody>{eventTrend.map((row) => <tr key={row.date}><td>{row.date}</td><td>{row.events.toLocaleString()}</td><td>{row.users.toLocaleString()}</td></tr>)}</tbody></table></div>
        <div className="card"><h3>Fixture ingestion health</h3><p>Accepted: {demoMetrics.ingestionHealth.accepted.toLocaleString()}</p><p>Rejected: {demoMetrics.ingestionHealth.rejected.toLocaleString()}</p><p>Redacted: {demoMetrics.ingestionHealth.redacted.toLocaleString()}</p></div>
      </section>
    </AppShell>
  );
}
