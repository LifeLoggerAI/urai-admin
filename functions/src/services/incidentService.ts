import { admin } from "../firebase";
import { auditService } from './auditService';

class IncidentService {
    private db = admin.firestore();

    async getIncidents() {
        const snapshot = await this.db.collection('incidents').orderBy('updatedAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async createIncident(incident: any, actor: any) {
        const newIncident = await this.db.collection('incidents').add({
            ...incident,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
            timeline: [{ at: new Date(), text: 'Incident created', byUid: actor.uid }]
        });
        await auditService.log('INCIDENT_CREATE', { incidentId: newIncident.id }, actor);
        return newIncident.id;
    }

    async updateIncident(incidentId: string, update: any, actor: any) {
        await this.db.collection('incidents').doc(incidentId).update({ ...update, updatedAt: new Date() });
        await this.db.collection('incidents').doc(incidentId).update({
            timeline: admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: `Incident updated: ${Object.keys(update).join(', ')}` , byUid: actor.uid })
        });
        await auditService.log('INCIDENT_UPDATE', { incidentId, update }, actor);
    }

    async resolveIncident(incidentId: string, actor: any) {
        await this.db.collection('incidents').doc(incidentId).update({ status: 'resolved', resolvedAt: new Date(), updatedAt: new Date() });
        await this.db.collection('incidents').doc(incidentId).update({
            timeline: admin.firestore.FieldValue.arrayUnion({ at: new Date(), text: 'Incident resolved', byUid: actor.uid })
        });
        await auditService.log('INCIDENT_RESOLVE', { incidentId }, actor);
    }
}

export const incidentService = new IncidentService();
