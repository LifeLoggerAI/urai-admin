
import { Link, useLocation } from 'react-router-dom';
const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/system', label: 'System' },
  { to: '/users', label: 'Users' },
  { to: '/execution-runs', label: 'Execution Runs' },
  { to: '/asset-factory', label: 'Asset Factory' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/content', label: 'Content' },
];
export default function Nav(){
  const { pathname } = useLocation();
  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #eee'}}>
      {items.map(i=> (
        <Link key={i.to} to={i.to} style={{
          fontWeight: pathname===i.to ? 700 : 400,
          textDecoration: pathname===i.to ? 'underline' : 'none'
        }}>{i.label}</Link>
      ))}
    </nav>
  );
}