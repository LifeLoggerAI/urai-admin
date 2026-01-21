/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";
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
exports.default = AdminActionsPage;
var AdminGate_1 = require("@/components/AdminGate");
var react_1 = require("react");
var functions_1 = require("firebase/functions");
var firebaseClient_1 = require("@/lib/firebaseClient");
function AdminActionsPage() {
    var _a = (0, react_1.useState)(""), uid = _a[0], setUid = _a[1];
    var _b = (0, react_1.useState)(""), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)("admin"), role = _c[0], setRole = _c[1];
    var _d = (0, react_1.useState)(null), out = _d[0], setOut = _d[1];
    function call(name, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var fn, res, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setOut(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        // Force refresh claims so newly-granted admin works instantly
                        return [4 /*yield*/, ((_a = firebaseClient_1.auth.currentUser) === null || _a === void 0 ? void 0 : _a.getIdToken(true))];
                    case 2:
                        // Force refresh claims so newly-granted admin works instantly
                        _b.sent();
                        fn = (0, functions_1.httpsCallable)(firebaseClient_1.functions, name);
                        return [4 /*yield*/, fn(payload)];
                    case 3:
                        res = _b.sent();
                        setOut({ ok: true, data: res.data });
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        setOut({ ok: false, error: { message: e_1 === null || e_1 === void 0 ? void 0 : e_1.message, code: e_1 === null || e_1 === void 0 ? void 0 : e_1.code, details: e_1 === null || e_1 === void 0 ? void 0 : e_1.details } });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (<AdminGate_1.default>
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>/admin-actions</h1>

        <section style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <label>
            UID:
            <input value={uid} onChange={function (e) { return setUid(e.target.value); }} style={{ width: "100%" }}/>
          </label>

          <label>
            Email (for lookup):
            <input value={email} onChange={function (e) { return setEmail(e.target.value); }} style={{ width: "100%" }}/>
          </label>

          <label>
            Role:
            <select value={role} onChange={function (e) { return setRole(e.target.value); }}>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={function () { return call("adminUserLookup", uid ? { uid: uid } : { email: email }); }}> 
              adminUserLookup
            </button>
            <button onClick={function () { return call("adminSetRole", { uid: uid, role: role }); }} disabled={!uid}>
              adminSetRole
            </button>
            <button onClick={function () { return call("adminDeactivateUser", { uid: uid }); }} disabled={!uid}>
              adminDeactivateUser
            </button>
            <button onClick={function () { return call("adminExportUserData", { uid: uid }); }} disabled={!uid}>
              adminExportUserData
            </button>
          </div>

          {out && (<pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
        {JSON.stringify(out, null, 2)}
            </pre>)}
        </section>
      </main>
    </AdminGate_1.default>);
}
