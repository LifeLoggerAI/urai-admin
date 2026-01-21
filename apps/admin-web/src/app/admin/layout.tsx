
import AdminLayout from '@/components/layout/AdminLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
