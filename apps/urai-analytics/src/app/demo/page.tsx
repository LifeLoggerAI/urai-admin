import Link from 'next/link';
import { PageFrame } from '@/components/marketing';
import { demoMetrics, recentEvents } from '@/lib/demo-data';

export default function DemoPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Demo</p><h1>Explore a live-style URAI Analytics workspace.</h1>
        <div className="grid section">
          <div className="card"><p>Total events</p><div className="metric">{demoMetrics.totalEvents.toLocaleString()}</div></div>
          <div className="card"><p>Active users</p><div className="metric">{demoMetrics.activeUsers.toLocaleString()}</div></div>
          <div className="card"><p>Sessions</p><div className="metric">{demoMetrics.sessions.toLocaleString()}</div></div>
        </div>
        <div className="card"><h3>Recent events</h3><table className="table"><tbody>{recentEvents.map((event) => <tr key={event.id}><td>{event.eventName}</td><td>{event.user}</td><td>{event.privacy}</td><td>{event.status}</td></tr>)}</tbody></table></div>
        <p><Link className="btn primary" href="/app">Open V1 dashboard</Link></p>
      </main>
    </PageFrame>
  );
}
