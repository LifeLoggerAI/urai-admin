import Link from 'next/link';

export function MarketingNav() {
  return (
    <nav className="nav page">
      <Link href="/" className="brand">URAI Analytics</Link>
      <div className="navlinks">
        <Link href="/product">Product</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/enterprise">Enterprise</Link>
        <Link href="/demo">Demo</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/app">Dashboard</Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="page section" style={{ borderTop: '1px solid var(--line)', marginTop: 40 }}>
      <div className="grid">
        <div><b>URAI Analytics</b><p>Privacy-aware analytics for passive intelligence systems.</p></div>
        <div><b>Product</b><p><Link href="/api-docs">API</Link><br /><Link href="/security">Security</Link><br /><Link href="/contact">Contact</Link></p></div>
        <div><b>Legal</b><p><Link href="/privacy">Privacy</Link><br /><Link href="/terms">Terms</Link></p></div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <><MarketingNav />{children}<Footer /></>;
}

export function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card"><h3>{title}</h3><p>{children}</p></div>;
}
