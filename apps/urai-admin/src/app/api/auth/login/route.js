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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
var db = getFirestore();
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var idToken, decodedToken, uid, email, expiresIn, sessionCookie, adminUserRef, adminUserDoc, user, cookieStore, adminUsersCollection, snapshot, cookieStore, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, req.json()];
                case 1:
                    idToken = (_b.sent()).idToken;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, , 15]);
                    return [4 /*yield*/, auth.verifyIdToken(idToken)];
                case 3:
                    decodedToken = _b.sent();
                    uid = decodedToken.uid, email = decodedToken.email;
                    expiresIn = 60 * 60 * 24 * 5 * 1000;
                    return [4 /*yield*/, auth.createSessionCookie(idToken, { expiresIn: expiresIn })];
                case 4:
                    sessionCookie = _b.sent();
                    adminUserRef = db.collection('adminUsers').doc(uid);
                    return [4 /*yield*/, adminUserRef.get()];
                case 5:
                    adminUserDoc = _b.sent();
                    if (!(adminUserDoc.exists && ((_a = adminUserDoc.data()) === null || _a === void 0 ? void 0 : _a.isActive))) return [3 /*break*/, 8];
                    user = adminUserDoc.data();
                    return [4 /*yield*/, auth.setCustomUserClaims(uid, { role: user.role })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, adminUserRef.update({ lastLoginAt: new Date() })];
                case 7:
                    _b.sent();
                    cookieStore = cookies();
                    cookieStore.set('__session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                    return [2 /*return*/, NextResponse.json({ success: true }, { status: 200 })];
                case 8:
                    adminUsersCollection = db.collection('adminUsers');
                    return [4 /*yield*/, adminUsersCollection.get()];
                case 9:
                    snapshot = _b.sent();
                    if (!(snapshot.empty && process.env.ALLOW_ADMIN_BOOTSTRAP === 'true')) return [3 /*break*/, 12];
                    return [4 /*yield*/, adminUserRef.set({
                            email: email,
                            role: 'owner',
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            lastLoginAt: new Date(),
                        })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, auth.setCustomUserClaims(uid, { role: 'owner' })];
                case 11:
                    _b.sent();
                    cookieStore = cookies();
                    cookieStore.set('__session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                    return [2 /*return*/, NextResponse.json({ success: true, isBootstrap: true }, { status: 200 })];
                case 12: return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_1 = _b.sent();
                    console.error('Login error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })];
                case 15: return [2 /*return*/];
            }
        });
    });
}
