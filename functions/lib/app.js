"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./users"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.get('/', (req, res) => res.send('URAI Admin API'));
app.use('/users', users_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map