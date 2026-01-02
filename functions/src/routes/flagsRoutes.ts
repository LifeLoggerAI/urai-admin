import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';
import { flagsService } from '../services/flagsService';

const router = Router();

router.get('/', requireAuth, requireRole(['superAdmin', 'council', 'ops', 'support']), async (req, res) => {
    try {
        const flags = await flagsService.getFlags();
        res.status(200).send(flags);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/upsert', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { flag } = req.body;
    const actor = (req as any).user;
    try {
        await flagsService.upsertFlag(flag, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/toggle', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { flagId, enabled } = req.body;
    const actor = (req as any).user;
    try {
        await flagsService.toggleFlag(flagId, enabled, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
