"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = exports.app = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
// TODO: Replace with your actual Firebase project configuration
var firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'urai-admin.firebaseapp.com',
    projectId: 'urai-admin',
    storageBucket: 'urai-admin.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
};
var app = !(0, app_1.getApps)().length ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
exports.app = app;
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;
