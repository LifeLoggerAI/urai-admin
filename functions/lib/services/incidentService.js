"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidentService = void 0;
const firebase_1 = require("../firebase");
const auditService_1 = require("./auditService");
class IncidentService {
    constructor() {
        this.db = firebase_1.admin.firestore();
    }
    async getIncidents() {
        const snapshot = await this.db.collection('incidents').orderBy('updatedAt', 'desc').get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    async createIncident(incident, actor) {
        const newIncident = await this.db.collection('incidents').add({
            ...incident,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
            timeline: [{ at: new Date(), text: 'Incident created', byUid: actor.uid }]
        });
        await auditService_1.auditService.log('INCIDENT_CREATE', { incidentId: newIncident.id }, actor);
        return newIncident.id;
    }
    async updateIncident(incidentId, update, actor) {
        await this.db.collection('incidents').doc(incidentId).update({ ...update, updatedAt: new Date() });
        await this.db.collection('incidents').doc(incidentId).update({
            timeline: firebase_1.admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: `Incident updated: ${Object.keys(update).join(', ')}`, byUid: actor.uid })
        });
        await auditService_1.auditService.log('INCIDENT_UPDATE', { incidentId, update }, actor);
    }
    async resolveIncident(incidentId, actor) {
        await this.db.collection('incidents').doc(incidentId).update({ status: 'resolved', resolvedAt: new Date(), updatedAt: new Date() });
        await this.db.collection('incidents').doc(incidentId).update({
            timeline: firebase_1.admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: 'Incident resolved', byUid: actor.uid })
        });
        await auditService_1.auditService.log('INCIDENT_RESOLVE', { incidentId }, actor);
    }
}
exports.incidentService = new IncidentService();
//# sourceMappingURL=incidentService.js.map