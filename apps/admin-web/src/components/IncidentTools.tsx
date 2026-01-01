
export default function IncidentTools() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Incident & Crisis Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">System Status</div>
            <div className="text-2xl font-semibold text-green-500">Normal</div>
            <button className="mt-2 text-blue-500 hover:underline">Activate Incident Mode</button>
          </div>
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Emergency Banner</div>
            <div className="text-2xl font-semibold">Inactive</div>
            <button className="mt-2 text-blue-500 hover:underline">Inject Banner</button>
          </div>
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Forensic Logging</div>
            <div className="text-2xl font-semibold">Disabled</div>
            <button className="mt-2 text-blue-500 hover:underline">Enable</button>
          </div>
        </div>
      </div>
    );
  }
