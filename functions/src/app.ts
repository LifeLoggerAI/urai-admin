import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import { flagsRoutes } from './routes/flagsRoutes';
import { incidentRoutes } from './routes/incidentRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { supportRoutes } from './routes/supportRoutes';

admin.initializeApp();

export const adminApp = admin.app();
export const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

app.use('/flags', flagsRoutes);
app.use('/incidents', incidentRoutes);
app.use('/health', healthRoutes);
app.use('/support', supportRoutes);

export const api = app;
