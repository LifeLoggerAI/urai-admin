'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '220px', padding: '1rem', borderRight: '1px solid #e0e0e0', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}><Link href="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>URAI-ADMIN</Link></h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
          <li style={{ marginBottom: '0.5rem' }}><Link href="/admin/dashboard">Dashboard</Link></li>
          <li style={{ marginBottom: '0.5rem' }}><Link href="/admin/users">Users</Link></li>
        </ul>
        <button onClick={handleLogout} style={{ width: '100%', padding: '0.5rem' }}>Logout</button>
      </nav>
      <main style={{ flex: 1, padding: '2rem', background: '#ffffff' }}>{children}</main>
    </div>
  );
}
