import Link from 'next/link';

const links = [
  ['Overview', '/app'],
  ['Events', '/app/events'],
  ['Sessions', '/app/sessions'],
  ['Reports', '/app/reports'],
  ['Exports', '/app/exports'],
  ['API Keys', '/app/api-keys'],
  ['Settings', '/app/settings'],
  ['Demo', '/demo']
] as const;

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="appshell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="sidebar">
        <Link href="/" className="brand">URAI Analytics</Link>
        <p>Workspace: <span className="badge">Fixture workspace</span></p>
        <nav className="side-nav" aria-label="Demo analytics workspace">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </aside>
      <main id="main-content" className="main">
        <div className="toolbar">
          <div><p className="eyebrow">Demo command center</p><h2>{title}</h2></div>
          <div className="ctas"><span className="badge">Static fixture window</span><span className="badge">Demo · not production</span></div>
        </div>
        <div className="card" role="status" aria-live="polite">
          <strong>Demo fixture data — not production telemetry.</strong>
          <p>Provider/runtime readback is not connected on this surface. Values below are static sample data for interface verification only.</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="card"><p>{label}</p><div className="metric">{value}</div><p>{detail}</p></div>;
}
