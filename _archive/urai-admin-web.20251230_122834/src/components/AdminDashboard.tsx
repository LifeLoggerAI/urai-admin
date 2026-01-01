
import React from 'react';
import { RoleManager } from './RoleManager';

export const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>URAI Admin Dashboard</h1>
      <p>Welcome to the URAI administrative panel.</p>
      
      <hr style={{ margin: '20px 0' }} />

      <section>
        <h2>Security</h2>
        <p>Manage user roles and permissions.</p>
        <RoleManager />
      </section>

      {/* You can add other admin components here */}

    </div>
  );
};
