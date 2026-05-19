import Link from 'next/link';

const plans = [
  { name: 'Starter', price: 'For solo builders', features: ['1 project', 'Core admin console', 'Feature flags', 'Audit logs', 'Job monitoring'] },
  { name: 'Pro', price: 'For growing AI apps', features: ['Multiple projects', 'Team roles', 'Longer retention', 'Dead letter monitoring', 'Priority support'] },
  { name: 'Enterprise', price: 'For teams and agencies', features: ['Custom retention', 'SAML/SSO planning', 'Advanced audit exports', 'Multi-tenant workspaces', 'Dedicated support'] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <div className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">Pricing built for launch, growth, and scale.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            URAI Admin can start as your internal console and grow into a full operations layer for teams, clients, and products.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <section key={plan.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-cyan-200">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-xl font-semibold">Access is currently invite-based.</h2>
          <p className="mt-2 text-slate-300">Contact URAI Labs to discuss early access, internal deployment, or standalone product setup.</p>
          <Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200">Request access</Link>
        </div>
      </div>
    </main>
  );
}
