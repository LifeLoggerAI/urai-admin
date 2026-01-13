"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DSR;
const react_1 = __importDefault(require("react"));
const Nav_1 = __importDefault(require("../components/Nav"));
const firebase_1 = require("../firebase");
function DSR() {
    const request = react_1.default.useMemo(() => (0, firebase_1.call)('admin_requestDSR'), []);
    const [userId, setUserId] = react_1.default.useState('');
    const [type, setType] = react_1.default.useState('export');
    const [result, setResult] = react_1.default.useState(null);
    async function submit() { const res = await request({ userId, type }); setResult(res.data); }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Nav_1.default, null),
        react_1.default.createElement("h1", null, "DSR"),
        react_1.default.createElement("input", { placeholder: "userId", value: userId, onChange: e => setUserId(e.target.value) }),
        react_1.default.createElement("select", { value: type, onChange: e => setType(e.target.value) },
            react_1.default.createElement("option", { value: "export" }, "export"),
            react_1.default.createElement("option", { value: "delete" }, "delete")),
        react_1.default.createElement("button", { onClick: submit }, "Queue"),
        result && react_1.default.createElement("pre", null, JSON.stringify(result, null, 2))));
}
//# sourceMappingURL=DSR.js.map