'use client';

import AdminNav from './AdminNav';

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      <main>{children}</main>
    </div>
  );
};

export default Shell;
