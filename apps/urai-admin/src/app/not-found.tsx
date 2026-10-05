import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">This Admin page is not available.</h1>
        <p className="mt-4 leading-7 text-slate-300">
          The address may be outdated, private, or unavailable. Protected operational routes require authorized sign-in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="min-h-12 rounded-full bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200">Return to Admin home</Link>
          <Link href="/contact" className="min-h-12 rounded-full border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
