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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express = __importStar(require("express"));
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const router = express.Router();
exports.healthRoutes = router;
router.use(requireAuth_1.requireAuth);
// Example routes for system health
router.get('/', async (req, res) => {
    res.send('Get system health');
});
router.post('/', (0, requireRole_1.requireRole)(['council', 'ops', 'superAdmin']), async (req, res) => {
    res.send('Update system health');
});
//# sourceMappingURL=healthRoutes.js.map