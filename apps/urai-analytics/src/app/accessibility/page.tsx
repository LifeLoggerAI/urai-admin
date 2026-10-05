import { PageFrame } from '@/components/marketing';

export default function AccessibilityPage() {
  return (
    <PageFrame>
      <main id="main-content" className="page section">
        <p className="eyebrow">Accessibility</p>
        <h1>Analytics should remain understandable and operable without a mouse.</h1>
        <div className="grid section">
          <section className="card"><h2>Keyboard and focus</h2><p>Public navigation and controls are expected to work by keyboard with a visible focus indicator and logical order.</p></section>
          <section className="card"><h2>Reflow and text</h2><p>Layouts are designed to reflow on narrow screens and preserve browser text scaling. Dense tables may scroll horizontally instead of clipping content.</p></section>
          <section className="card"><h2>Motion and contrast</h2><p>The public shell honors reduced-motion preferences and keeps focus and boundaries visible in high-contrast system modes.</p></section>
          <section className="card"><h2>Report a barrier</h2><p>Email <a href="mailto:accessibility@urailabs.com">accessibility@urailabs.com</a> with the affected page and the task you were trying to complete. Do not send secrets or private analytics data.</p></section>
        </div>
      </main>
    </PageFrame>
  );
}
