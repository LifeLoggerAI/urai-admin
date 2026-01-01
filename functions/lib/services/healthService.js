"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHealth = void 0;
const firebase_admin_1 = require("firebase-admin");
const checkHealth = async () => {
    try {
        // A simple check to confirm Firestore is reachable
        await (0, firebase_admin_1.firestore)().collection('_health').get();
        return { status: 'ok', message: 'Firestore is reachable' };
    }
    catch (error) {
        console.error('Health check failed', error);
        return { status: 'down', message: 'Firestore is not reachable' };
    }
};
exports.checkHealth = checkHealth;
//# sourceMappingURL=healthService.js.map