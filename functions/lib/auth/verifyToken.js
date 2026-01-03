"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const firebase_1 = require("../firebase");
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decodedToken = await firebase_1.admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        return next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Unauthorized');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map