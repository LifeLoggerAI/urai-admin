import { Link, useLocation } from 'react-router-dom';
const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/flags', label: 'Flags' },
  { to: '/reports', label: 'Reports' },
  { to: '/dsr', label: 'DSR' },
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