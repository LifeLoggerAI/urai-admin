import { Routes, Route, Link } from 'react-router-dom';
const AdminLayout = ({ children }) => (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ width: '220px', background: '#f0f2f5', padding: '1rem', borderRight: '1px solid #ddd' }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem'}}>URAI Admin</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  { path: '/admin/dashboard', name: 'Dashboard' }, 
                  { path: '/admin/users', name: 'Users' }, 
                  { path: '/admin/roles', name: 'Roles' }, 
                  { path: '/admin/feature-flags', name: 'Feature-Flags' }, 
                  { path: '/admin/system-config', name: 'System-Config' }, 
                  { path: '/admin/jobs', name: 'Jobs' }, 
                  { path: '/admin/artifacts', name: 'Artifacts' }, 
                  { path: '/admin/moderation', name: 'Moderation' }, 
                  { path: '/admin/audit', name: 'Audit' }, 
                  { path: '/admin/analytics', name: 'Analytics' }, 
                  { path: '/admin/privacy', name: 'Privacy' }
                ].map(p =>
                    <li key={p.name} style={{marginBottom: '0.8rem'}}><Link to={p.path}>{p.name}</Link></li>
                )}
            </ul>
            <div style={{position: 'absolute', bottom: '1rem', fontSize: '12px', color: '#666'}}>
                <p>Env: {import.meta.env.PROD ? 'PROD' : 'STAGING'}</p>
                <p>SHA: {(import.meta.env.VITE_GIT_SHA || 'dev').substring(0, 7)}</p>
            </div>
        </nav>
        <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>{children}</main>
    </div>
);
const MockPage = ({ title }) => (<div><h1>{title}</h1><p>Placeholder page.</p></div>);
export default function App() {
  return (
    <AdminLayout>
        <Routes>
            <Route path="/admin/dashboard" element={<MockPage title="Dashboard" />} />
            <Route path="/admin/users" element={<MockPage title="Users" />} />
            <Route path="/admin/roles" element={<MockPage title="Roles" />} />
            <Route path="/admin/feature-flags" element={<MockPage title="Feature Flags" />} />
            <Route path="/admin/system-config" element={<MockPage title="System Config" />} />
            <Route path="/admin/jobs" element={<MockPage title="Jobs" />} />
            <Route path="/admin/artifacts" element={<MockPage title="Artifacts" />} />
            <Route path="/admin/moderation" element={<MockPage title="Moderation" />} />
            <Route path="/admin/audit" element={<MockPage title="Audit" />} />
            <Route path="/admin/analytics" element={<MockPage title="Analytics" />} />
            <Route path="/admin/privacy" element={<MockPage title="Privacy" />} />
            <Route path="/admin/" element={<MockPage title="Dashboard" />} />
        </Routes>
    </AdminLayout>
  );
}
