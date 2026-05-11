import Link from 'next/link';
import { PageFrame } from '@/components/marketing';

export default function SignupPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Signup</p><h1>Create your URAI Analytics workspace.</h1>
        <div className="card"><p>V1 signup will create a user, organization, workspace, membership, starter entitlement, and first API key. This surface is ready for Firebase Auth integration.</p><Link className="btn primary" href="/app">Preview onboarding</Link></div>
      </main>
    </PageFrame>
  );
}
