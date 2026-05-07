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
import { AnalyticsEventSchemaV1 } from '@/lib/analytics/schema';
// Initialize Firebase Admin SDK
if (!getApps().length) {
    if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
        throw new Error('The FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
    }
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON))
    });
}
var db = getFirestore();
// Block known sensitive keys
var BLOCKED_KEYS = ['email', 'password', 'token', 'secret', 'address', 'phone', 'ssn'];
var redact = function (obj) {
    if (!obj)
        return obj;
    var newObj = {};
    for (var key in obj) {
        if (BLOCKED_KEYS.includes(key.toLowerCase())) {
            newObj[key] = '[REDACTED]';
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            newObj[key] = redact(obj[key]);
        }
        else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, validationResult, event_1, eventId, timestamp, date, collectionName, eventRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _a.sent();
                    validationResult = AnalyticsEventSchemaV1.safeParse(body);
                    if (!validationResult.success) {
                        console.warn('Invalid analytics event schema', validationResult.error.flatten());
                        return [2 /*return*/, NextResponse.json({ error: "Invalid event schema", details: validationResult.error.flatten() }, { status: 400 })];
                    }
                    event_1 = validationResult.data;
                    // 2. Consent Check (server-side enforcement)
                    if (!event_1.consent.granted) {
                        return [2 /*return*/, NextResponse.json({ error: "Consent not granted for analytics." }, { status: 403 })];
                    }
                    // 3. Redact sensitive properties
                    if (event_1.properties) {
                        event_1.properties = redact(event_1.properties);
                    }
                    eventId = event_1.eventId, timestamp = event_1.timestamp;
                    date = new Date(timestamp);
                    collectionName = "analytics_events_raw_".concat(date.toISOString().split('T')[0]);
                    eventRef = db.collection(collectionName).doc(eventId);
                    return [4 /*yield*/, eventRef.set(event_1)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, NextResponse.json({ success: true, eventId: eventId }, { status: 202 })];
                case 3:
                    error_1 = _a.sent();
                    console.error("INGESTION_ERROR:", error_1);
                    return [2 /*return*/, NextResponse.json({ error: "Internal Server Error" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
