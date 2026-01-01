"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncident = exports.getIncidents = void 0;
const firebase_admin_1 = require("firebase-admin");
const getIncidents = async () => {
    const snapshot = await (0, firebase_admin_1.firestore)().collection('incidents').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
exports.getIncidents = getIncidents;
const createIncident = async (incident) => {
    const { id, ...data } = incident;
    await (0, firebase_admin_1.firestore)().collection('incidents').add({
        ...data,
        createdAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
    });
};
exports.createIncident = createIncident;
//# sourceMappingURL=incidentService.js.map