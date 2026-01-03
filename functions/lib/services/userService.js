"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
require("../firebase");
class UserService {
    constructor() {
        this.db = require("firebase-admin").firestore();
    }
    async getUser(uid) {
        const doc = await this.db.collection('users').doc(uid).get();
        return doc.data();
    }
    async createUser(uid, data) {
        await this.db.collection('users').doc(uid).set(data);
    }
}
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map