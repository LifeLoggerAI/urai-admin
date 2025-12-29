"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportUsers = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const authz_1 = require("./authz");
// A function to export user data
exports.exportUsers = functions.https.onCall(async (data, context) => {
    await (0, authz_1.requireAdmin)(context);
    const users = await admin.auth().listUsers();
    const csv = users.users.map(user => `${user.uid},${user.email},${user.disabled}`).join("\n");
    const bucket = admin.storage().bucket();
    const file = bucket.file(`exports/users_${Date.now()}.csv`);
    await file.save(csv);
    const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 });
    return { downloadUrl: url };
});
//# sourceMappingURL=exports.js.map