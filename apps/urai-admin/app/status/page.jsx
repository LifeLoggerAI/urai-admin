export var metadata = {
  title: 'URAI Admin Status',
  description: 'Safe public status page for URAI Admin.',
};

export default function StatusPage() {
  return (
    <main>
      <h1>URAI Admin Status</h1>
      <p>Public status summary for the URAI Admin control plane.</p>
      <section aria-label="Status posture">
        <h2>Current posture</h2>
        <p>Operational status must be verified from Firebase Hosting, Functions, Firestore rules, monitoring, and the release evidence ledger before production is marked healthy.</p>
      </section>
      <section aria-label="Safe disclosure boundary">
        <h2>Safe disclosure boundary</h2>
        <p>This public page must not expose internal diagnostics, user records, raw telemetry, secrets, or privileged admin evidence.</p>
      </section>
    </main>
  );
}
