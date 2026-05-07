'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
export function Providers(_a) {
    var children = _a.children;
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var router = useRouter();
    var pathname = usePathname();
    useEffect(function () {
        var unsubscribe = onAuthStateChanged(auth, function (user) {
            setUser(user);
            if (!user && pathname !== '/login') {
                router.push('/login');
            }
        });
        return function () { return unsubscribe(); };
    }, [pathname, router]);
    return <>{children}</>;
}
