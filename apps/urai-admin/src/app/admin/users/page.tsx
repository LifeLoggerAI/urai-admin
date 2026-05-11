export default function AdminUsersPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage active admin access and role assignments through hardened admin APIs.
        </p>
      </div>

      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        User records load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </div>
    </main>
  );
}
