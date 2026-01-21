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
var react_1 = require("react");
var functions_1 = require("firebase/functions");
var AdminsPage = function () {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var functions, adminListUsers, result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        functions = (0, functions_1.getFunctions)();
                        adminListUsers = (0, functions_1.httpsCallable)(functions, 'adminListUsers');
                        return [4 /*yield*/, adminListUsers()];
                    case 1:
                        result = _a.sent();
                        data = result.data;
                        setUsers(data.users);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchUsers();
    }, []);
    var handleRoleChange = function (uid, role) { return __awaiter(void 0, void 0, void 0, function () {
        var functions, adminSetRole, adminListUsers, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    functions = (0, functions_1.getFunctions)();
                    adminSetRole = (0, functions_1.httpsCallable)(functions, 'adminSetRole');
                    return [4 /*yield*/, adminSetRole({ uid: uid, role: role })];
                case 1:
                    _a.sent();
                    adminListUsers = (0, functions_1.httpsCallable)(functions, 'adminListUsers');
                    return [4 /*yield*/, adminListUsers()];
                case 2:
                    result = _a.sent();
                    data = result.data;
                    setUsers(data.users);
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return <p>Loading...</p>;
    }
    return (<div>
      <h1>Admins Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(function (user) {
            var _a, _b;
            return (<tr key={user.uid}>
              <td>{user.email}</td>
              <td>{(_a = user.customClaims) === null || _a === void 0 ? void 0 : _a.uraiRole}</td>
              <td>
                <select value={(_b = user.customClaims) === null || _b === void 0 ? void 0 : _b.uraiRole} onChange={function (e) { return handleRoleChange(user.uid, e.target.value); }}>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
            </tr>);
        })}
        </tbody>
      </table>
    </div>);
};
exports.default = AdminsPage;
