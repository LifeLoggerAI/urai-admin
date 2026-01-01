import { Router } from 'express';
import { flagsService } from '../services/flagsService';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const flags = await flagsService.getFlags();
  res.json(flags);
});

router.post('/upsert', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
  await flagsService.upsertFlag(req.body, (req as any).user);
  res.sendStatus(200);
});

router.post('/toggle', requireAuth, requireRole(['superAdmin', 'council', 'ops']), async (req, res) => {
  const { id, enabled } = req.body;
  await flagsService.toggleFlag(id, enabled, (req as any).user);
  res.sendStatus(200);
});

export const flagsRoutes = router;
