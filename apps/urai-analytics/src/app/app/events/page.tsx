import { AppShell } from '@/components/app-shell';
import { demoMetrics, recentEvents } from '@/lib/demo-data';

export default function EventsPage() {
  return (
    <AppShell title="Events">
      <div className="grid two">
        <div className="card"><h3>Top events</h3><table className="table"><tbody>{demoMetrics.topEvents.map((event) => <tr key={event.eventName}><td>{event.eventName}</td><td>{event.count.toLocaleString()}</td></tr>)}</tbody></table></div>
        <div className="card"><h3>Top routes</h3><table className="table"><tbody>{demoMetrics.topRoutes.map((route) => <tr key={route.route}><td>{route.route}</td><td>{route.count.toLocaleString()}</td></tr>)}</tbody></table></div>
      </div>
      <section className="section card"><h3>Recent events</h3><table className="table"><thead><tr><th>Event</th><th>User</th><th>Route</th><th>Privacy</th><th>Status</th></tr></thead><tbody>{recentEvents.map((event) => <tr key={event.id}><td>{event.eventName}</td><td>{event.user}</td><td>{event.route}</td><td>{event.privacy}</td><td>{event.status}</td></tr>)}</tbody></table></section>
    </AppShell>
  );
}
