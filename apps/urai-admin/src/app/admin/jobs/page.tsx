export default function JobsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">Read-only operational view of scheduled and background jobs.</p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Job records load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
