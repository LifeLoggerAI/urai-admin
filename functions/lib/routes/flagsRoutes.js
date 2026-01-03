"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const flagsService_1 = require("../services/flagsService");
const router = (0, express_1.Router)();
router.get('/', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops', 'support']), async (req, res) => {
    try {
        const flags = await flagsService_1.flagsService.getFlags();
        res.status(200).send(flags);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/upsert', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { flag } = req.body;
    const actor = req.user;
    try {
        await flagsService_1.flagsService.upsertFlag(flag, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
router.post('/toggle', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { flagId, enabled } = req.body;
    const actor = req.user;
    try {
        await flagsService_1.flagsService.toggleFlag(flagId, enabled, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=flagsRoutes.js.map