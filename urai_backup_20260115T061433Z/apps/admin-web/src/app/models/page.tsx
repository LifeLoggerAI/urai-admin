
import ModelGovernance from '../../components/ModelGovernance';

export default function ModelsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">AI/Model Governance Panel</h1>
      <p className="text-zinc-500">Manage and monitor AI models.</p>
      <ModelGovernance />
    </div>
  );
}
