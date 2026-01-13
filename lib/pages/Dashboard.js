"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_1 = __importDefault(require("react"));
const Nav_1 = __importDefault(require("../components/Nav"));
function Dashboard() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Nav_1.default, null),
        react_1.default.createElement("h1", null, "URAI Admin"),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null, "App Check: enforced"),
            react_1.default.createElement("li", null, "Flags synced: see /flags"),
            react_1.default.createElement("li", null, "DSR queue: see /dsr"))));
}
//# sourceMappingURL=Dashboard.js.map