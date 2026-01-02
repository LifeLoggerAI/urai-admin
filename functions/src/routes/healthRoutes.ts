import * as express from "express";
import { requireAuth } from "../auth/requireAuth";
import { requireRole } from "../auth/requireRole";
import { checkHealth, getHealthStatus } from "../services/healthService";

const router = express.Router();

router.post("/check", requireAuth, requireRole(['ops', 'superAdmin']), async (req, res) => {
    const user = (req as any).user;
    try {
        await checkHealth(user.uid, user.email);
        res.status(200).send({ status: 'success' });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.get("/status", requireAuth, async (req, res) => {
    try {
        const status = await getHealthStatus();
        res.status(200).send(status);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;