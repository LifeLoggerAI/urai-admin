import type { ReactNode } from 'react';

const defaultSignals = [
  { label: 'Surface', value: 'Spatial OS' },
  { label: 'Mode', value: 'Live admin' },
  { label: 'Quality', value: 'AAA shell' },
];

type SpatialAdminFrameProps = {
  eyebrow?: string;
  title: string;
  description: string;
  signals?: Array<{ label: string; value: string }>;
  children: ReactNode;
};

export function SpatialAdminFrame({
  eyebrow = 'URAI command world',
  title,
  description,
  signals = defaultSignals,
  children,
}: SpatialAdminFrameProps) {
  return (
    <main className="spatial-admin-frame">
      <section className="spatial-hero hero-glass">
        <div className="spatial-hero-copy">
          <p className="spatial-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="spatial-signal-grid" aria-label="Admin surface status signals">
          {signals.map((signal) => (
            <div key={signal.label} className="spatial-signal-card">
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {children}
    </main>
  );
}

export function SpatialSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="spatial-section">
      <div className="spatial-section-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SpatialStatusCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="spatial-status-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  );
}
