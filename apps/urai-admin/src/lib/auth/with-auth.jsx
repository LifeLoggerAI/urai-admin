'use client';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
export function withAuth(WrappedComponent) {
    return function WithAuth(props) {
        var _a = useAuth(), user = _a.user, loading = _a.loading;
        var router = useRouter();
        if (loading) {
            return <div>Loading...</div>; // Or a spinner
        }
        if (!user) {
            router.replace('/login');
            return null;
        }
        return <WrappedComponent {...props}/>;
    };
}
