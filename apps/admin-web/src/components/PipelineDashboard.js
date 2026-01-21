"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PipelineDashboard;
var pipelineMetrics = [
    { name: 'Firestore Ingestion Rate', value: '1,289 docs/min', status: 'Healthy' },
    { name: 'Cloud Function Executions', value: '4,512/hr', status: 'Healthy' },
    { name: 'BigQuery Sync Lag', value: '2 min', status: 'Warning' },
    { name: 'Failed Jobs', value: '3', status: 'Error' },
];
function PipelineDashboard() {
    return (<div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Data Pipeline & Ingestion Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineMetrics.map(function (metric) { return (<div key={metric.name} className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.name}</div>
              <div className="text-2xl font-semibold">{metric.value}</div>
              <div className={"text-sm font-bold ".concat(metric.status === 'Healthy' ? 'text-green-500' : metric.status === 'Warning' ? 'text-yellow-500' : 'text-red-500')}>
                {metric.status}
              </div>
            </div>); })}
        </div>
      </div>);
}
