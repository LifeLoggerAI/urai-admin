import { AppShell } from '@/components/app-shell';
import { reports } from '@/lib/demo-data';

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <div className="card table-shell">
        <h3>Fixture reports</h3>
        <table className="table"><caption className="sr-only">Static demo report records</caption><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td>{report.name}</td><td>{report.type}</td><td>{report.status}</td><td>{report.owner}</td></tr>)}</tbody></table>
      </div>
      <section className="section card"><h3>Fixture capability boundary</h3><p>This demo models report metadata and export interfaces. It does not claim scheduled delivery, provider connectivity, or production report generation.</p></section>
    </AppShell>
  );
}
