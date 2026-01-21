'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
var useAuth_1 = require("@/hooks/useAuth");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function ProtectedRoute(_a) {
    var children = _a.children;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, loading = _b.loading;
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    if (loading || !user) {
        return <div>Loading...</div>; // Or a proper spinner component
    }
    return <>{children}</>;
}
