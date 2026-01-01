
import RolesAndPermissions from '../../components/RolesAndPermissions';
import AuditLog from '../../components/AuditLog';

export default function RolesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Roles, Permissions & Audit Logs</h1>
      <p className="text-zinc-500">Manage admin roles, permissions, and view audit trails.</p>
      <RolesAndPermissions />
      <AuditLog />
    </div>
  );
}
