import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { RequireAdmin } from "@/lib/auth-provider";

export default function AdminLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
}
