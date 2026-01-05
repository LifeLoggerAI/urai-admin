"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminExportUserData = exports.adminDeactivateUser = exports.adminSetRole = exports.adminUserLookup = void 0;
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
// Admin functions
var adminUserLookup_1 = require("./adminUserLookup");
Object.defineProperty(exports, "adminUserLookup", { enumerable: true, get: function () { return adminUserLookup_1.adminUserLookup; } });
var adminSetRole_1 = require("./adminSetRole");
Object.defineProperty(exports, "adminSetRole", { enumerable: true, get: function () { return adminSetRole_1.adminSetRole; } });
var adminDeactivateUser_1 = require("./adminDeactivateUser");
Object.defineProperty(exports, "adminDeactivateUser", { enumerable: true, get: function () { return adminDeactivateUser_1.adminDeactivateUser; } });
var adminExportUserData_1 = require("./adminExportUserData");
Object.defineProperty(exports, "adminExportUserData", { enumerable: true, get: function () { return adminExportUserData_1.adminExportUserData; } });
//# sourceMappingURL=index.js.map