
import PipelineDashboard from '../../components/PipelineDashboard';

export default function PipelinePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Data Pipeline & Ingestion Monitoring</h1>
      <p className="text-zinc-500">Monitor the health and performance of the URAI data pipeline.</p>
      <PipelineDashboard />
    </div>
  );
}
