import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <h1 className="text-5xl font-bold tracking-tight">Contact URAI Admin</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Request access, discuss a standalone deployment, or explore URAI Admin for your AI product operations.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-slate-400">Access</div>
              <div className="mt-2 text-white">Invite-based early access</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-slate-400">Best for</div>
              <div className="mt-2 text-white">AI apps, Firebase products, ops teams, agencies</div>
            </div>
          </div>
          <p className="mt-8 text-sm text-slate-400">
            Add your preferred support mailbox or contact form provider here before public launch.
          </p>
        </section>
      </div>
    </main>
  );
}
