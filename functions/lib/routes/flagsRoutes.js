"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../auth/requireAuth");
const requireRole_1 = require("../auth/requireRole");
const flagsService_1 = require("../services/flagsService");
const auditService_1 = require("../services/auditService");
const router = (0, express_1.Router)();
router.get('/', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const flags = await (0, flagsService_1.getFlags)();
        res.status(200).send(flags);
    }
    catch (error) {
        console.error('Error getting flags', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});
router.post('/upsert', requireAuth_1.requireAuth, (0, requireRole_1.requireRole)('council'), async (req, res) => {
    try {
        await (0, flagsService_1.upsertFlag)(req.body);
        await (0, auditService_1.logAuditEvent)(req.user.uid, req.user.email, 'FEATUREFLAG_UPDATE', { type: 'flag', id: req.body.key });
        res.status(200).send({ success: true });
    }
    catch (error) {
        console.error('Error upserting flag', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=flagsRoutes.js.map