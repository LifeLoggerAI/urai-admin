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
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { logAdminAction } from '@/lib/audit';
export default function FeatureFlagsPage() {
    var _this = this;
    var _a = useState([]), flags = _a[0], setFlags = _a[1];
    var _b = useState(''), newFlagName = _b[0], setNewFlagName = _b[1];
    var _c = useState(''), newFlagDescription = _c[0], setNewFlagDescription = _c[1];
    var fetchFlags = function () { return __awaiter(_this, void 0, void 0, function () {
        var flagsCollection, flagsSnapshot, flagsList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flagsCollection = collection(db, 'featureFlags');
                    return [4 /*yield*/, getDocs(flagsCollection)];
                case 1:
                    flagsSnapshot = _a.sent();
                    flagsList = flagsSnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    setFlags(flagsList);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchFlags();
    }, []);
    var handleCreateFlag = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newFlagName) return [3 /*break*/, 3];
                    return [4 /*yield*/, addDoc(collection(db, 'featureFlags'), {
                            name: newFlagName,
                            description: newFlagDescription,
                            enabled: false,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, logAdminAction('create_feature_flag', "Created feature flag \"".concat(newFlagName, "\""))];
                case 2:
                    _a.sent();
                    setNewFlagName('');
                    setNewFlagDescription('');
                    fetchFlags();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleFlag = function (flag) { return __awaiter(_this, void 0, void 0, function () {
        var flagDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flagDocRef = doc(db, 'featureFlags', flag.id);
                    return [4 /*yield*/, setDoc(flagDocRef, __assign(__assign({}, flag), { enabled: !flag.enabled }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, logAdminAction('toggle_feature_flag', "Toggled feature flag \"".concat(flag.name, "\" to ").concat(!flag.enabled))];
                case 2:
                    _a.sent();
                    fetchFlags();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteFlag = function (flag) { return __awaiter(_this, void 0, void 0, function () {
        var flagDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flagDocRef = doc(db, 'featureFlags', flag.id);
                    return [4 /*yield*/, deleteDoc(flagDocRef)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, logAdminAction('delete_feature_flag', "Deleted feature flag \"".concat(flag.name, "\""))];
                case 2:
                    _a.sent();
                    fetchFlags();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feature Flags</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Create New Flag</h2>
        <div className="flex gap-2">
          <Input placeholder="Flag Name" value={newFlagName} onChange={function (e) { return setNewFlagName(e.target.value); }}/>
          <Input placeholder="Flag Description" value={newFlagDescription} onChange={function (e) { return setNewFlagDescription(e.target.value); }}/>
          <Button onClick={handleCreateFlag}>Create</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map(function (flag) { return (<TableRow key={flag.id}>
              <TableCell>{flag.name}</TableCell>
              <TableCell>{flag.description}</TableCell>
              <TableCell>{flag.enabled ? 'Enabled' : 'Disabled'}</TableCell>
              <TableCell>
                <Button onClick={function () { return handleToggleFlag(flag); }} className="mr-2">
                  {flag.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button onClick={function () { return handleDeleteFlag(flag); }} variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>); })}
        </TableBody>
      </Table>
    </div>);
}
