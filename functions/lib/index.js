"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
// import * as functions from "firebase-functions/v1";
require("./firebase");
const https_1 = require("firebase-functions/v2/https");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const flagsRoutes_1 = __importDefault(require("./routes/flagsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [/\/\/localhost:/, "https://urai.org"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use("/health", healthRoutes_1.default);
app.use("/incidents", incidentRoutes_1.default);
app.use("/support", supportRoutes_1.default);
app.use("/flags", flagsRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
exports.api = (0, https_1.onRequest)(app);
// Placeholder for the enforceRetention function
// export const enforceRetention = functions.pubsub.schedule("every 24 hours").onRun(async (context: functions.EventContext) => {
//   console.log("Running enforceRetention placeholder");
// });
//# sourceMappingURL=index.js.map