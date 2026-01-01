"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertFlag = exports.getFlags = void 0;
const firebase_admin_1 = require("firebase-admin");
const getFlags = async () => {
    const snapshot = await (0, firebase_admin_1.firestore)().collection('featureFlags').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
exports.getFlags = getFlags;
const upsertFlag = async (flag) => {
    const { id, ...data } = flag;
    await (0, firebase_admin_1.firestore)().collection('featureFlags').doc(id).set(data, { merge: true });
};
exports.upsertFlag = upsertFlag;
//# sourceMappingURL=flagsService.js.map