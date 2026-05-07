'use client';
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
import { useEffect, useState } from 'react';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export default function AccessPage() {
    var _this = this;
    var _a = useState(null), user = _a[0], setUser = _a[1];
    var _b = useState(null), role = _b[0], setRole = _b[1];
    var _c = useState(null), requestStatus = _c[0], setRequestStatus = _c[1];
    useEffect(function () {
        var fetchUserData = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentUser, userRole, requestDocRef, requestDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        setUser(currentUser);
                        if (!currentUser) return [3 /*break*/, 4];
                        return [4 /*yield*/, getUserRole(currentUser.uid)];
                    case 2:
                        userRole = _a.sent();
                        setRole(userRole);
                        requestDocRef = doc(db, 'accessRequests', currentUser.uid);
                        return [4 /*yield*/, getDoc(requestDocRef)];
                    case 3:
                        requestDoc = _a.sent();
                        if (requestDoc.exists()) {
                            setRequestStatus(requestDoc.data().status);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchUserData();
    }, []);
    var handleRequestAccess = function () { return __awaiter(_this, void 0, void 0, function () {
        var requestDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) return [3 /*break*/, 2];
                    requestDocRef = doc(db, 'accessRequests', user.uid);
                    return [4 /*yield*/, setDoc(requestDocRef, {
                            email: user.email,
                            displayName: user.displayName,
                            requestedAt: new Date(),
                            status: 'pending',
                        })];
                case 1:
                    _a.sent();
                    setRequestStatus('pending');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Access Control</h1>
      {user ? (<Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>UID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {role}</p>
            {role === 'viewer' && (<div className="mt-4">
                {requestStatus === 'pending' ? (<p>Your access request is pending.</p>) : (<Button onClick={handleRequestAccess}>Request Access</Button>)}
              </div>)}
          </CardContent>
        </Card>) : (<p>Loading user information...</p>)}
    </div>);
}
