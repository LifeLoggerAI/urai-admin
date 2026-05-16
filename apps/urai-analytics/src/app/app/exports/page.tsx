import { AppShell } from '@/components/app-shell';

export default function ExportsPage() {
  return (
    <AppShell title="Exports">
      <div className="grid two">
        <div className="card"><h3>CSV export</h3><p>Export filtered event and aggregate data for workspace-scoped analysis.</p><button className="btn primary">Prepare CSV export</button></div>
        <div className="card"><h3>Privacy export</h3><p>Generate user-scoped export packages for privacy operations and compliance workflows.</p><button className="btn">Create privacy export</button></div>
      </div>
      <section className="section card"><h3>Export controls</h3><p>Exports must be tenant-scoped, audited, and entitlement-checked before production launch.</p></section>
    </AppShell>
  );
}
