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
      <aside className="sidebar">
        <Link href="/" className="brand">URAI Analytics</Link>
        <p>Workspace: <span className="badge">Demo Production</span></p>
        <nav className="side-nav">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </aside>
      <main className="main">
        <div className="toolbar">
          <div><p className="eyebrow">V1 Command Center</p><h2>{title}</h2></div>
          <div className="ctas"><span className="badge">Last 7 days</span><span className="badge">Production</span></div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="card"><p>{label}</p><div className="metric">{value}</div><p>{detail}</p></div>;
}
