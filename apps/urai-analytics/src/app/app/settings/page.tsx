import { AppShell } from '@/components/app-shell';

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="grid two">
        <div className="card"><h3>Workspace</h3><p>Name: Fixture Workspace</p><p>Environment: preview</p><p>Organization: URAI Demo</p><p>Provider state: not connected on this fixture surface</p></div>
        <div className="card"><h3>Privacy and retention</h3><p>Default privacy class: customer</p><p>Passive signals: ephemeral/short retention</p><p>Derived AI insights: short retention</p></div>
        <div className="card"><h3>Entitlements</h3><p>Fixture plan: Founder sample</p><p>Sample events/month: 500K</p><p>Sample reports/month: 25</p></div>
        <div className="card"><h3>URAI integration</h3><p>Core app, Admin, Privacy, Spatial, and B2B Portal events should be routed through the V1 event taxonomy once the protected runtime integration is connected and verified.</p></div>
      </div>
    </AppShell>
  );
}
