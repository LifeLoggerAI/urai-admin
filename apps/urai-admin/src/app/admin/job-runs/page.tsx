export default function JobRunsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Runs</h1>
        <p className="text-sm text-muted-foreground">Recent job execution history and failure context.</p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Job run records load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
