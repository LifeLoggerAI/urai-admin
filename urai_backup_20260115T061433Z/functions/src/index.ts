import * as admin from 'firebase-admin';
import { https, logger, runWith } from 'firebase-functions';
import { z } from 'zod';

admin.initializeApp();

const db = admin.firestore();
const SUPER_ADMIN_BREAK_GLASS = ['super@urai.com'];

const hasRole = (claims, role) => claims[role] === true;
const isSuperAdmin = (claims) => hasRole(claims, 'super_admin');
const isAdmin = (claims) => isSuperAdmin(claims) || hasRole(claims, 'admin');

const writeAudit = async (action, context, details) => {
  if (!context.auth) return;
  await db.collection('auditEvents').add({
    action,
    actor: { uid: context.auth.uid, email: context.auth.token.email },
    details,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const claimsSchema = z.object({
  uid: z.string().min(1),
  claims: z.object({
    super_admin: z.boolean().optional(),
    admin: z.boolean().optional(),
    ops: z.boolean().optional(),
    support: z.boolean().optional(),
    analytics_admin: z.boolean().optional(),
    privacy_admin: z.boolean().optional(),
    reviewer: z.boolean().optional(),
  }).passthrough(),
});

const functionsWithSecrets = runWith({ secrets: ["SUPERADMIN_EMAILS"] });

export const admin_whoami = https.onCall((data, context) => {
    if (!context.auth) throw new https.HttpsError('unauthenticated', 'Auth required.');
    return { uid: context.auth.uid, email: context.auth.token.email, claims: context.auth.token };
});

export const admin_setClaims = https.onCall(async (data, context) => {
    if (!context.auth || !isSuperAdmin(context.auth.token)) {
        throw new https.HttpsError('permission-denied', 'Super admin only.');
    }
    const { uid, claims } = claimsSchema.parse(data);
    await admin.auth().setCustomUserClaims(uid, claims);
    await writeAudit('set_claims', context, { target: uid, claims });
    logger.info(`Claims set for ${uid} by ${context.auth.uid}`, { uid, claims });
    return { success: true };
});

export const admin_revokeClaims = https.onCall(async (data, context) => {
    if (!context.auth || !isSuperAdmin(context.auth.token)) {
        throw new https.HttpsError('permission-denied', 'Super admin only.');
    }
    const { uid } = z.object({ uid: z.string().min(1) }).parse(data);
    await admin.auth().setCustomUserClaims(uid, {});
    await writeAudit('revoke_claims', context, { target: uid });
    logger.warn(`All claims revoked for ${uid} by ${context.auth.uid}`);
    return { success: true };
});

export const api_health = https.onRequest((req, res) => {
    res.status(200).send({ status: 'ok', projectId: process.env.GCLOUD_PROJECT });
});
