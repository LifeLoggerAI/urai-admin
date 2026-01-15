
const healthMetrics = [
    { name: 'Firestore Ingestion', status: 'Healthy', details: 'Last batch processed 2 minutes ago' },
    { name: 'Cloud Functions', status: 'Healthy', details: 'All functions running normally' },
    { name: 'BigQuery Sync', status: 'Warning', details: 'Sync delayed by 15 minutes' },
    { name: 'Failed Jobs', status: 'Healthy', details: '0 failed jobs in the last 24 hours' },
    ];

export default function PipelineHealth() {
    return (
        <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Pipeline Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map(metric => (
            <div key={metric.name} className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.name}</div>
                <div className={`text-2xl font-semibold ${
                metric.status === 'Healthy' ? 'text-green-500' :
                metric.status === 'Warning' ? 'text-yellow-500' :
                'text-red-500'
                }`}>{metric.status}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{metric.details}</div>
            </div>
            ))}
        </div>
        </div>
    );
}
