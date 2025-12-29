"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const authz_1 = require("./authz");
exports.listUsers = functions.https.onCall(async (data, context) => {
    await (0, authz_1.requireAdmin)(context);
    const users = await admin.auth().listUsers();
    return { users: users.users.map(user => ({ uid: user.uid, email: user.email, disabled: user.disabled })) };
});
//# sourceMappingURL=users.js.map