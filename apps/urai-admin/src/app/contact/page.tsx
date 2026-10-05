import Link from 'next/link';

const contactReasons = [
  'Request early access for uraiadmin.com',
  'Discuss a standalone deployment for your product',
  'Evaluate URAI Admin for Firebase or AI app operations',
  'Explore agency, team, or enterprise use cases',
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12" aria-labelledby="contact-title">
          <h1 id="contact-title" className="text-5xl font-bold tracking-tight">Contact URAI Admin</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Request access, discuss a standalone deployment, or get help with the URAI Admin public and protected surfaces.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="font-semibold text-white">Product and account support</h2>
              <p className="mt-2">
                <a className="text-cyan-200 underline underline-offset-4 hover:text-white" href="mailto:support@urailabs.com">
                  support@urailabs.com
                </a>
              </p>
              <p className="mt-2">Use this address for access, product, deployment, and account-support questions.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="font-semibold text-white">Security reports</h2>
              <p className="mt-2">
                <a className="text-cyan-200 underline underline-offset-4 hover:text-white" href="mailto:security@urailabs.com">
                  security@urailabs.com
                </a>
              </p>
              <p className="mt-2">Use this address for vulnerabilities, suspected exposure, or security-sensitive reports.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="font-semibold">Good reasons to reach out</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {contactReasons.map((reason) => <li key={reason}>• {reason}</li>)}
            </ul>
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-400">
            Do not send passwords, API keys, session cookies, recovery codes, or other secrets by email.
          </p>
        </section>
      </div>
    </main>
  );
}
