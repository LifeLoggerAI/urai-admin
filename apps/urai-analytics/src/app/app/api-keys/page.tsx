import { AppShell } from '@/components/app-shell';
import { apiKeys } from '@/lib/demo-data';

export default function ApiKeysPage() {
  return (
    <AppShell title="API keys">
      <div className="card">
        <h3>Workspace API keys</h3>
        <table className="table"><thead><tr><th>Name</th><th>Prefix</th><th>Scopes</th><th>Status</th></tr></thead><tbody>{apiKeys.map((key) => <tr key={key.id}><td>{key.name}</td><td>{key.prefix}</td><td>{key.scopes}</td><td>{key.status}</td></tr>)}</tbody></table>
      </div>
      <section className="section card"><h3>Security model</h3><p>Production API keys must be hashed at rest, prefix-only visible in UI, scoped to organization/workspace/environment, rate limited, and revocable.</p></section>
    </AppShell>
  );
}
