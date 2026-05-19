import Link from 'next/link';

const controls = [
  'Session-cookie protected admin routes',
  'Role-aware access checks for owner, admin, and viewer',
  'Active admin user verification before privileged access',
  'Deny-by-default Firestore security rules',
  'Server-side Admin SDK writes for protected mutations',
  'Audit logs for sensitive admin actions',
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <div className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">Security-first admin operations.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            URAI Admin is designed around protected routes, hardened server APIs, explicit roles, and auditability by default.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {controls.map((control) => (
            <div key={control} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-slate-200">
              {control}
            </div>
          ))}
        </div>
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Admin writes stay server-side.</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Client-side admin users can read only what their role allows. Sensitive mutations go through protected API routes backed by Firebase Admin SDK and audit logging.
          </p>
        </section>
      </div>
    </main>
  );
}
