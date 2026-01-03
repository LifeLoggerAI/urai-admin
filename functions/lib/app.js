"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./firebase");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firestore_1 = require("firebase-admin/firestore");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const flagsRoutes_1 = __importDefault(require("./routes/flagsRoutes"));
const incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const app = (0, express_1.default)();
const db = (0, firestore_1.getFirestore)();
db.collection("config").doc("global").get().then(configDoc => {
    const config = configDoc.data();
    if (config && config.allowOrigins) {
        app.use((0, cors_1.default)({ origin: config.allowOrigins }));
    }
});
app.use(express_1.default.json());
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/flags", flagsRoutes_1.default);
app.use("/api/incidents", incidentRoutes_1.default);
app.use("/api/support", supportRoutes_1.default);
app.use("/api/health", healthRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map