"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        return react_1.default.createElement(react_router_dom_1.Navigate, { to: "/login" });
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
//# sourceMappingURL=ProtectedRoute.js.map