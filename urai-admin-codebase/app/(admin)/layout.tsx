'use client';

import Shell from '../../components/Shell';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      {children}
      <Toaster />
    </Shell>
  );
}
