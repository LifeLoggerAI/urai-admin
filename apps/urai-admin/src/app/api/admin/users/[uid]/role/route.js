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
import { NextResponse } from 'next/server';
import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';
export function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var uid, sessionCookie, decodedToken, actorUid, actorEmail, actorRole, role, userRef, error_1;
        var _c;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    uid = params.uid;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 7, , 8]);
                    sessionCookie = (_c = req.cookies.get('__session')) === null || _c === void 0 ? void 0 : _c.value;
                    if (!sessionCookie) {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                    }
                    return [4 /*yield*/, auth.verifySessionCookie(sessionCookie, true)];
                case 2:
                    decodedToken = _d.sent();
                    actorUid = decodedToken.uid, actorEmail = decodedToken.email, actorRole = decodedToken.role;
                    if (actorRole !== 'owner') {
                        return [2 /*return*/, NextResponse.json({ error: 'Forbidden' }, { status: 403 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 3:
                    role = (_d.sent()).role;
                    if (!['owner', 'admin', 'viewer'].includes(role)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid role' }, { status: 400 })];
                    }
                    // You can't change your own role.
                    if (actorUid === uid) {
                        return [2 /*return*/, NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })];
                    }
                    userRef = firestore.collection('adminUsers').doc(uid);
                    return [4 /*yield*/, userRef.update({ role: role })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, auth.setCustomUserClaims(uid, { role: role })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, writeAuditLog({
                            actorUid: actorUid,
                            actorEmail: actorEmail,
                            action: 'update_role',
                            target: { type: 'user', id: uid },
                            metadata: { newRole: role },
                        })];
                case 6:
                    _d.sent();
                    return [2 /*return*/, NextResponse.json({ success: true })];
                case 7:
                    error_1 = _d.sent();
                    console.error("Error updating role for user ".concat(uid, ":"), error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
