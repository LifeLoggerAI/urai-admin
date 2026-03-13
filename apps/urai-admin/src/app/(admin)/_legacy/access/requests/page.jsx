'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminSetUserRole } from '@/lib/firebase';
import { logAdminAction } from '@/lib/audit';
export default function AccessRequestsPage() {
    var _this = this;
    var _a = useState([]), requests = _a[0], setRequests = _a[1];
    var fetchRequests = function () { return __awaiter(_this, void 0, void 0, function () {
        var requestsCollection, requestsSnapshot, requestsList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestsCollection = collection(db, 'accessRequests');
                    return [4 /*yield*/, getDocs(requestsCollection)];
                case 1:
                    requestsSnapshot = _a.sent();
                    requestsList = requestsSnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    setRequests(requestsList);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchRequests();
    }, []);
    var handleApprove = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var requestDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminSetUserRole({ uid: request.id, role: 'staff' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, logAdminAction('approve_access_request', "Approved access request for ".concat(request.email))];
                case 2:
                    _a.sent();
                    requestDocRef = doc(db, 'accessRequests', request.id);
                    return [4 /*yield*/, deleteDoc(requestDocRef)];
                case 3:
                    _a.sent();
                    fetchRequests();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeny = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var requestDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logAdminAction('deny_access_request', "Denied access request for ".concat(request.email))];
                case 1:
                    _a.sent();
                    requestDocRef = doc(db, 'accessRequests', request.id);
                    return [4 /*yield*/, deleteDoc(requestDocRef)];
                case 2:
                    _a.sent();
                    fetchRequests();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Access Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map(function (request) { return (<TableRow key={request.id}>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.displayName}</TableCell>
              <TableCell>{new Date(request.requestedAt.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={function () { return handleApprove(request); }} className="mr-2">Approve</Button>
                <Button onClick={function () { return handleDeny(request); }} variant="destructive">Deny</Button>
              </TableCell>
            </TableRow>); })}
        </TableBody>
      </Table>
    </div>);
}
