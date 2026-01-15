'use client';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="mb-8">You do not have the required permissions to view this page.</p>
            <Button onClick={handleLogout}>Sign Out and Log In with a different account</Button>
        </div>
    );
}
