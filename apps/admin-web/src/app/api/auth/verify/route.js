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
exports.GET = GET;
var server_1 = require("next/server");
var firebaseAdmin_1 = require("@/lib/firebaseAdmin");
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, userDoc, memberSnap, roles, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authHeader = req.headers.get("authorization") || "";
                    token = authHeader.replace("Bearer ", "");
                    if (!token) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, firebaseAdmin_1.adminAuth.verifyIdToken(token)];
                case 2:
                    decoded = _b.sent();
                    return [4 /*yield*/, firebaseAdmin_1.adminDb.doc("users/".concat(decoded.uid)).get()];
                case 3:
                    userDoc = _b.sent();
                    if (!userDoc.exists || ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.disabled)) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Forbidden: User is disabled or does not exist" }, { status: 403 })];
                    }
                    return [4 /*yield*/, firebaseAdmin_1.adminDb.collectionGroup('members').where('uid', '==', decoded.uid).get()];
                case 4:
                    memberSnap = _b.sent();
                    roles = memberSnap.docs.map(function (doc) { return doc.data().role; });
                    if (!roles.includes('admin') && !roles.includes('owner')) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Forbidden: User lacks admin role" }, { status: 403 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json({ uid: decoded.uid, email: decoded.email, roles: roles })];
                case 5:
                    error_1 = _b.sent();
                    console.error("Token verification failed:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
