import { Router } from 'express';
import { healthService } from '../services/healthService';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';

const router = Router();

router.post('/check', requireAuth, requireRole(['superAdmin', 'ops']), async (req, res) => {
  await healthService.checkHealth();
  res.sendStatus(200);
});

router.get('/status', requireAuth, async (req, res) => {
  const status = await healthService.getHealthStatus();
  res.json(status);
});

export const healthRoutes = router;
