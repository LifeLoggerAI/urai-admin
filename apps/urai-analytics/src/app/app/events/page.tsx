import { AppShell } from '@/components/app-shell';
import { demoMetrics, recentEvents } from '@/lib/demo-data';

export default function EventsPage() {
  return (
    <AppShell title="Events">
      <div className="grid two">
        <div className="card table-shell"><h3>Top events</h3><table className="table"><caption className="sr-only">Top static demo events</caption><thead><tr><th scope="col">Event</th><th scope="col">Count</th></tr></thead><tbody>{demoMetrics.topEvents.map((event) => <tr key={event.eventName}><td>{event.eventName}</td><td>{event.count.toLocaleString()}</td></tr>)}</tbody></table></div>
        <div className="card table-shell"><h3>Top routes</h3><table className="table"><caption className="sr-only">Top static demo routes</caption><thead><tr><th scope="col">Route</th><th scope="col">Count</th></tr></thead><tbody>{demoMetrics.topRoutes.map((route) => <tr key={route.route}><td>{route.route}</td><td>{route.count.toLocaleString()}</td></tr>)}</tbody></table></div>
      </div>
      <section className="section card table-shell"><h3>Recent events</h3><table className="table"><caption className="sr-only">Recent static demo events</caption><thead><tr><th scope="col">Event</th><th scope="col">User</th><th scope="col">Route</th><th scope="col">Privacy</th><th scope="col">Status</th></tr></thead><tbody>{recentEvents.map((event) => <tr key={event.id}><td>{event.eventName}</td><td>{event.user}</td><td>{event.route}</td><td>{event.privacy}</td><td>{event.status}</td></tr>)}</tbody></table></section>
    </AppShell>
  );
}
