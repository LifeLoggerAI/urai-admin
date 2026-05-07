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
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
if (!getApps().length) {
    if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
        throw new Error('The FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
    }
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON))
    });
}
var db = getFirestore();
// Basic YYYY-MM-DD date string validation
function isValidDateString(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, dateParam, dateStr, yesterday, dauRef, dauDoc, dauData, eventsRef, eventsDoc, eventsData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    searchParams = new URL(request.url).searchParams;
                    dateParam = searchParams.get('date');
                    dateStr = void 0;
                    if (dateParam && isValidDateString(dateParam)) {
                        dateStr = dateParam;
                    }
                    else {
                        yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        dateStr = yesterday.toISOString().split('T')[0];
                    }
                    dauRef = db.collection("analytics_aggregates").doc("dau_".concat(dateStr));
                    return [4 /*yield*/, dauRef.get()];
                case 1:
                    dauDoc = _a.sent();
                    dauData = dauDoc.exists ? dauDoc.data() : { count: 0, date: dateStr };
                    eventsRef = db.collection("analytics_aggregates").doc("events_".concat(dateStr));
                    return [4 /*yield*/, eventsRef.get()];
                case 2:
                    eventsDoc = _a.sent();
                    eventsData = eventsDoc.exists ? eventsDoc.data() : { counts: {}, date: dateStr };
                    return [2 /*return*/, NextResponse.json({
                            dau: dauData,
                            events: eventsData,
                        })];
                case 3:
                    error_1 = _a.sent();
                    console.error("ANALYTICS_API_ERROR:", error_1);
                    return [2 /*return*/, NextResponse.json({ error: "Internal Server Error" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
