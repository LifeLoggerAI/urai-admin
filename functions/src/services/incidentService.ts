import { firestore } from 'firebase-admin';
import { db } from '../app';
import { auditService } from './auditService';

export const incidentService = {
  async getIncidents() {
    const snapshot = await db.collection('incidents').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async createIncident(incident: any, actor: any) {
    const newIncidentRef = db.collection('incidents').doc();
    await newIncidentRef.set({
      ...incident,
      startedAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      status: 'open',
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'INCIDENT_CREATE',
      target: { type: 'incident', id: newIncidentRef.id },
    });
    return newIncidentRef.id;
  },

  async updateIncident(id: string, update: any, actor: any) {
    await db.collection('incidents').doc(id).update({
      ...update,
      updatedAt: firestore.Timestamp.now(),
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'INCIDENT_UPDATE',
      target: { type: 'incident', id },
    });
  },

  async resolveIncident(id: string, actor: any) {
    await db.collection('incidents').doc(id).update({
      status: 'resolved',
      resolvedAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    });
    await auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'INCIDENT_RESOLVE',
      target: { type: 'incident', id },
    });
  },
};
