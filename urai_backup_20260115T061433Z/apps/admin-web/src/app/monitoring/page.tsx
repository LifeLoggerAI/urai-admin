
import PipelineHealth from '../../components/PipelineHealth';

export default function MonitoringPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Data Pipeline & Ingestion Monitoring</h1>
      <p className="text-zinc-500">Monitor the health of the URAI data pipeline.</p>
      <PipelineHealth />
    </div>
  );
}
