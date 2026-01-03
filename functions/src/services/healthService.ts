import "../firebase";
import { DocumentData, PartialWithFieldValue } from 'firebase-admin/firestore';
import axios from 'axios';

const db = require("firebase-admin").firestore();

export const checkHealth = async () => {
    const config = (await db.collection('config').doc('global').get()).data();
    const checks: any = {};

    try {
        await db.collection('systemHealth').limit(1).get();
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
        await db.collection('systemHealth').doc(subsystem).set(result as PartialWithFieldValue<DocumentData>, { merge: true });
    }

    return checks;
}

export const getHealthStatus = async () => {
    const snapshot = await db.collection('systemHealth').get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
