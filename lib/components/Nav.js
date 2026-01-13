"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nav;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const items = [
    { to: '/', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/flags', label: 'Flags' },
    { to: '/reports', label: 'Reports' },
    { to: '/dsr', label: 'DSR' },
];
function Nav() {
    const { pathname } = (0, react_router_dom_1.useLocation)();
    return (react_1.default.createElement("nav", { style: { display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' } }, items.map(i => (react_1.default.createElement(react_router_dom_1.Link, { key: i.to, to: i.to, style: {
            fontWeight: pathname === i.to ? 700 : 400,
            textDecoration: pathname === i.to ? 'underline' : 'none'
        } }, i.label)))));
}
//# sourceMappingURL=Nav.js.map