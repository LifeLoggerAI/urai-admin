import { Router } from 'express';
import { supportService } from '../services/supportService';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';

const router = Router();

router.get('/', requireAuth, requireRole(['support', 'moderator', 'auditor', 'superAdmin']), async (req, res) => {
  const cases = await supportService.getCases();
  res.json(cases);
});

router.post('/create', requireAuth, async (req, res) => {
  const id = await supportService.createCase(req.body, (req as any).user);
  res.status(201).json({ id });
});

router.post('/message', requireAuth, requireRole(['support', 'moderator', 'superAdmin']), async (req, res) => {
  const { caseId, message } = req.body;
  await supportService.addMessage(caseId, message, (req as any).user);
  res.sendStatus(200);
});

router.post('/close', requireAuth, requireRole(['support', 'moderator', 'superAdmin']), async (req, res) => {
  const { caseId } = req.body;
  await supportService.closeCase(caseId, (req as any).user);
  res.sendStatus(200);
});

export const supportRoutes = router;
