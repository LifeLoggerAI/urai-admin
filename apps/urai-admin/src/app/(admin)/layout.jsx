'use client';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function AdminLayout(_a) {
    var children = _a.children;
    var _b = useAuth(), user = _b.user, loading = _b.loading;
    var router = useRouter();
    useEffect(function () {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return null;
    }
    return <>{children}</>;
}
