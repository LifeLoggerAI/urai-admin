"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const supportService_1 = require("../services/supportService");
const router = (0, express_1.Router)();
router.get('/cases', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'support', 'auditor']), async (req, res) => {
    try {
        const cases = await supportService_1.supportService.getCases();
        res.status(200).send(cases);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/case/create', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'support']), async (req, res) => {
    const { supportCase } = req.body;
    const actor = req.user;
    try {
        const caseId = await supportService_1.supportService.createCase(supportCase, { uid: actor.uid, email: actor.email });
        res.status(201).send({ caseId });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/case/message', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'support']), async (req, res) => {
    const { caseId, message } = req.body;
    const actor = req.user;
    try {
        await supportService_1.supportService.addMessage(caseId, message, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/case/close', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'support']), async (req, res) => {
    const { caseId } = req.body;
    const actor = req.user;
    try {
        await supportService_1.supportService.closeCase(caseId, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=supportRoutes.js.map