import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

class HealthService {
    private db = getFirestore();

    async checkHealth() {
        const config = (await this.db.collection('config').doc('global').get()).data();
        const checks: any = {};

        try {
            await this.db.collection('systemHealth').limit(1).get();
            checks.firestore = { status: 'ok', lastCheckAt: new Date() };
        } catch (error: any) {
            checks.firestore = { status: 'down', lastCheckAt: new Date(), error: { code: error.code, message: error.message } };
        }

        if (config?.links) {
            for (const [name, url] of Object.entries(config.links)) {
                if (url) {
                    try {
                        await axios.get(url as string);
                        checks[name] = { status: 'ok', lastCheckAt: new Date() };
                    } catch (error: any) {
                        checks[name] = { status: 'warn', lastCheckAt: new Date(), error: { message: error.message } };
                    }
                }
            }
        }

        for (const [subsystem, result] of Object.entries(checks)) {
            await this.db.collection('systemHealth').doc(subsystem).set(result, { merge: true });
        }

        return checks;
    }

    async getStatus() {
        const snapshot = await this.db.collection('systemHealth').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

export const healthService = new HealthService();
