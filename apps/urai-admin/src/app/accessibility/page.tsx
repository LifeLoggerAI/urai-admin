import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <article className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Accessibility</h1>
            <p className="mt-4 leading-7 text-slate-300">
              URAI Admin is designed to support keyboard navigation, visible focus, browser text scaling, reduced-motion preferences, and high-contrast system modes.
            </p>
          </div>
          <section>
            <h2 className="text-2xl font-semibold">Interaction</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Public and protected controls should remain operable without a pointer. Interactive targets use visible focus treatment and are sized for reliable touch and keyboard use.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Motion and display</h2>
            <p className="mt-3 leading-7 text-slate-300">
              The interface honors reduced-motion preferences, preserves browser text resizing, and keeps critical boundaries visible in forced-colors mode.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Report a barrier</h2>
            <p className="mt-3 leading-7 text-slate-300">
              If an Admin page is difficult to use with assistive technology, email <a className="text-cyan-200 underline underline-offset-4 hover:text-white" href="mailto:accessibility@urailabs.com">accessibility@urailabs.com</a>. Include the affected page and what you were trying to do; do not send credentials or secrets.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
