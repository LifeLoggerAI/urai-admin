
import SystemConfiguration from '../../components/SystemConfiguration';

export default function ConfigurationPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">System Configuration Center</h1>
      <p className="text-zinc-500">Manage system-wide settings and feature flags.</p>
      <SystemConfiguration />
    </div>
  );
}
