
import SafetyReview from '../../components/SafetyReview';

export default function SafetyPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Content & Insight Safety Review</h1>
      <p className="text-zinc-500">Review and manage flagged content.</p>
      <SafetyReview />
    </div>
  );
}
