"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = exports.checkHealth = void 0;
require("../firebase");
const axios_1 = __importDefault(require("axios"));
const db = require("firebase-admin").firestore();
const checkHealth = async () => {
    const config = (await db.collection('config').doc('global').get()).data();
    const checks = {};
    try {
        await db.collection('systemHealth').limit(1).get();
        checks.firestore = { status: 'ok', lastCheckAt: new Date() };
    }
    catch (error) {
        checks.firestore = { status: 'down', lastCheckAt: new Date(), error: { code: error.code, message: error.message } };
    }
    if (config?.links) {
        for (const [name, url] of Object.entries(config.links)) {
            if (url) {
                try {
                    await axios_1.default.get(url);
                    checks[name] = { status: 'ok', lastCheckAt: new Date() };
                }
                catch (error) {
                    checks[name] = { status: 'warn', lastCheckAt: new Date(), error: { message: error.message } };
                }
            }
        }
    }
    for (const [subsystem, result] of Object.entries(checks)) {
        await db.collection('systemHealth').doc(subsystem).set(result, { merge: true });
    }
    return checks;
};
exports.checkHealth = checkHealth;
const getHealthStatus = async () => {
    const snapshot = await db.collection('systemHealth').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
exports.getHealthStatus = getHealthStatus;
//# sourceMappingURL=healthService.js.map