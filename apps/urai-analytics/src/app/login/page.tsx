import Link from 'next/link';
import { PageFrame } from '@/components/marketing';

export default function LoginPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Login</p><h1>Access your analytics workspace.</h1>
        <div className="card"><p>Auth wiring belongs to the shared URAI auth/Firebase layer. This V1 route provides the product surface and redirects users to the app dashboard after auth is connected.</p><Link className="btn primary" href="/app">Continue to dashboard</Link></div>
      </main>
    </PageFrame>
  );
}
