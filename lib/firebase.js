"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = exports.auth = exports.db = exports.app = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const functions_1 = require("firebase/functions");
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
exports.app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(exports.app);
exports.auth = (0, auth_1.getAuth)(exports.app);
const functions = (0, functions_1.getFunctions)(exports.app);
const call = (name) => (0, functions_1.httpsCallable)(functions, name);
exports.call = call;
//# sourceMappingURL=firebase.js.map