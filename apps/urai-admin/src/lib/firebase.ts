
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1');

// V2 Admin API
export const adminListUsers = httpsCallable(functions, 'adminlistusersv2');
export const adminSetUserRole = httpsCallable(functions, 'adminsetuserrolev2');
export const adminUpdateUserFlags = httpsCallable(functions, 'adminupdateuserflags');
export const adminGetSystemStatus = httpsCallable(functions, 'admingetsystemstatus');
export const adminUpdateSystemStatus = httpsCallable(functions, 'adminupdatesystemstatus');
export const adminListAuditLogs = httpsCallable(functions, 'adminlistauditlogs');

// Execution Runs
export const adminListExecutionRuns = httpsCallable(functions, 'adminlistexecutionruns');
export const adminPauseRun = httpsCallable(functions, 'adminpauserun');
export const adminResumeRun = httpsCallable(functions, 'adminresumerun');
export const adminCancelRun = httpsCallable(functions, 'admincancelrun');
export const adminRerun = httpsCallable(functions, 'adminrerun');

// Asset Renders
export const adminListRenders = httpsCallable(functions, 'adminlistrenders');
export const adminQueueAssetCleanup = httpsCallable(functions, 'adminqueueassetcleanup');

// Notifications
export const adminListNotificationLogs = httpsCallable(functions, 'adminlistnotificationlogs');
export const adminRetryNotification = httpsCallable(functions, 'adminretrynotification');
export const adminGetProviderStatus = httpsCallable(functions, 'admingetproviderstatus');

// Content / Templates
export const adminListTemplates = httpsCallable(functions, 'adminlisttemplates');
export const adminGetTemplateVersions = httpsCallable(functions, 'admingettemplateversions');
export const adminUpdateTemplate = httpsCallable(functions, 'adminupdatetemplate');
export const adminRollbackTemplate = httpsCallable(functions, 'adminrollbacktemplate');


export { auth, db, functions };
