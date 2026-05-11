export default function AuditPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Recent admin actions, mutation targets, and before/after metadata.</p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Audit logs load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
