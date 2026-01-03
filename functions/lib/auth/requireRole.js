"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
require("../firebase");
const firestore_1 = require("firebase-admin/firestore");
const requireRole = (roles) => {
    return async (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).send('Unauthorized');
            return;
        }
        const userRoles = user.roles || (await (0, firestore_1.getFirestore)().collection('adminUsers').doc(user.uid).get()).data()?.roles;
        if (!userRoles || !roles.some(role => userRoles[role])) {
            res.status(403).send('Forbidden');
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=requireRole.js.map