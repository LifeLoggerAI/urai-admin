"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("firebase-admin");
const getToken = async (tokenId) => {
    const tokenDoc = await (0, firebase_admin_1.firestore)().collection('crossProjectTokens').doc(tokenId).get();
    return tokenDoc.data();
};
//# sourceMappingURL=crossProjectService.js.map