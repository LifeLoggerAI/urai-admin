export var metadata = {
  title: 'URAI Admin Privacy',
  description: 'Privacy boundary for the URAI Admin control plane.',
};

export default function PrivacyPage() {
  return (
    <main>
      <h1>Privacy</h1>
      <p>URAI Admin is an internal operations console. It may show operational metadata, release evidence, aggregate status, governance evidence, and admin audit records.</p>
      <h2>Restricted data boundary</h2>
      <p>URAI Admin must not expose raw consumer passive telemetry, raw audio, private transcripts, raw location trails, consumer identity vectors, or unreviewed health and mental-health inference records unless a privacy review explicitly approves the route, fields, role, retention model, and audit trail.</p>
      <h2>Admin accountability</h2>
      <p>Privileged actions must be role-scoped, logged, and reviewable through immutable audit evidence.</p>
    </main>
  );
}
