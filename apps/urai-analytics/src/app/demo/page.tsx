import Link from 'next/link';
import { PageFrame } from '@/components/marketing';
import { demoMetrics, recentEvents } from '@/lib/demo-data';

export default function DemoPage() {
  return (
    <PageFrame>
      <main id="main-content" className="page section">
        <p className="eyebrow">Demo · static fixtures</p><h1>Explore a sample URAI Analytics workspace.</h1>
        <p>All values on this page are static interface fixtures, not production telemetry or live user activity.</p>
        <div className="grid section">
          <div className="card"><p>Sample events</p><div className="metric">{demoMetrics.totalEvents.toLocaleString()}</div></div>
          <div className="card"><p>Sample active users</p><div className="metric">{demoMetrics.activeUsers.toLocaleString()}</div></div>
          <div className="card"><p>Sample sessions</p><div className="metric">{demoMetrics.sessions.toLocaleString()}</div></div>
        </div>
        <div className="card table-shell"><h2 className="table-heading">Recent fixture events</h2><table className="table"><caption className="sr-only">Recent static demo events</caption><thead><tr><th scope="col">Event</th><th scope="col">User</th><th scope="col">Privacy class</th><th scope="col">Status</th></tr></thead><tbody>{recentEvents.map((event) => <tr key={event.id}><td>{event.eventName}</td><td>{event.user}</td><td>{event.privacy}</td><td>{event.status}</td></tr>)}</tbody></table></div>
        <p><Link className="btn primary" href="/app">Open demo workspace</Link></p>
      </main>
    </PageFrame>
  );
}
