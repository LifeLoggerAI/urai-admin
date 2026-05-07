import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export var withAdminAuth = function (Component) {
    var AuthenticatedComponent = function (props) {
        var _a = useAuth(), user = _a.user, role = _a.role, loading = _a.loading;
        var router = useRouter();
        useEffect(function () {
            if (!loading && !user) {
                router.push('/login');
            }
            else if (!loading && user && role !== 'admin' && role !== 'staff') {
                router.push('/unauthorized');
            }
        }, [user, role, loading, router]);
        if (loading) {
            return <div>Loading...</div>;
        }
        if (!user || (role !== 'admin' && role !== 'staff')) {
            return null;
        }
        return <Component {...props}/>;
    };
    return AuthenticatedComponent;
};
