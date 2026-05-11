import { AppShell } from '@/components/app-shell';
import { reports } from '@/lib/demo-data';

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <div className="card">
        <h3>Reports</h3>
        <table className="table"><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Owner</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td>{report.name}</td><td>{report.type}</td><td>{report.status}</td><td>{report.owner}</td></tr>)}</tbody></table>
      </div>
      <section className="section card"><h3>V1 report acceptance</h3><p>V1 supports report metadata, CSV/export foundations, and executive summary surfaces. V2 adds scheduled PDF/email reports and AI-generated narration.</p></section>
    </AppShell>
  );
}
