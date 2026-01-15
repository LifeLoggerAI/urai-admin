import { Routes, Route, Link } from 'react-router-dom';
const AdminLayout = ({ children }) => (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ width: '220px', background: '#f0f2f5', padding: '1rem', borderRight: '1px solid #ddd' }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem'}}>URAI Admin</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Dashboard', 'Users', 'Roles', 'Feature-Flags', 'System-Config', 'Jobs', 'Artifacts', 'Moderation', 'Audit', 'Analytics', 'Privacy'].map(p =>
                    <li key={p} style={{marginBottom: '0.8rem'}}><Link to={`/${p.toLowerCase()}`}>{p}</Link></li>
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
            <Route path="/" element={<MockPage title="Dashboard" />} />
            <Route path="/dashboard" element={<MockPage title="Dashboard" />} />
            <Route path="/users" element={<MockPage title="Users" />} />
            <Route path="/roles" element={<MockPage title="Roles" />} />
            <Route path="/feature-flags" element={<MockPage title="Feature Flags" />} />
            <Route path="/system-config" element={<MockPage title="System Config" />} />
            <Route path="/jobs" element={<MockPage title="Jobs" />} />
            <Route path="/artifacts" element={<MockPage title="Artifacts" />} />
            <Route path="/moderation" element={<MockPage title="Moderation" />} />
            <Route path="/audit" element={<MockPage title="Audit" />} />
            <Route path="/analytics" element={<MockPage title="Analytics" />} />
            <Route path="/privacy" element={<MockPage title="Privacy" />} />
        </Routes>
    </AdminLayout>
  );
}
