export default function DeadLettersPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dead Letters</h1>
        <p className="text-sm text-muted-foreground">Read-only queue failures that need operational follow-up.</p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Dead-letter records load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
