import { AppShell } from '@/components/app-shell';

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="grid two">
        <div className="card"><h3>Workspace</h3><p>Name: Demo Production</p><p>Environment: production</p><p>Organization: URAI Demo</p></div>
        <div className="card"><h3>Privacy and retention</h3><p>Default privacy class: customer</p><p>Passive signals: ephemeral/short retention</p><p>Derived AI insights: short retention</p></div>
        <div className="card"><h3>Entitlements</h3><p>Plan: Founder</p><p>Events/month: 500K</p><p>Reports/month: 25</p></div>
        <div className="card"><h3>URAI integration</h3><p>Core app, Admin, Privacy, Spatial, and B2B Portal events should be routed through the V1 event taxonomy.</p></div>
      </div>
    </AppShell>
  );
}
