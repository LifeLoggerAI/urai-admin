import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
export function useRBAC() {
    var user = useAuth().user;
    var _a = useState(null), role = _a[0], setRole = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        if (user) {
            user.getIdTokenResult().then(function (idTokenResult) {
                setRole(idTokenResult.claims.role);
                setLoading(false);
            });
        }
        else {
            setLoading(false);
        }
    }, [user]);
    return { role: role, loading: loading };
}
