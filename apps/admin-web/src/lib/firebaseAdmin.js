"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDb = exports.adminAuth = void 0;
var app_1 = require("firebase-admin/app");
var auth_1 = require("firebase-admin/auth");
var firestore_1 = require("firebase-admin/firestore");
var apps = (0, app_1.getApps)();
var uraiAdminApp = apps.length
    ? apps[0]
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
exports.adminAuth = (0, auth_1.getAuth)(uraiAdminApp);
exports.adminDb = (0, firestore_1.getFirestore)(uraiAdminApp);
