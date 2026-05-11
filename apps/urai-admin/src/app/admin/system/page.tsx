export default function SystemPage() {
  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Control Surface</h1>
        <p className="text-sm text-muted-foreground">
          Read-only operational visibility for config, jobs, runs, failures, and dead letters.
        </p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        System config and job health records load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
