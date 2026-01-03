"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const incidentService_1 = require("../services/incidentService");
const router = (0, express_1.Router)();
router.get('/', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops', 'auditor']), async (req, res) => {
    try {
        const incidents = await incidentService_1.incidentService.getIncidents();
        res.status(200).send(incidents);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/create', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incident } = req.body;
    const actor = req.user;
    try {
        const incidentId = await incidentService_1.incidentService.createIncident(incident, { uid: actor.uid, email: actor.email });
        res.status(201).send({ incidentId });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/update', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incidentId, update } = req.body;
    const actor = req.user;
    try {
        await incidentService_1.incidentService.updateIncident(incidentId, update, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.post('/resolve', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incidentId } = req.body;
    const actor = req.user;
    try {
        await incidentService_1.incidentService.resolveIncident(incidentId, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=incidentRoutes.js.map