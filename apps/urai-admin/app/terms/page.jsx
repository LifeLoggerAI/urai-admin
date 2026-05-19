export var metadata = {
  title: 'URAI Admin Terms',
  description: 'Operational terms for URAI Admin.',
};

export default function TermsPage() {
  return (
    <main>
      <h1>Terms</h1>
      <p>URAI Admin is an internal operations and Council control plane for authorized URAI operators only.</p>
      <h2>Authorized use</h2>
      <p>Access is limited to approved admin, owner, and viewer roles with active authorization records. Unauthorized access, export, mutation, or disclosure is prohibited.</p>
      <h2>Production evidence</h2>
      <p>No release may be represented as production-ready without completed lock evidence, rollback proof, monitoring proof, and owner approval.</p>
    </main>
  );
}
