
import UserIntelligence from '../../components/UserIntelligence';

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">User Intelligence Console</h1>
      <p className="text-zinc-500">View and manage user accounts.</p>
      <UserIntelligence />
    </div>
  );
}
