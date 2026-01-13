"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Reports;
const react_1 = __importDefault(require("react"));
const Nav_1 = __importDefault(require("../components/Nav"));
const firebase_1 = require("../firebase");
const firestore_1 = require("firebase/firestore");
function Reports() {
    const db = react_1.default.useMemo(() => (0, firestore_1.getFirestore)(firebase_1.app), []);
    const [rows, setRows] = react_1.default.useState([]);
    async function load() {
        const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, 'contentReports'));
        setRows(snap.docs.map(d => (Object.assign({ id: d.id }, d.data()))));
    }
    react_1.default.useEffect(() => { load(); }, []);
    async function resolve(id) { await (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, 'contentReports', id), { status: 'resolved', updatedAt: Date.now() }); await load(); }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Nav_1.default, null),
        react_1.default.createElement("h1", null, "Reports"),
        rows.map(r => (react_1.default.createElement("div", { key: r.id, style: { border: '1px solid #eee', padding: 12, margin: '12px 0' } },
            react_1.default.createElement("div", null,
                react_1.default.createElement("b", null, "Type:"),
                " ",
                r.type,
                " ",
                react_1.default.createElement("b", null, "Status:"),
                " ",
                r.status),
            react_1.default.createElement("div", null,
                react_1.default.createElement("b", null, "Reason:"),
                " ",
                r.reason,
                " ",
                react_1.default.createElement("b", null, "Severity:"),
                " ",
                r.severity),
            react_1.default.createElement("button", { onClick: () => resolve(r.id), disabled: r.status === 'resolved' }, "Resolve"))))));
}
//# sourceMappingURL=Reports.js.map