"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const setCustomClaims_1 = require("../auth/setCustomClaims");
const router = (0, express_1.Router)();
router.post('/roles/set', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin']), async (req, res) => {
    const { uid, roles } = req.body;
    try {
        await (0, setCustomClaims_1.setCustomClaims)(uid, roles);
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map