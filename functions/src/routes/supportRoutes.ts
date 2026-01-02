import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';
import { supportService } from '../services/supportService';

const router = Router();

router.get('/cases', requireAuth, requireRole(['superAdmin', 'support', 'auditor']), async (req, res) => {
    try {
        const cases = await supportService.getCases();
        res.status(200).send(cases);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/case/create', requireAuth, requireRole(['superAdmin', 'support']), async (req, res) => {
    const { supportCase } = req.body;
    const actor = (req as any).user;
    try {
        const caseId = await supportService.createCase(supportCase, { uid: actor.uid, email: actor.email });
        res.status(201).send({ caseId });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/case/message', requireAuth, requireRole(['superAdmin', 'support']), async (req, res) => {
    const { caseId, message } = req.body;
    const actor = (req as any).user;
    try {
        await supportService.addMessage(caseId, message, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/case/close', requireAuth, requireRole(['superAdmin', 'support']), async (req, res) => {
    const { caseId } = req.body;
    const actor = (req as any).user;
    try {
        await supportService.closeCase(caseId, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
