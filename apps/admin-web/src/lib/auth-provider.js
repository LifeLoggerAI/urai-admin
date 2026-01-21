'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
exports.RequireAdmin = RequireAdmin;
var react_1 = require("react");
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firebase_config_1 = require("./firebase-config");
var navigation_1 = require("next/navigation");
var app = (0, app_1.getApps)().length ? (0, app_1.getApp)() : (0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
var auth = (0, auth_1.getAuth)(app);
var googleProvider = new auth_1.GoogleAuthProvider();
var AuthContext = (0, react_1.createContext)({
    user: null, loading: true, isAdmin: false,
    signInWithEmail: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    signInWithGoogle: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    logout: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
});
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), isAdmin = _d[0], setIsAdmin = _d[1];
    (0, react_1.useEffect)(function () {
        var unsubscribe = (0, auth_1.onIdTokenChanged)(auth, function (user) { return __awaiter(void 0, void 0, void 0, function () {
            var token, userRole, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.getIdTokenResult()];
                    case 1:
                        token = _c.sent();
                        userRole = token.claims.role;
                        setIsAdmin(['admin', 'superadmin'].includes(userRole));
                        setUser(user);
                        _a = document;
                        _b = "firebaseIdToken=".concat;
                        return [4 /*yield*/, user.getIdToken()];
                    case 2:
                        _a.cookie = _b.apply("firebaseIdToken=", [_c.sent(), "; path=/;"]);
                        return [3 /*break*/, 4];
                    case 3:
                        setUser(null);
                        setIsAdmin(false);
                        document.cookie = 'firebaseIdToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        _c.label = 4;
                    case 4:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); });
        return function () { return unsubscribe(); };
    }, []);
    var value = {
        user: user,
        loading: loading,
        isAdmin: isAdmin,
        signInWithEmail: function (email, pass) { return (0, auth_1.signInWithEmailAndPassword)(auth, email, pass); },
        signInWithGoogle: function () { return (0, auth_1.signInWithPopup)(auth, googleProvider); },
        logout: function () { return (0, auth_1.signOut)(auth); },
    };
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
exports.AuthProvider = AuthProvider;
var useAuth = function () { return (0, react_1.useContext)(AuthContext); };
exports.useAuth = useAuth;
function RequireAdmin(_a) {
    var children = _a.children;
    var _b = (0, exports.useAuth)(), isAdmin = _b.isAdmin, loading = _b.loading;
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        if (!loading && !isAdmin) {
            router.push('/access-denied');
        }
    }, [isAdmin, loading, router]);
    if (loading || !isAdmin) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }
    return <>{children}</>;
}
