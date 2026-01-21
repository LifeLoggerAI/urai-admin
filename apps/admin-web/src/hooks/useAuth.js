'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
var react_1 = require("react");
var auth_1 = require("firebase/auth");
var firebaseClient_1 = require("@/lib/firebaseClient");
var AuthContext = (0, react_1.createContext)({ user: null, loading: true });
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        var unsubscribe = (0, auth_1.onAuthStateChanged)(firebaseClient_1.auth, function (user) {
            setUser(user);
            setLoading(false);
        });
        return function () { return unsubscribe(); };
    }, []);
    return value = {};
    {
        user, loading;
    }
};
exports.AuthProvider = AuthProvider;
 >
    { children: children }
    < /AuthContext.Provider>;
;
;
var useAuth = function () { return (0, react_1.useContext)(AuthContext); };
exports.useAuth = useAuth;
