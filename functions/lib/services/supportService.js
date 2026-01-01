"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportCase = exports.getSupportCases = void 0;
const firebase_admin_1 = require("firebase-admin");
const getSupportCases = async () => {
    const snapshot = await (0, firebase_admin_1.firestore)().collection('supportCases').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
exports.getSupportCases = getSupportCases;
const createSupportCase = async (supportCase) => {
    const { id, ...data } = supportCase;
    await (0, firebase_admin_1.firestore)().collection('supportCases').add({
        ...data,
        createdAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
    });
};
exports.createSupportCase = createSupportCase;
//# sourceMappingURL=supportService.js.map