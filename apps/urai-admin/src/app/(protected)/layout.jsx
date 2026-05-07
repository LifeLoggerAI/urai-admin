import { AuthProvider } from '@/lib/auth/auth-provider';
import { Header } from '@/components/layout/header';
export default function ProtectedLayout(_a) {
    var children = _a.children;
    return (<AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
    </AuthProvider>);
}
