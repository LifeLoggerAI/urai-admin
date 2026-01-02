import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { requireRole } from '../auth/requireRole';
import { setCustomClaims } from '../auth/setCustomClaims';

const router = Router();

router.post('/roles/set', requireAuth, requireRole(['superAdmin']), async (req, res) => {
    const { uid, roles } = req.body;
    try {
        await setCustomClaims(uid, roles);
        res.status(200).send({ success: true });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
