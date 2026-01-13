"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Flags;
const react_1 = __importDefault(require("react"));
const Nav_1 = __importDefault(require("../components/Nav"));
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
function Flags() {
    const db = react_1.default.useMemo(() => (0, firestore_1.getFirestore)(firebase_1.app), []);
    const [rows, setRows] = react_1.default.useState([]);
    react_1.default.useEffect(() => {
        (async () => {
            const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, 'featureFlags'));
            setRows(snap.docs.map(d => (Object.assign({ id: d.id }, d.data()))));
        })();
    }, []);
    async function toggleKill() {
        var _a;
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, 'featureFlags', 'kill_switch'), { key: 'kill_switch', value: !((_a = rows.find(r => r.id === 'kill_switch')) === null || _a === void 0 ? void 0 : _a.value), type: 'bool', env: ['staging', 'prod'], rollout: { pct: 0 }, updatedAt: Date.now() });
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Nav_1.default, null),
        react_1.default.createElement("h1", null, "Feature Flags"),
        react_1.default.createElement("button", { onClick: toggleKill }, "Toggle Kill Switch"),
        react_1.default.createElement("pre", null, JSON.stringify(rows, null, 2))));
}
//# sourceMappingURL=Flags.js.map