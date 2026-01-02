import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';
import { incidentService } from '../services/incidentService';

const router = Router();

router.get('/', requireAuth, requireRole(['superAdmin', 'council', 'ops', 'auditor']), async (req, res) => {
    try {
        const incidents = await incidentService.getIncidents();
        res.status(200).send(incidents);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/create', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incident } = req.body;
    const actor = (req as any).user;
    try {
        const incidentId = await incidentService.createIncident(incident, { uid: actor.uid, email: actor.email });
        res.status(201).send({ incidentId });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/update', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incidentId, update } = req.body;
    const actor = (req as any).user;
    try {
        await incidentService.updateIncident(incidentId, update, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/resolve', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
    const { incidentId } = req.body;
    const actor = (req as any).user;
    try {
        await incidentService.resolveIncident(incidentId, { uid: actor.uid, email: actor.email });
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
