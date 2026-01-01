import { Router } from 'express';
import { incidentService } from '../services/incidentService';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const incidents = await incidentService.getIncidents();
  res.json(incidents);
});

router.post('/create', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
  const id = await incidentService.createIncident(req.body, (req as any).user);
  res.status(201).json({ id });
});

router.post('/update', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
  const { id, ...update } = req.body;
  await incidentService.updateIncident(id, update, (req as any).user);
  res.sendStatus(200);
});

router.post('/resolve', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
  const { id } = req.body;
  await incidentService.resolveIncident(id, (req as any).user);
  res.sendStatus(200);
});

export const incidentRoutes = router;
